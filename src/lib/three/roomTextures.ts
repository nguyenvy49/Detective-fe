import * as THREE from 'three';

export function createWoodFloorMaterial(): THREE.MeshStandardMaterial {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const g = c.getContext('2d')!;

  const b = document.createElement('canvas');
  b.width = 1024;
  b.height = 1024;
  const bg = b.getContext('2d')!;

  g.fillStyle = '#2a1e15';
  g.fillRect(0, 0, 1024, 1024);
  bg.fillStyle = '#808080';
  bg.fillRect(0, 0, 1024, 1024);

  const plankRows = 12;
  const plankH = 1024 / plankRows;
  const tones = [
    '#34251a',
    '#2c1f16',
    '#3a2a1e',
    '#2f2117',
    '#37271c',
    '#291c13',
  ];

  for (let r = 0; r < plankRows; r++) {
    const y = r * plankH;
    const offset = (r % 2) * 256;
    for (let col = -1; col < 3; col++) {
      const x = col * 512 + offset;
      g.fillStyle = tones[(r * 5 + col + 8) % tones.length];
      g.fillRect(x, y, 512, plankH);

      // Subtle wood knot & grain fibers
      for (let k = 0; k < 28; k++) {
        const gy = y + ((k * 3.1 + r * 11) % plankH);
        g.fillStyle =
          k % 3 === 0 ? 'rgba(12, 7, 3, 0.22)' : 'rgba(65, 45, 28, 0.14)';
        g.fillRect(x + 3, gy, 506, 1.5);
        bg.fillStyle = k % 2 === 0 ? '#909090' : '#707070';
        bg.fillRect(x + 3, gy, 506, 1.2);
      }

      // Beveled plank seam
      g.strokeStyle = '#120c07';
      g.lineWidth = 3;
      g.strokeRect(x, y, 512, plankH);

      bg.strokeStyle = '#151515';
      bg.lineWidth = 4;
      bg.strokeRect(x, y, 512, plankH);
    }
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 4);
  map.anisotropy = 8;

  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(3, 4);
  bump.anisotropy = 8;

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.012,
    roughnessMap: bump,
    roughness: 0.48,
    metalness: 0.05,
  });
}

export function createHallwayTileMaterial(): THREE.MeshStandardMaterial {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const g = c.getContext('2d')!;

  const b = document.createElement('canvas');
  b.width = 1024;
  b.height = 1024;
  const bg = b.getContext('2d')!;

  g.fillStyle = '#1e2228';
  g.fillRect(0, 0, 1024, 1024);
  bg.fillStyle = '#202020';
  bg.fillRect(0, 0, 1024, 1024);

  const n = 4;
  const sz = 1024 / n;
  for (let r = 0; r < n; r++) {
    for (let col = 0; col < n; col++) {
      const x = col * sz;
      const y = r * sz;
      const alt = (r + col) % 2 === 0;
      g.fillStyle = alt ? '#343b46' : '#2a3039';
      g.fillRect(x + 4, y + 4, sz - 8, sz - 8);

      bg.fillStyle = alt ? '#d8d8d8' : '#c4c4c4';
      bg.fillRect(x + 5, y + 5, sz - 10, sz - 10);

      // Terrazzo stone chips
      for (let s = 0; s < 75; s++) {
        g.fillStyle =
          s % 3 === 0
            ? 'rgba(220,230,245,0.08)'
            : s % 3 === 1
            ? 'rgba(160,145,125,0.07)'
            : 'rgba(10,14,18,0.16)';
        const sx = x + 10 + ((s * 61 + r * 31) % (sz - 20));
        const sy = y + 10 + ((s * 83 + col * 43) % (sz - 20));
        g.fillRect(sx, sy, 3 + (s % 3), 3 + ((s + 1) % 3));
      }

      // Subtle scuff / wear marks
      g.fillStyle = 'rgba(0,0,0,0.06)';
      g.beginPath();
      g.arc(x + sz * 0.5, y + sz * 0.5, sz * 0.28, 0, Math.PI * 2);
      g.fill();
    }
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 2.2);
  map.anisotropy = 8;

  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(6, 2.2);
  bump.anisotropy = 8;

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.008,
    roughness: 0.36,
    metalness: 0.08,
  });
}

export function createWallPlasterMaterial(
  baseColor = '#464c56',
  repeatX = 4,
  repeatY = 2
): THREE.MeshStandardMaterial {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d')!;

  const b = document.createElement('canvas');
  b.width = 512;
  b.height = 512;
  const bg = b.getContext('2d')!;

  g.fillStyle = baseColor;
  g.fillRect(0, 0, 512, 512);
  bg.fillStyle = '#808080';
  bg.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 1600; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137) % 512;
    const r = 3 + (i % 14);
    g.fillStyle =
      i % 2 === 0 ? 'rgba(255,255,255,0.022)' : 'rgba(0,0,0,0.032)';
    g.fillRect(x, y, r, r);
    bg.fillStyle = i % 2 === 0 ? '#929292' : '#6e6e6e';
    bg.fillRect(x, y, r, r);
  }

  // Top & bottom ambient occlusion grime
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, 'rgba(0,0,0,0.28)');
  grad.addColorStop(0.16, 'rgba(0,0,0,0)');
  grad.addColorStop(0.8, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.34)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);

  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(repeatX, repeatY);

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.006,
    roughness: 0.86,
  });
}

export function createDadoTileMaterial(
  repeatX = 10,
  repeatY = 2
): THREE.MeshStandardMaterial {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d')!;

  const b = document.createElement('canvas');
  b.width = 512;
  b.height = 256;
  const bg = b.getContext('2d')!;

  g.fillStyle = '#182421';
  g.fillRect(0, 0, 512, 256);
  bg.fillStyle = '#202020';
  bg.fillRect(0, 0, 512, 256);

  const cols = 8;
  const rows = 4;
  const cw = 512 / cols;
  const rh = 256 / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cw;
      const y = r * rh;
      g.fillStyle = (r + col) % 2 === 0 ? '#22332f' : '#1e2e2a';
      g.fillRect(x + 2, y + 2, cw - 4, rh - 4);
      bg.fillStyle = '#dcdcdc';
      bg.fillRect(x + 3, y + 3, cw - 6, rh - 6);
    }
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);

  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(repeatX, repeatY);

  return new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.006,
    roughness: 0.35,
    metalness: 0.06,
  });
}

export function createCeilingGridTexture(
  repeatX = 6,
  repeatY = 6
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;

  g.fillStyle = '#262a32';
  g.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 240; i++) {
    g.fillStyle = 'rgba(0,0,0,0.09)';
    g.fillRect((i * 41) % 256, (i * 67) % 256, 3, 3);
  }

  g.strokeStyle = '#16181d';
  g.lineWidth = 6;
  g.strokeRect(0, 0, 256, 256);
  g.strokeRect(0, 0, 128, 128);
  g.strokeRect(128, 0, 128, 128);
  g.strokeRect(0, 128, 128, 128);
  g.strokeRect(128, 128, 128, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

export function createPersianRugTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 384;
  const g = c.getContext('2d')!;

  g.fillStyle = '#4e1f26';
  g.fillRect(0, 0, 512, 384);

  g.strokeStyle = '#a88958';
  g.lineWidth = 8;
  g.strokeRect(18, 18, 476, 348);

  g.strokeStyle = '#241418';
  g.lineWidth = 4;
  g.strokeRect(30, 30, 452, 324);

  g.strokeStyle = '#8c6b3f';
  g.lineWidth = 6;
  g.strokeRect(42, 42, 428, 300);

  g.fillStyle = '#38151b';
  g.beginPath();
  g.ellipse(256, 192, 110, 75, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#a88958';
  g.lineWidth = 4;
  g.stroke();

  g.fillStyle = 'rgba(0,0,0,0.14)';
  for (let y = 0; y < 384; y += 3) {
    g.fillRect(0, y, 512, 1);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createBulletinBoardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const g = c.getContext('2d')!;

  g.fillStyle = '#1f362b';
  g.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 600; i++) {
    g.fillStyle = 'rgba(255,255,255,0.02)';
    g.fillRect((i * 89) % 1024, (i * 53) % 512, 4, 4);
  }

  g.fillStyle = '#15251d';
  g.fillRect(24, 20, 976, 68);
  g.strokeStyle = '#c8aa6e';
  g.lineWidth = 3;
  g.strokeRect(24, 20, 976, 68);

  g.fillStyle = '#f2ead8';
  g.textAlign = 'center';
  g.font = 'bold 34px "Courier New",monospace';
  g.fillText('BẢNG THÔNG BÁO — TRƯỜNG THPT', 512, 65);

  g.fillStyle = '#e8dfc8';
  g.fillRect(50, 115, 280, 345);
  g.fillStyle = '#b82828';
  g.beginPath();
  g.arc(190, 130, 7, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#1c1a17';
  g.textAlign = 'left';
  g.font = 'bold 20px "Courier New",monospace';
  g.fillText('GIẢI BÓNG ĐÁ THPT', 70, 165);
  g.font = '16px "Courier New",monospace';
  g.fillText('• Khai mạc: 16/10', 70, 200);
  g.fillText('• Sân bóng sau trường', 70, 228);
  g.fillText('• Đội 11A3: Nguyễn Anh', 70, 260);
  g.fillText('  Tuấn (Đội trưởng)', 70, 284);
  g.fillStyle = '#9e2020';
  g.font = 'bold 16px "Courier New",monospace';
  g.fillText('* Lưu ý: Học sinh vi phạm', 70, 330);
  g.fillText('kỷ luật sẽ bị đình chỉ', 70, 354);
  g.fillText('thi đấu ngay lập tức.', 70, 378);

  g.fillStyle = '#dfe6ec';
  g.fillRect(365, 120, 295, 335);
  g.fillStyle = '#2858a8';
  g.beginPath();
  g.arc(512, 135, 7, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#182028';
  g.font = 'bold 20px "Courier New",monospace';
  g.fillText('NỘI QUY KHU BẢO MẬT', 385, 170);
  g.font = '16px "Courier New",monospace';
  g.fillText('1. Đóng cửa sau 20:00.', 385, 208);
  g.fillText('2. Camera CAM-02 ghi hình', 385, 238);
  g.fillText('   24/24 tại phòng lưu trữ.', 385, 262);
  g.fillText('3. Mọi quyết định kỷ luật', 385, 296);
  g.fillText('   chờ Hiệu trưởng ký', 385, 320);
  g.fillText('   được cất tại Tủ số 01.', 385, 344);

  g.fillStyle = '#ece2cc';
  g.fillRect(695, 118, 275, 340);
  g.fillStyle = '#b82828';
  g.beginPath();
  g.arc(832, 132, 7, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#1c1a17';
  g.font = 'bold 20px "Courier New",monospace';
  g.fillText('LỊCH TRỰC TỐI 14/10', 715, 168);
  g.font = '16px "Courier New",monospace';
  g.fillText('• Phòng giáo vụ:', 715, 206);
  g.fillText('  Thầy Hùng (đến 21:00)', 715, 230);
  g.fillText('• Thư viện tầng 1:', 715, 268);
  g.fillText('  Mở cửa đến 21:00', 715, 292);
  g.fillText('• Sân vận động sau trường:', 715, 330);
  g.fillText('  Đội bóng tập đến 20:30', 715, 354);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createLockerFrontTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d')!;

  g.fillStyle = '#2d3b4e';
  g.fillRect(0, 0, 512, 512);

  const cols = 4;
  const rows = 2;
  const cw = 512 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cw;
      const y = r * rh;
      g.strokeStyle = '#18222e';
      g.lineWidth = 4;
      g.strokeRect(x + 4, y + 4, cw - 8, rh - 8);

      g.fillStyle = '#141c26';
      for (let v = 0; v < 5; v++) {
        g.fillRect(x + 24, y + 26 + v * 9, cw - 48, 4);
      }

      g.fillStyle = '#d8d2c0';
      g.fillRect(x + 44, y + 85, 40, 18);
      g.fillStyle = '#1a1a1a';
      g.font = 'bold 12px monospace';
      g.textAlign = 'center';
      g.fillText(`A3-${r * 4 + col + 1}`, x + 64, y + 98);

      g.fillStyle = '#9aa4b0';
      g.fillRect(x + cw - 24, y + rh / 2 - 14, 7, 28);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createClockFaceTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;

  g.fillStyle = '#e8e2d2';
  g.beginPath();
  g.arc(128, 128, 120, 0, Math.PI * 2);
  g.fill();
  g.lineWidth = 10;
  g.strokeStyle = '#1e2228';
  g.stroke();

  g.fillStyle = '#1a1a1a';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const x1 = 128 + Math.sin(a) * 95;
    const y1 = 128 - Math.cos(a) * 95;
    const x2 = 128 + Math.sin(a) * 108;
    const y2 = 128 - Math.cos(a) * 108;
    g.lineWidth = i % 3 === 0 ? 5 : 2.5;
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
  }

  // Hands at ~20:48
  g.strokeStyle = '#151515';
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(128, 128);
  g.lineTo(68, 96);
  g.stroke();

  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(128, 128);
  g.lineTo(48, 102);
  g.stroke();

  g.fillStyle = '#a82020';
  g.beginPath();
  g.arc(128, 128, 6, 0, Math.PI * 2);
  g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
