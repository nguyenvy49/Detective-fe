import * as THREE from 'three';
import { InteractableAction } from '@/types/mapSchema';

export function ownMeshes(
  o: THREE.Object3D,
  rootObj: THREE.Object3D,
  out: THREE.Mesh[] = []
): THREE.Mesh[] {
  if (o !== rootObj && o.userData.act) return out;
  if ((o as THREE.Mesh).isMesh && !o.userData.proxy) {
    out.push(o as THREE.Mesh);
  }
  o.children.forEach((c) => {
    if (
      !(c as THREE.Line).isLine &&
      !(c as THREE.LineSegments).isLineSegments
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
      const e = new THREE.LineSegments(
        new THREE.EdgesGeometry(m.geometry, 28),
        new THREE.LineBasicMaterial({
          color: 0xff2b2b,
          depthTest: false,
          transparent: true,
          opacity: 0.92,
        })
      );
      e.renderOrder = 999;
      e.raycast = () => {};
      m.add(e);
      m.userData.edge = e;
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

