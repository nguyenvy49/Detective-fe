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
        new THREE.EdgesGeometry(m.geometry, 35),
        new THREE.LineBasicMaterial({ color: 0xff2d2d })
      );
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
  for (const h of hits) {
    if (
      (h.object as THREE.Line).isLine ||
      (h.object as THREE.LineSegments).isLineSegments
    ) {
      continue;
    }
    let o: THREE.Object3D | null = h.object;
    while (o && !o.userData.act) o = o.parent;
    return o && getInteractionPrompt(o, lampOn, isSitting) ? o : null;
  }
  return null;
}

