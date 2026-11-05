import * as THREE from 'three';

export function wrapCanvasText(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  words.forEach((word) => {
    if (g.measureText(line + word).width > maxWidth && line) {
      g.fillText(line, x, y);
      y += lineHeight;
      line = '';
    }
    line += word + ' ';
  });
  g.fillText(line, x, y);
  return y + lineHeight;
}

export function createDocumentPageTexture(
  title: string,
  lines: string[],
  stamp?: string
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 724;
  const g = c.getContext('2d')!;
  g.fillStyle = '#e6dfca';
  g.fillRect(0, 0, 512, 724);

  for (let i = 0; i < 9; i++) {
    g.fillStyle = 'rgba(110,80,30,.07)';
    g.beginPath();
    g.arc(
      Math.random() * 512,
      Math.random() * 724,
      20 + Math.random() * 50,
      0,
      7
    );
    g.fill();
  }

  g.fillStyle = '#1d1b18';
  g.textAlign = 'center';
  g.font = 'bold 26px "Courier New",monospace';
  let y = wrapCanvasText(g, title, 256, 64, 420, 32);

  g.textAlign = 'left';
  g.font = '21px "Courier New",monospace';
  y += 14;
  lines.forEach((line) => {
    y = wrapCanvasText(g, line, 40, y, 432, 27) + 8;
  });

  if (stamp) {
    g.save();
    g.translate(330, 620);
    g.rotate(-0.25);
    g.strokeStyle = '#a02020';
    g.fillStyle = '#a02020';
    g.lineWidth = 3;
    g.strokeRect(-130, -26, 260, 52);
    g.font = 'bold 20px "Courier New",monospace';
    g.textAlign = 'center';
    g.fillText(stamp, 0, 7);
    g.restore();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export interface TwoSidedPaperSpec {
  front: { title: string; lines: string[]; stamp?: string };
  back: { title: string; lines: string[]; stamp?: string };
}

export function buildTwoSidedDocument(spec: TwoSidedPaperSpec): THREE.Group {
  const gr = new THREE.Group();
  const p1 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.21, 0.297),
    new THREE.MeshStandardMaterial({
      map: createDocumentPageTexture(
        spec.front.title,
        spec.front.lines,
        spec.front.stamp
      ),
      roughness: 1,
    })
  );
  const p2 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.21, 0.297),
    new THREE.MeshStandardMaterial({
      map: createDocumentPageTexture(
        spec.back.title,
        spec.back.lines,
        spec.back.stamp
      ),
      roughness: 1,
    })
  );
  p2.rotation.y = Math.PI;
  p1.position.z = 0.0006;
  p2.position.z = -0.0006;
  gr.add(p1, p2);
  gr.userData = { size: 0.3, dist: 0.34, pages: true };
  return gr;
}

export function buildUniformButton(): THREE.Group {
  const gr = new THREE.Group();
  const bm = new THREE.MeshStandardMaterial({
    color: 0x2c4f8a,
    roughness: 0.4,
    metalness: 0.3,
  });
  const d = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0105, 0.0105, 0.003, 28),
    bm
  );
  d.rotation.x = Math.PI / 2;
  gr.add(d);

  const r = new THREE.Mesh(
    new THREE.TorusGeometry(0.0092, 0.0013, 8, 28),
    new THREE.MeshStandardMaterial({
      color: 0x9aa8c4,
      metalness: 0.6,
      roughness: 0.3,
    })
  );
  r.position.z = 0.0018;
  gr.add(r);

  [
    [-0.0028, 0],
    [0.0028, 0],
  ].forEach(([x]) => {
    const h = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0012, 0.0012, 0.0035, 10),
      new THREE.MeshBasicMaterial({ color: 0x05080f })
    );
    h.rotation.x = Math.PI / 2;
    h.position.set(x, 0.0028, 0.0004);
    gr.add(h);
    const h2 = h.clone();
    h2.position.y = -0.0028;
    gr.add(h2);
  });

  const th = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0006, 0.0006, 0.014, 6),
    new THREE.MeshStandardMaterial({ color: 0xcfc8b0 })
  );
  th.position.set(0.003, -0.002, -0.003);
  th.rotation.set(0.6, 0, 0.9);
  gr.add(th);

  gr.userData = { size: 0.026, dist: 0.5 };
  return gr;
}

export function buildMudSample(): THREE.Group {
  const gr = new THREE.Group();
  const g = new THREE.IcosahedronGeometry(0.03, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const k = 1 + Math.sin(i * 12.9) * 0.5 * 0.3;
    pos.setXYZ(
      i,
      pos.getX(i) * k,
      pos.getY(i) * k * 0.55,
      pos.getZ(i) * k
    );
  }
  g.computeVertexNormals();
  gr.add(
    new THREE.Mesh(
      g,
      new THREE.MeshStandardMaterial({ color: 0x7a2f1c, roughness: 1 })
    )
  );
  [
    [0.032, 0, 0.01],
    [-0.03, 0, -0.02],
    [0.01, 0, 0.036],
  ].forEach(([x, y, z]) => {
    const c = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.007),
      new THREE.MeshStandardMaterial({ color: 0x5c2314, roughness: 1 })
    );
    c.position.set(x, y, z);
    gr.add(c);
  });
  gr.userData = { size: 0.08, dist: 0.5 };
  return gr;
}

export function placeInteractableItem(
  id: string,
  buildFn: () => THREE.Group,
  parent: THREE.Object3D,
  position: [number, number, number],
  rotation: [number, number, number] = [0, 0, 0],
  hitRadius?: number
): THREE.Group {
  const it = buildFn();
  it.position.set(position[0], position[1], position[2]);
  it.rotation.set(rotation[0], rotation[1], rotation[2]);
  const radius = hitRadius ?? (id === 'file' ? 0.14 : 0.13);
  const px = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 8, 6),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  px.userData.proxy = true;
  it.add(px);
  it.userData.act = { type: 'pick', id };
  parent.add(it);
  return it;
}

