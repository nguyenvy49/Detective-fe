import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  AnimatedGlbModelConfig,
  AnimatedPartRuntime,
  ClipSegmentRuntime,
} from '@/types/mapSchema';

export interface LoadedAnimatedModel {
  config: AnimatedGlbModelConfig;
  rootObj: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  parts: Record<string, AnimatedPartRuntime>;
}

function applyPartTime(p: AnimatedPartRuntime): void {
  for (const c of p.clips) {
    c.act.time = Math.max(c.minTime, Math.min(c.maxTime, p.t));
  }
}

function findGlbNode(
  root: THREE.Object3D,
  name: string
): THREE.Object3D | undefined {
  return (
    root.getObjectByName(name) ||
    root.getObjectByName(name.replace(/ /g, '_')) ||
    root.getObjectByName(name.replace(/\./g, '')) ||
    root.getObjectByName(name.replace(/ /g, '_').replace(/\./g, ''))
  );
}

export function loadAnimatedGlbModel(
  scene: THREE.Scene,
  config: AnimatedGlbModelConfig
): Promise<LoadedAnimatedModel> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      config.url,
      (gltf) => {
        const rootObj =
          (config.rootObjectName &&
            findGlbNode(gltf.scene, config.rootObjectName)) ||
          gltf.scene;

        rootObj.position.set(
          config.position[0],
          config.position[1],
          config.position[2]
        );
        if (config.rotation) {
          rootObj.rotation.set(
            config.rotation[0],
            config.rotation[1],
            config.rotation[2]
          );
        }
        rootObj.scale.setScalar(config.scale);
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !child.userData.proxy) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(gltf.scene);

        const mixer = new THREE.AnimationMixer(gltf.scene);
        const parts: Record<string, AnimatedPartRuntime> = {};

        config.parts.forEach((partCfg) => {
          const { nodeName, midTime } = partCfg;
          const node = findGlbNode(gltf.scene, nodeName);
          if (!node) return;

          const requestedClips = partCfg.clipNames
            ? partCfg.clipNames
            : partCfg.clipName
              ? [partCfg.clipName]
              : [];

          const clips: ClipSegmentRuntime[] = [];
          let globalStart = 1e9;
          let globalEnd = 0;

          requestedClips.forEach((cName) => {
            const normalizedTarget = cName.replace(/\W/g, '');
            const clip = gltf.animations.find(
              (a) => a.name.replace(/\W/g, '') === normalizedTarget
            );
            if (!clip) return;

            let s = 1e9;
            let e = 0;
            clip.tracks.forEach((t) => {
              if (t.times.length > 0) {
                s = Math.min(s, t.times[0]);
                e = Math.max(e, t.times[t.times.length - 1]);
              }
            });
            if (s > e) return;

            globalStart = Math.min(globalStart, s);
            globalEnd = Math.max(globalEnd, e);

            const act = mixer.clipAction(clip);
            act.play();
            act.paused = true;
            act.time = s;
            clips.push({ act, minTime: s, maxTime: e });
          });

          if (clips.length === 0 || globalStart > globalEnd) return;

          const highlightNode =
            (partCfg.highlightNodeName &&
              findGlbNode(gltf.scene, partCfg.highlightNodeName)) ||
            node;

          const part: AnimatedPartRuntime = {
            node,
            highlightNode,
            clips,
            start: globalStart,
            end: globalEnd,
            mid: midTime ?? (globalStart + globalEnd) / 2,
            t: globalStart,
            state: 'closed',
            label: nodeName,
            isLightSwitch: partCfg.isLightSwitch,
          };

          if (partCfg.hitRadius) {
            const px = new THREE.Mesh(
              new THREE.SphereGeometry(partCfg.hitRadius, 8, 6),
              new THREE.MeshBasicMaterial({ visible: false })
            );
            px.userData.proxy = true;
            highlightNode.add(px);
          }

          applyPartTime(part);
          parts[nodeName] = part;
          highlightNode.userData.act = { type: 'part', p: part };
        });

        if (config.seatNodes) {
          config.seatNodes.forEach((seatCfg) => {
            const node = findGlbNode(gltf.scene, seatCfg.nodeName);
            if (!node) return;
            node.userData.act = {
              type: 'sit',
              seat: {
                node,
                seatPos: seatCfg.seatPos,
                seatYaw: seatCfg.seatYaw,
                seatPitch: seatCfg.seatPitch ?? -0.1,
              },
            };
          });
        }

        mixer.update(0);
        resolve({ config, rootObj, mixer, parts });
      },
      undefined,
      (err) => reject(err)
    );
  });
}

export function updateAnimatedModels(
  loadedModels: LoadedAnimatedModel[],
  dt: number
): void {
  for (const model of loadedModels) {
    if (model.config.autoSpinY) {
      model.rootObj.rotation.y += dt * model.config.autoSpinY;
    }
    let moved = false;
    const sp = model.config.speed;
    for (const key in model.parts) {
      const p = model.parts[key];
      if (p.state === 'opening') {
        p.t += dt * sp;
        if (p.t >= p.mid) {
          p.t = p.mid;
          p.state = 'open';
        }
        moved = true;
        applyPartTime(p);
      } else if (p.state === 'closing') {
        p.t += dt * sp;
        if (p.t >= p.end - 0.001) {
          p.t = p.start;
          p.state = 'closed';
        }
        moved = true;
        applyPartTime(p);
      }
    }
    if (moved) {
      model.mixer.update(0);
    }
  }
}

