'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDetectiveStore } from '@/store/useDetectiveStore';
import { placeInteractableItem } from '@/lib/three/evidenceBuilders';
import {
  getInteractionPrompt,
  raycastInteractable,
  setRedEdgeHighlight,
} from '@/lib/three/highlightUtils';
import {
  loadAnimatedGlbModel,
  LoadedAnimatedModel,
  updateAnimatedModels,
} from '@/lib/three/glbAnimationManager';
import { RoomAmbiencePlayer } from '@/lib/three/ambientAudio';
import { InteractableAction } from '@/types/mapSchema';

const PI = Math.PI;

export const FirstPersonSceneCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentMap = useDetectiveStore((s) => s.currentMap);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(currentMap.backgroundHex);
    scene.fog = new THREE.Fog(
      currentMap.backgroundHex,
      currentMap.fogNear,
      currentMap.fogFar
    );

    // Tạo bản đồ phản xạ môi trường PBR (PMREM) để kim loại, gỗ bóng, kính trong GLB phản chiếu chân thật
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x121824);
    const eTop = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.MeshBasicMaterial({ color: 0x6a7c9b, side: THREE.DoubleSide })
    );
    eTop.position.set(0, 5, 0);
    eTop.rotation.x = Math.PI / 2;
    envScene.add(eTop);
    const eWarm = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffdca8 })
    );
    eWarm.position.set(3, 3.5, 3);
    envScene.add(eWarm);
    const eCool = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x6898d8 })
    );
    eCool.position.set(-4, 2.5, -3);
    envScene.add(eCool);
    const envRT = pmrem.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    const cam = new THREE.PerspectiveCamera(70, 1, 0.05, 95);
    cam.rotation.order = 'YXZ';
    cam.position.set(
      currentMap.spawn.position[0],
      currentMap.spawn.position[1],
      currentMap.spawn.position[2]
    );
    scene.add(cam);

    const handL = new THREE.PointLight(0xffffff, 0, 3, 0);
    handL.position.set(0.1, 0.3, 0.2);
    cam.add(handL);

    // Đèn pin điều tra viên (bấm F để bật/tắt)
    let flashlightOn = true;
    const flashlight = new THREE.SpotLight(
      0xfff6e5,
      1.35 * PI,
      15,
      Math.PI / 6.2,
      0.58,
      1.1
    );
    flashlight.position.set(0.16, -0.1, 0.05);
    flashlight.target.position.set(0, -0.02, -4);
    cam.add(flashlight);
    cam.add(flashlight.target);

    // Hạt bụi lơ lửng trong không khí dưới ánh đèn
    const dustCount = 220;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 1] = 0.25 + Math.random() * 2.6;
      dustPositions[i * 3 + 2] = -4.8 + Math.random() * 13.2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(dustPositions, 3)
    );
    const dustMat = new THREE.PointsMaterial({
      color: 0xdce6f7,
      size: 0.016,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    dustPoints.raycast = () => {};
    dustPoints.userData.noRaycast = true;
    scene.add(dustPoints);

    const pivot = new THREE.Group();
    pivot.visible = false;
    cam.add(pivot);

    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // Build room environment (walls, floor, lights, switch, security cam)
    const env = currentMap.buildEnvironment(scene, cam);

    // Place items that belong directly to scene
    Object.values(currentMap.items).forEach((itemDef) => {
      if (
        itemDef.initialPlacement &&
        itemDef.initialPlacement.target === 'scene'
      ) {
        placeInteractableItem(
          itemDef.id,
          itemDef.build,
          scene,
          itemDef.initialPlacement.position,
          itemDef.initialPlacement.rotation,
          itemDef.initialPlacement.hitRadius
        );
      }
    });

    // Load animated GLB models (e.g. cabinet.glb)
    const loadedModels: LoadedAnimatedModel[] = [];
    Promise.all(
      currentMap.animatedModels.map((cfg) => loadAnimatedGlbModel(scene, cfg))
    )
      .then((models) => {
        loadedModels.push(...models);
        // Place items parented inside animated model parts (e.g. 'file' inside 'Drawer M')
        Object.values(currentMap.items).forEach((itemDef) => {
          const pl = itemDef.initialPlacement;
          if (pl && pl.target !== 'scene') {
            const targetModel = models.find(
              (m) => m.config.id === (pl.target as { modelId: string }).modelId
            );
            const targetPart =
              targetModel?.parts[(pl.target as { partName: string }).partName];
            if (targetPart) {
              placeInteractableItem(
                itemDef.id,
                itemDef.build,
                targetPart.node,
                pl.position,
                pl.rotation,
                pl.hitRadius
              );
            }
          }
        });
        useDetectiveStore.getState().setModelStatus(true, false);
      })
      .catch(() => {
        useDetectiveStore.getState().setModelStatus(false, true);
      });

    // Player & interaction runtime state
    let locked = false;
    let lockedOnce = false;
    let dragging = false;
    let isSitting = false;
    let isCrouching = false;
    let logicalFloorY = currentMap.spawn.position[1] - 1.65;
    let visualFloorY = logicalFloorY;
    let eyeHeight = 1.65;
    let vx = 0;
    let vz = 0;
    let walkPhase = 0;
    let lastStepIndex = 0;
    let smoothRoll = 0;
    let smoothBobX = 0;
    let smoothBobY = 0;
    let smoothPitchNod = 0;
    let mouseTurnVel = 0;
    let flashLagX = 0;
    let flashLagY = 0;
    let sitAnim: {
      fromPos: THREE.Vector3;
      toPos: THREE.Vector3;
      fromYaw: number;
      toYaw: number;
      fromPitch: number;
      toPitch: number;
      t: number;
    } | null = null;
    const savedStandPos = new THREE.Vector3(
      currentMap.spawn.position[0],
      currentMap.spawn.position[1],
      currentMap.spawn.position[2]
    );
    let yaw = currentMap.spawn.yaw || 0;
    let pitch = currentMap.spawn.pitch || 0;
    const keys: Record<string, boolean> = {};
    let hovered: THREE.Object3D | null = null;
    let frame = 0;

    let insp: {
      item: THREE.Object3D;
      mode: 'take' | 'bag';
      id: string;
      y: number;
      orig: {
        parent: THREE.Object3D | null;
        p: THREE.Vector3;
        q: THREE.Quaternion;
        s: THREE.Vector3;
      };
    } | null = null;

    const ray = new THREE.Raycaster();
    ray.far = 3.6;
    const ambience = new RoomAmbiencePlayer();

    function lockPointer() {
      try {
        const p = cv?.requestPointerLock && cv.requestPointerLock();
        if (p && typeof (p as unknown as Promise<void>).catch === 'function') {
          (p as unknown as Promise<void>).catch(() => {});
        }
      } catch {
        // Ignore pointer lock rejection
      }
    }

    function startInspect(
      item: THREE.Object3D,
      mode: 'take' | 'bag',
      id: string
    ) {
      setRedEdgeHighlight(hovered, false);
      hovered = null;
      const store = useDetectiveStore.getState();
      store.setPromptText(null);

      insp = {
        item,
        mode,
        id,
        y: 0,
        orig: {
          parent: item.parent,
          p: item.position.clone(),
          q: item.quaternion.clone(),
          s: item.scale.clone(),
        },
      };

      const d = item.userData.dist || 0.5;
      pivot.position.set(0, -0.02, -d);
      pivot.rotation.set(
        item.userData.pages ? 0 : 0.35,
        item.userData.pages ? 0 : 0.6,
        0
      );
      item.position.set(0, 0, 0);
      item.quaternion.identity();
      item.scale.setScalar(0.26 / item.userData.size);
      pivot.add(item);
      pivot.visible = true;
      handL.intensity = 0.9 * PI;

      const itemDef = currentMap.items[id];
      store.setInspectMeta({
        id,
        name: itemDef?.name || id,
        desc: itemDef?.desc || '',
        mode,
        hasPages: Boolean(item.userData.pages),
      });
      store.setPhase('inspect');
    }

    function endInspect() {
      if (!insp) return;
      pivot.remove(insp.item);
      pivot.visible = false;
      handL.intensity = 0;
      insp = null;
      const store = useDetectiveStore.getState();
      store.setInspectMeta(null);
      store.setPhase('play');
    }

    function takeItem() {
      if (!insp) return;
      useDetectiveStore.getState().addBagItem(insp.id);
      endInspect();
    }

    function putBack() {
      if (!insp) return;
      const it = insp.item;
      const o = insp.orig;
      if (insp.mode === 'take' && o.parent) {
        o.parent.add(it);
        it.position.copy(o.p);
        it.quaternion.copy(o.q);
        it.scale.copy(o.s);
      }
      endInspect();
    }

    function standUp() {
      if (!isSitting) return;
      isSitting = false;
      sitAnim = {
        fromPos: cam.position.clone(),
        toPos: savedStandPos.clone(),
        fromYaw: yaw,
        toYaw: yaw,
        fromPitch: pitch,
        toPitch: 0,
        t: 0,
      };
    }

    function interact(o: THREE.Object3D) {
      const a = o.userData.act as InteractableAction | undefined;
      if (!a) return;
      if (a.type === 'part') {
        a.p.state = a.p.state === 'closed' ? 'opening' : 'closing';
        if (a.p.isLightSwitch) {
          env.setLamp(!env.getLampOn());
          ambience.playSwitchClick();
        } else {
          ambience.playDoorOrDrawer(a.p.label === 'Door_main');
        }
      } else if (a.type === 'switch') {
        env.setLamp(!env.getLampOn());
        ambience.playSwitchClick();
      } else if (a.type === 'cctv') {
        useDetectiveStore.getState().openCctv();
      } else if (a.type === 'pick') {
        startInspect(o, 'take', a.id);
      } else if (a.type === 'sit') {
        if (isSitting) {
          standUp();
        } else {
          isCrouching = false;
          savedStandPos.set(cam.position.x, visualFloorY + 1.65, cam.position.z);
          isSitting = true;
          vx = 0;
          vz = 0;
          sitAnim = {
            fromPos: cam.position.clone(),
            toPos: new THREE.Vector3(
              a.seat.seatPos[0],
              a.seat.seatPos[1],
              a.seat.seatPos[2]
            ),
            fromYaw: yaw,
            toYaw: a.seat.seatYaw,
            fromPitch: pitch,
            toPitch: a.seat.seatPitch,
            t: 0,
          };
        }
      }
    }

    // Register bridge actions for UI buttons
    useDetectiveStore.getState().registerSceneActions({
      enterOrResumeScene: () => {
        const store = useDetectiveStore.getState();
        if (store.resumeMode) {
          store.setResumeMode(false);
          lockPointer();
          return;
        }
        store.setPhase('play');
        lockPointer();
        ambience.start();
        setTimeout(() => {
          useDetectiveStore.getState().setFadeVisible(false);
        }, 50);
      },
      inspectBagItem: (itemId: string) => {
        const itemDef = currentMap.items[itemId];
        if (!itemDef) return;
        startInspect(itemDef.build(), 'bag', itemId);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.code;
      if (k === 'Tab') e.preventDefault();
      const store = useDetectiveStore.getState();
      const state = store.phase;

      if (state === 'play' && !store.resumeMode) {
        keys[k] = true;
        if (k === 'KeyE') {
          const o = raycastInteractable(
            ray,
            cam,
            scene,
            env.getLampOn(),
            isSitting
          );
          if (o) {
            interact(o);
          } else if (isSitting) {
            standUp();
          }
        } else if (isSitting && (k === 'Space' || k === 'KeyQ')) {
          standUp();
        } else if (!isSitting && (k === 'KeyC' || k === 'ControlLeft')) {
          isCrouching = !isCrouching;
        } else if (k === 'KeyF') {
          flashlightOn = !flashlightOn;
          flashlight.intensity = flashlightOn ? 1.35 * PI : 0;
          ambience.playSwitchClick();
        } else if (k === 'KeyI' || k === 'Tab') {
          store.openPanel('bag');
        } else if (k === 'KeyJ') {
          store.openPanel('dossier');
        }
      } else if (state === 'inspect' && insp) {
        if (k === 'KeyE') {
          if (insp.mode === 'take') takeItem();
          else endInspect();
        } else if (k === 'KeyQ' || k === 'Escape') {
          putBack();
        } else if (
          insp.item.userData.pages &&
          (k === 'KeyA' ||
            k === 'KeyD' ||
            k === 'ArrowLeft' ||
            k === 'ArrowRight')
        ) {
          insp.y =
            pivot.rotation.y +
            (k === 'KeyA' || k === 'ArrowLeft' ? -1 : 1) * Math.PI;
        }
      } else if (state === 'cctv') {
        if (k === 'Escape' || k === 'KeyE' || k === 'KeyQ') {
          store.closeCctv();
        }
      } else if (state === 'panel') {
        if (k === 'Escape' || k === 'KeyI' || k === 'KeyJ' || k === 'Tab') {
          store.closePanels();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!(locked || dragging)) return;
      const state = useDetectiveStore.getState().phase;
      if (state === 'play') {
        const dyaw = e.movementX * 0.0022;
        const dpitch = e.movementY * 0.0022;
        yaw -= dyaw;
        pitch = Math.max(-1.4, Math.min(1.4, pitch - dpitch));
        mouseTurnVel = THREE.MathUtils.clamp(mouseTurnVel + dyaw * 3.5, -1, 1);
        flashLagX = THREE.MathUtils.clamp(flashLagX + dyaw * 1.4, -0.35, 0.35);
        flashLagY = THREE.MathUtils.clamp(flashLagY - dpitch * 1.4, -0.35, 0.35);
      } else if (state === 'inspect') {
        pivot.rotation.y += e.movementX * 0.01;
        pivot.rotation.x += e.movementY * 0.01;
      }
    };

    const onMouseDown = () => {
      const store = useDetectiveStore.getState();
      if (
        !locked &&
        !store.resumeMode &&
        (store.phase === 'play' || store.phase === 'inspect')
      ) {
        dragging = true;
        lockPointer();
      }
    };

    const onMouseUp = () => {
      dragging = false;
    };

    const onPointerLockChange = () => {
      locked = document.pointerLockElement === cv;
      if (locked) {
        lockedOnce = true;
      } else if (lockedOnce && useDetectiveStore.getState().phase === 'play') {
        useDetectiveStore.getState().setResumeMode(true);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    cv.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    let last = performance.now();
    let rafId = 0;

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const store = useDetectiveStore.getState();
      const state = store.phase;

      if (state === 'play' && !store.resumeMode) {
        if (sitAnim) {
          sitAnim.t = Math.min(1, sitAnim.t + dt * 2.4);
          const u = sitAnim.t;
          const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
          cam.position.lerpVectors(sitAnim.fromPos, sitAnim.toPos, ease);
          let dy = sitAnim.toYaw - sitAnim.fromYaw;
          while (dy > Math.PI) dy -= Math.PI * 2;
          while (dy < -Math.PI) dy += Math.PI * 2;
          yaw = sitAnim.fromYaw + dy * ease;
          pitch = sitAnim.fromPitch + (sitAnim.toPitch - sitAnim.fromPitch) * ease;
          if (sitAnim.t >= 1) {
            sitAnim = null;
          }
          cam.rotation.set(pitch, yaw, 0);
        } else if (!isSitting) {
          const f = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
          const r = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
          const isSprinting =
            Boolean(keys.ShiftLeft || keys.ShiftRight) && !isCrouching && f > 0;

          const maxSp = isCrouching ? 1.65 : isSprinting ? 4.35 : 2.8;
          const norm = f && r ? 0.7071 : 1;
          const targetVx = (-Math.sin(yaw) * f + Math.cos(yaw) * r) * norm * maxSp;
          const targetVz = (-Math.cos(yaw) * f - Math.sin(yaw) * r) * norm * maxSp;

          // Quán tính gia tốc & ma sát dừng mượt mà
          const accel = f || r ? 11 : 14;
          vx += (targetVx - vx) * Math.min(1, dt * accel);
          vz += (targetVz - vz) * Math.min(1, dt * accel);

          const speed = Math.hypot(vx, vz);
          if (speed > 0.015) {
            const openDoors: Record<string, boolean> = {};
            for (const m of loadedModels) {
              const dp = m.parts['Door_main'];
              if (dp) {
                openDoors[m.config.id] = dp.state === 'open';
              }
            }
            const dx = vx * dt;
            const dz = vz * dt;
            const prevX = cam.position.x;
            const prevZ = cam.position.z;
            if (
              !env.isBlocked(
                cam.position.x + dx,
                cam.position.z,
                openDoors,
                logicalFloorY
              )
            ) {
              cam.position.x += dx;
            }
            if (
              !env.isBlocked(
                cam.position.x,
                cam.position.z + dz,
                openDoors,
                logicalFloorY
              )
            ) {
              cam.position.z += dz;
            }
            const actualSpeed =
              Math.hypot(cam.position.x - prevX, cam.position.z - prevZ) /
              Math.max(dt, 0.001);

            if (env.getFloorY) {
              logicalFloorY = env.getFloorY(
                cam.position.x,
                cam.position.z,
                logicalFloorY
              );
            }

            // Chu kỳ bước chân 3D + âm thanh bước chân theo từng chất liệu sàn
            if (actualSpeed > 0.25) {
              walkPhase += dt * (isSprinting ? 11.2 : isCrouching ? 6.2 : 8.2);
              const stepIdx = Math.floor((walkPhase + 0.35) / Math.PI);
              if (stepIdx !== lastStepIndex) {
                lastStepIndex = stepIdx;
                const px = cam.position.x;
                const pz = cam.position.z;
                const surface =
                  px >= 6.45
                    ? 'stairs'
                    : pz > 9.0
                    ? 'outdoor'
                    : pz < 4.65 && !(logicalFloorY < -1.6 && px > -4.0)
                    ? 'wood'
                    : 'tile';
                ambience.playFootstep(surface, isSprinting);
              }
            }
          }

          // Nội suy chiều cao mắt (đứng 1.65m / ngồi xổm 0.98m) và độ cao tầng/cầu thang
          const targetEye = isCrouching ? 0.98 : 1.65;
          eyeHeight += (targetEye - eyeHeight) * Math.min(1, dt * 10);
          visualFloorY +=
            (logicalFloorY - visualFloorY) * Math.min(1, dt * 16);

          // Nhịp nhún đầu 3 trục (dọc + lắc ngang + gật nhẹ) + nhịp thở khi đứng yên
          const moveFactor = Math.min(1, speed / 2.6);
          const bobAmpY = isSprinting ? 0.042 : isCrouching ? 0.016 : 0.026;
          const bobAmpX = isSprinting ? 0.024 : 0.014;
          const targetBobY =
            moveFactor > 0.05
              ? -Math.abs(Math.cos(walkPhase)) * bobAmpY * moveFactor
              : Math.sin(now * 0.002) * 0.0045;
          const targetBobX =
            moveFactor > 0.05
              ? Math.sin(walkPhase) * bobAmpX * moveFactor
              : Math.cos(now * 0.001) * 0.002;
          const targetPitchNod =
            moveFactor > 0.05
              ? Math.sin(walkPhase * 2) * 0.005 * moveFactor
              : Math.sin(now * 0.002) * 0.0015;

          smoothBobY += (targetBobY - smoothBobY) * Math.min(1, dt * 14);
          smoothBobX += (targetBobX - smoothBobX) * Math.min(1, dt * 12);
          smoothPitchNod +=
            (targetPitchNod - smoothPitchNod) * Math.min(1, dt * 12);

          // Nghiêng đầu nhẹ khi strafe A/D, xoay chuột và dồn trọng tâm bước chân
          mouseTurnVel *= Math.pow(0.04, dt);
          const targetRoll =
            -r * 0.016 -
            mouseTurnVel * 0.014 +
            Math.sin(walkPhase) * 0.005 * moveFactor;
          smoothRoll += (targetRoll - smoothRoll) * Math.min(1, dt * 10);

          // FOV động khi chạy nhanh (Sprint)
          const targetFov = isSprinting ? 74.5 : isCrouching ? 67.5 : 70;
          if (Math.abs(cam.fov - targetFov) > 0.05) {
            cam.fov += (targetFov - cam.fov) * Math.min(1, dt * 8);
            cam.updateProjectionMatrix();
          }

          cam.position.y = visualFloorY + eyeHeight + smoothBobY;
          cam.rotation.set(pitch + smoothPitchNod, yaw, smoothRoll);
        } else {
          cam.rotation.set(pitch, yaw, 0);
        }

        // Quán tính tay cầm đèn pin (trễ nhẹ theo cổ tay khi lia chuột & bước đi)
        flashLagX *= Math.pow(0.08, dt);
        flashLagY *= Math.pow(0.08, dt);
        flashlight.target.position.set(
          flashLagX + smoothBobX * 1.8,
          -0.02 + flashLagY + smoothBobY * 1.5,
          -4
        );
        flashlight.target.updateMatrixWorld();

        if (frame++ % 2 === 0) {
          const o = raycastInteractable(
            ray,
            cam,
            scene,
            env.getLampOn(),
            isSitting
          );
          if (o !== hovered) {
            setRedEdgeHighlight(hovered, false);
            hovered = o;
            setRedEdgeHighlight(o, true);
          }
          store.setPromptText(
            o
              ? getInteractionPrompt(o, env.getLampOn(), isSitting)
              : isSitting
              ? 'Nhấn E để đứng dậy'
              : null
          );
        }
      } else if (state === 'inspect' && insp && insp.y) {
        const d = insp.y - pivot.rotation.y;
        if (Math.abs(d) < 0.01) {
          pivot.rotation.y = insp.y;
          insp.y = 0;
        } else {
          pivot.rotation.y += d * Math.min(1, dt * 8);
        }
      }

      // Chuyển động nhẹ của hạt bụi lơ lửng trong không khí
      dustPoints.rotation.y = Math.sin(now * 0.00015) * 0.04;
      dustPoints.position.y = Math.sin(now * 0.0006) * 0.04;

      updateAnimatedModels(loadedModels, dt);
      renderer.render(scene, cam);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      cv.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      ambience.dispose();
      envRT.dispose();
      renderer.dispose();
    };
  }, [currentMap]);

  return <canvas ref={canvasRef} id="c" />;
};

