import * as THREE from 'three';
import { InteractableAction } from '@/types/mapSchema';

function buildSmoothNormalGeometry(
  srcGeo: THREE.BufferGeometry
): THREE.BufferGeometry {
  const geo = srcGeo.clone();
  geo.computeVertexNormals();
  const posAttr = geo.attributes.position;
  const normAttr = geo.attributes.normal;
  if (!posAttr || !normAttr) return geo;

  const sumMap = new Map<string, THREE.Vector3>();
  const v = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    const key = `${Math.round(posAttr.getX(i) * 10000)},${Math.round(
      posAttr.getY(i) * 10000
    )},${Math.round(posAttr.getZ(i) * 10000)}`;
    let acc = sumMap.get(key);
    if (!acc) {
      acc = new THREE.Vector3();
      sumMap.set(key, acc);
    }
    v.fromBufferAttribute(normAttr, i);
    acc.add(v);
  }

  const smoothNormals = new Float32Array(posAttr.count * 3);
  for (let i = 0; i < posAttr.count; i++) {
    const key = `${Math.round(posAttr.getX(i) * 10000)},${Math.round(
      posAttr.getY(i) * 10000
    )},${Math.round(posAttr.getZ(i) * 10000)}`;
    const acc = sumMap.get(key)!;
    v.copy(acc).normalize();
    smoothNormals[i * 3] = v.x;
    smoothNormals[i * 3 + 1] = v.y;
    smoothNormals[i * 3 + 2] = v.z;
  }
  geo.setAttribute(
    'smoothNormal',
    new THREE.BufferAttribute(smoothNormals, 3)
  );
  return geo;
}

function createSilhouetteMesh(m: THREE.Mesh): THREE.Mesh {
  const geo = buildSmoothNormalGeometry(m.geometry);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      outlineColor: { value: new THREE.Color(0xff2d2d) },
      outlineWidth: { value: 0.0042 },
    },
    vertexShader: `
      attribute vec3 smoothNormal;
      uniform float outlineWidth;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * smoothNormal);
        float distScale = clamp(-mvPosition.z, 0.35, 4.0);
        mvPosition.xy += viewNormal.xy * outlineWidth * distScale;
        mvPosition.z -= 0.0025;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 outlineColor;
      void main() {
        gl_FragColor = vec4(outlineColor, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthTest: true,
    depthWrite: false,
  });
  const outlineMesh = new THREE.Mesh(geo, mat);
  outlineMesh.userData.noRaycast = true;
  outlineMesh.raycast = () => {};
  outlineMesh.castShadow = false;
  outlineMesh.receiveShadow = false;
  return outlineMesh;
}

export function ownMeshes(
  o: THREE.Object3D,
  rootObj: THREE.Object3D,
  out: THREE.Mesh[] = []
): THREE.Mesh[] {
  if (o !== rootObj && o.userData.act) return out;
  if (
    (o as THREE.Mesh).isMesh &&
    !o.userData.proxy &&
    !o.userData.noRaycast
  ) {
    out.push(o as THREE.Mesh);
  }
  o.children.forEach((c) => {
    if (
      !(c as THREE.Line).isLine &&
      !(c as THREE.LineSegments).isLineSegments &&
      !c.userData.noRaycast
    ) {
      ownMeshes(c, rootObj, out);
    }
  });
  return out;
}

export function setRedEdgeHighlight(
  o: THREE.Object3D | null,
  on: boolean
): void {
  if (!o) return;
  ownMeshes(o, o).forEach((m) => {
    if (!m.userData.edge) {
      if (!on) return;
      const vertCount = m.geometry.attributes.position?.count ?? 0;
      let edgeObj: THREE.Object3D;
      // Các khối hộp phẳng ít đỉnh (ngăn kéo tủ, cánh cửa phẳng, tờ giấy) dùng viền góc 80°;
      // Các đối tượng cong/chi tiết (ghế xoay, tay nắm cửa, bùn, khuy áo, công tắc) dùng viền bóng chuẩn theo dáng vật thể (Inverted Hull Silhouette)
      if (vertCount <= 100) {
        const e = new THREE.LineSegments(
          new THREE.EdgesGeometry(m.geometry, 80),
          new THREE.LineBasicMaterial({ color: 0xff2d2d })
        );
        e.userData.noRaycast = true;
        e.raycast = () => {};
        edgeObj = e;
      } else {
        edgeObj = createSilhouetteMesh(m);
      }
      m.add(edgeObj);
      m.userData.edge = edgeObj;
    }
    m.userData.edge.visible = on;
  });
}

export function getInteractionPrompt(
  o: THREE.Object3D,
  lampOn: boolean,
  isSitting = false
): string | null {
  const a = o.userData.act as InteractableAction | undefined;
  if (!a) return null;
  if (a.type === 'part') {
    if (a.p.isLightSwitch) {
      if (a.p.state === 'opening' || a.p.state === 'closing') return null;
      return lampOn ? 'Nhấn E để tắt đèn' : 'Nhấn E để bật đèn';
    }
    return a.p.state === 'closed'
      ? 'Nhấn E để mở'
      : a.p.state === 'open'
      ? 'Nhấn E để đóng'
      : null;
  }
  if (a.type === 'switch') {
    return lampOn ? 'Nhấn E để tắt đèn' : 'Nhấn E để bật đèn';
  }
  if (a.type === 'cctv') return 'Nhấn E để xem qua camera';
  if (a.type === 'pick') return 'Nhấn E để nhặt';
  if (a.type === 'sit') {
    return isSitting ? 'Nhấn E để đứng dậy' : 'Nhấn E để ngồi vào ghế';
  }
  return null;
}

export function raycastInteractable(
  raycaster: THREE.Raycaster,
  cam: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  lampOn: boolean,
  isSitting = false
): THREE.Object3D | null {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), cam);
  const hits = raycaster.intersectObjects(scene.children, true);

  let firstSolidDist = Infinity;

  for (const h of hits) {
    const obj = h.object;
    if (
      (obj as THREE.Line).isLine ||
      (obj as THREE.LineSegments).isLineSegments ||
      (obj as THREE.Points).isPoints ||
      obj.userData.noRaycast
    ) {
      continue;
    }

    // Nếu tia chạm vượt quá vật cản rắn đầu tiên hơn 22cm thì dừng (tránh xuyên tường/cửa đóng)
    if (h.distance > firstSolidDist + 0.22) {
      break;
    }

    let o: THREE.Object3D | null = obj;
    while (o && !o.userData.act) o = o.parent;

    if (o && getInteractionPrompt(o, lampOn, isSitting)) {
      return o;
    }

    if (!obj.userData.proxy && firstSolidDist === Infinity) {
      firstSolidDist = h.distance;
    }
  }
  return null;
}

