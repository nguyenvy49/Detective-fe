import * as THREE from 'three';
import { CrimeSceneMapConfig } from '@/types/mapSchema';
import {
  buildMudSample,
  buildTwoSidedDocument,
  buildUniformButton,
} from '@/lib/three/evidenceBuilders';
import {
  createBulletinBoardTexture,
  createCeilingGridTexture,
  createClockFaceTexture,
  createDadoTileMaterial,
  createHallwayTileMaterial,
  createLockerFrontTexture,
  createPersianRugTexture,
  createWallPlasterMaterial,
  createWoodFloorMaterial,
} from '@/lib/three/roomTextures';

const PI = Math.PI;

export const map01SecurityRoom: CrimeSceneMapConfig = {
  id: 'map_01_security_room',
  title: 'HIỆN TRƯỜNG 01 — PHÒNG BẢO MẬT',
  briefing:
    'Đêm 14/10, trường THPT. Tủ hồ sơ kỷ luật bị cạy. Bạn là điều tra viên được điều động đến hiện trường: tự tay mở ngăn kéo, bật đèn, nhặt vật chứng, xem lại camera, mở cửa ra hành lang kiểm tra, rồi đưa ra cáo buộc.',
  loadingText: 'Đang tải mô hình hiện trường…',
  enterButtonText: 'Bước vào hiện trường',
  errorModelText: 'Không tải được mô hình hiện trường',
  spawn: {
    position: [0.8, 1.65, 3.2],
    yaw: 0,
    pitch: 0,
  },
  backgroundHex: 0x04060a,
  fogNear: 7.5,
  fogFar: 21,

  items: {
    button: {
      id: 'button',
      name: 'Khuy áo đồng phục',
      desc: 'Mặt sau khắc “A3”. Chỉ may còn dính, vải bị giật mạnh — khuy bị đứt chứ không tự rơi.',
      build: buildUniformButton,
      initialPlacement: {
        target: 'scene',
        position: [-3.5, 0.014, 3.55],
        rotation: [Math.PI / 2, 0.6, 0],
        hitRadius: 0.22,
      },
    },
    mud: {
      id: 'mud',
      name: 'Mẫu bùn đỏ',
      desc: 'Bùn còn ẩm, lẫn mạt vôi kẻ vạch. Loại đất đỏ này chỉ có ở sân bóng sau trường.',
      build: buildMudSample,
      initialPlacement: {
        target: 'scene',
        position: [-1.5, 0.035, 0.5],
        rotation: [0, 0, 0],
        hitRadius: 0.22,
      },
    },
    file: {
      id: 'file',
      name: 'Hồ sơ kỷ luật',
      desc: 'Nằm trong ngăn kéo giữa. Lật trang bằng A / D hoặc xoay chuột để xem mặt sau.',
      build: () =>
        buildTwoSidedDocument({
          front: {
            title: 'HỒ SƠ KỶ LUẬT HỌC SINH',
            lines: [
              'Trường THPT — Học kỳ I',
              'Lưu trữ nội bộ, phòng bảo mật',
              '1. Nguyễn Văn Minh, 11A3: nhắc nhở đi học muộn.',
              '2. Phạm Thu Lan, 11A1: không vi phạm.',
              '3. Nguyễn Anh Tuấn, 11A3 (đội trưởng đội bóng): đánh nhau trong giờ ra chơi. Xem quyết định ở trang sau.',
            ],
            stamp: 'LƯU TRỮ',
          },
          back: {
            title: 'QUYẾT ĐỊNH SỐ 14/KL',
            lines: [
              'Đình chỉ thi đấu Giải bóng đá học sinh đối với em Nguyễn Anh Tuấn, 11A3.',
              'Lý do: gây thương tích cho bạn cùng khối.',
              'Hiệu lực từ ngày 15/10. Bản gốc cần Hiệu trưởng ký xác nhận.',
              'Ghi chú viết tay: em Tuấn nói sẽ “làm mọi cách” để quyết định này không được ký.',
            ],
            stamp: 'BẢN SAO',
          },
        }),
      initialPlacement: {
        target: { modelId: 'cabinet', partName: 'Drawer M' },
        position: [0, -0.04, -0.3],
        rotation: [-Math.PI / 2, 0, 0],
        hitRadius: 0.22,
      },
    },
  },

  animatedModels: [
    {
      id: 'cabinet',
      url: '/models/map1/cabinet.glb',
      rootObjectName: 'Cabinet',
      position: [0, 0, -4.65],
      scale: 1.3,
      speed: 0.55,
      parts: [
        { nodeName: 'Drawer L', clipName: 'DrawerLAction' },
        { nodeName: 'Drawer M', clipName: 'DrawerMAction' },
        { nodeName: 'Drawer R', clipName: 'DrawerRAction' },
        { nodeName: 'Compartment L', clipName: 'CompartmentLAction' },
        { nodeName: 'Compartment M', clipName: 'CompartmentMAction' },
        { nodeName: 'Compartment R', clipName: 'CompartmentRAction' },
      ],
    },
    {
      id: 'door',
      url: '/models/map1/cua1.glb',
      rootObjectName: 'Simple white door',
      position: [2.2, 0, 4.65],
      rotation: [0, Math.PI, 0],
      scale: 1,
      speed: 0.85,
      parts: [
        {
          nodeName: 'Door_main',
          clipNames: ['Door_handleAction', 'Door_mainAction'],
          midTime: 1.0417,
        },
      ],
    },
    {
      id: 'workdesk',
      url: '/models/map1/workdesk.glb',
      rootObjectName: 'Complete Office Workplace Setup',
      position: [-3.1, 0, 1.8],
      rotation: [0, -Math.PI / 2, 0],
      scale: 1,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'ikea_markus.001',
          seatPos: [-2.74, 1.18, 1.61],
          seatYaw: Math.PI / 2,
          seatPitch: -0.12,
        },
      ],
    },
    {
      id: 'light_switch',
      url: '/models/map1/switch.glb',
      rootObjectName: 'Wallplate_Duplex_Rectangle.002',
      position: [3.99, 1.3, 2.2],
      rotation: [0, Math.PI, 0],
      scale: 1.5,
      speed: 1.4,
      parts: [
        {
          nodeName: 'Switch',
          highlightNodeName: 'Wallplate_Duplex_Rectangle.002',
          clipName: 'SwitchAction.001',
          midTime: 0.625,
          isLightSwitch: true,
          hitRadius: 0.2,
        },
      ],
    },
    {
      id: 'hall_window_left',
      url: '/models/map1/window.glb',
      rootObjectName: '2 panel sliding window',
      position: [-3.4, 1.1, 8.78],
      rotation: [0, 0, 0],
      scale: 1.25,
      speed: 1,
      parts: [],
    },
    {
      id: 'hall_window_right',
      url: '/models/map1/window.glb',
      rootObjectName: '2 panel sliding window',
      position: [3.6, 1.1, 8.78],
      rotation: [0, 0, 0],
      scale: 1.25,
      speed: 1,
      parts: [],
    },
    {
      id: 'ceiling_fan',
      url: '/models/map1/ceiling_fan.glb',
      rootObjectName: 'Ceiling Fan',
      position: [0, 2.48, -1.55],
      rotation: [0, 0, 0],
      scale: 1.55,
      speed: 1,
      autoSpinY: 2.1,
      parts: [],
    },
  ],

  cctv: {
    cameraLabel: 'CAM-02  PHÒNG BẢO MẬT',
    datePrefix: '14/10  20:45:',
    baseSeconds: 12,
    unlockAfterSeconds: 6,
    clueNote: 'Người đeo túi thể thao; tay áo phải hình như thiếu khuy.',
  },

  timeline: [
    '19:30 — Minh rời trường (lời khai)',
    '20:30 — Tuấn kết thúc buổi tập bóng (lời khai)',
    '20:45 — CCTV phòng bảo mật: có bóng người đi qua',
    '21:00 — Thầy Hùng và Lan rời trường (lời khai)',
  ],

  suspects: [
    {
      id: 'hung',
      name: 'Thầy Hùng',
      role: 'GVCN lớp 11A3',
      statement:
        '“Tôi ở phòng giáo vụ soạn bài đến 21:00, không đi qua khu bảo mật.”',
    },
    {
      id: 'minh',
      name: 'Nguyễn Văn Minh',
      role: 'Học sinh 11A3',
      statement: '“Em về nhà lúc 19:30. Mẹ em có thể làm chứng.”',
    },
    {
      id: 'tuan',
      name: 'Nguyễn Anh Tuấn',
      role: 'Học sinh 11A3, đội trưởng đội bóng',
      statement:
        '“Tập xong lúc 20:30 là em về luôn, em không quay lại trường.”',
    },
    {
      id: 'lan',
      name: 'Phạm Thu Lan',
      role: 'Học sinh 11A1',
      statement: '“Em học ở thư viện đến 21:00, thủ thư có thấy em.”',
    },
  ],

  solution: {
    culpritId: 'tuan',
    minEvidenceCount: 3,
    totalKeyEvidence: 4,
    trueEndingText:
      'Khuy áo 11A3, bùn đỏ sân bóng, quyết định đình chỉ thi đấu và đoạn CCTV 20:45 mâu thuẫn với lời khai “về lúc 20:30”. Tuấn thừa nhận đã cạy tủ để tìm bản gốc quyết định chưa được ký.',
    insufficientEvidenceText:
      'Bạn nghi đúng người nhưng bằng chứng chưa đủ then chốt. Luật sư bác bỏ cáo buộc và vụ án bị đình lại.',
    wrongSuspectText: (name) =>
      `Bạn buộc tội nhầm ${name}. Hung thủ thật vẫn ngoài vòng pháp luật.`,
  },

  buildEnvironment(scene: THREE.Scene) {
    const amb = new THREE.AmbientLight(0x7488b0, 0.36 * PI);
    scene.add(amb);

    const hemi = new THREE.HemisphereLight(0x8aa4d6, 0x2a211b, 0.24 * PI);
    scene.add(hemi);

    // Đèn chính trong phòng bảo mật (có đổ bóng mềm PCFSoftShadow)
    const lamp = new THREE.PointLight(0xffe6b8, 0, 18, 0);
    lamp.position.set(0, 2.72, 0);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.bias = -0.0012;
    lamp.shadow.normalBias = 0.02;
    scene.add(lamp);

    // Ánh sáng xanh dịu từ màn hình máy tính trên bàn làm việc
    const monitorLight = new THREE.PointLight(0x6ab8ff, 0.28 * PI, 2.8, 0);
    monitorLight.position.set(-3.28, 1.08, 1.8);
    scene.add(monitorLight);

    // Ánh trăng lạnh chiếu xiên từ cửa sổ phòng bảo mật
    const roomMoonLight = new THREE.PointLight(0x688ec8, 0.22 * PI, 5.5, 0);
    roomMoonLight.position.set(-3.55, 1.75, -1.8);
    scene.add(roomMoonLight);

    let lampOn = false;

    const woodFloorMat = createWoodFloorMaterial();
    const roomWallMat = createWallPlasterMaterial('#484d56', 4, 2);
    const ceilingMat = new THREE.MeshStandardMaterial({
      map: createCeilingGridTexture(6, 6),
      roughness: 0.88,
    });
    const rugMat = new THREE.MeshStandardMaterial({
      map: createPersianRugTexture(),
      roughness: 0.92,
    });
    const hallFloorMat = createHallwayTileMaterial();
    const hallWallMat = createWallPlasterMaterial('#3f4550', 6, 2);
    const dadoTileMat = createDadoTileMaterial(10, 2);

    const mk = (
      w: number,
      h: number,
      d: number,
      col: number,
      x: number,
      y: number,
      z: number,
      r = 0.85,
      metal = 0.05,
      cast = true
    ) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
          color: col,
          roughness: r,
          metalness: metal,
        })
      );
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    const mkMat = (
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      cast = false
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    /* =====================================================================
     * 1. PHÒNG BẢO MẬT (x: -4 -> 4, z: -5.1 -> 4.65)
     * ===================================================================== */
    // Sàn gỗ, trần ô thạch cao và tường phòng
    mkMat(8, 0.1, 9.7, woodFloorMat, 0, -0.05, -0.25);
    mkMat(8, 0.1, 9.7, ceilingMat, 0, 3.05, -0.25);
    mkMat(8, 3, 0.1, roomWallMat, 0, 1.5, -5.15);
    // Tường phía cửa (chừa ô cửa x: 1.7 -> 2.7, y: 0 -> 2.2 cho cua1.glb)
    mkMat(5.7, 3, 0.1, roomWallMat, -1.15, 1.5, 4.65);
    mkMat(1.3, 3, 0.1, roomWallMat, 3.35, 1.5, 4.65);
    mkMat(1.0, 0.8, 0.1, roomWallMat, 2.2, 2.6, 4.65);
    mkMat(0.1, 3, 9.7, roomWallMat, -4.05, 1.5, -0.25);
    mkMat(0.1, 3, 9.7, roomWallMat, 4.05, 1.5, -0.25);

    // Phào chân tường gỗ tối & ốp chân tường trong phòng bảo mật
    mk(8, 0.14, 0.03, 0x221a14, 0, 0.07, -5.09);
    mk(5.7, 0.14, 0.03, 0x221a14, -1.15, 0.07, 4.59);
    mk(1.3, 0.14, 0.03, 0x221a14, 3.35, 0.07, 4.59);
    mk(0.03, 0.14, 9.7, 0x221a14, -3.99, 0.07, -0.25);
    mk(0.03, 0.14, 9.7, 0x221a14, 3.99, 0.07, -0.25);
    // Phào chỉ trần
    mk(8, 0.08, 0.04, 0x2f333b, 0, 2.96, -5.09);
    mk(8, 0.08, 0.04, 0x2f333b, 0, 2.96, 4.59);
    mk(0.04, 0.08, 9.7, 0x2f333b, -3.99, 2.96, -0.25);
    mk(0.04, 0.08, 9.7, 0x2f333b, 3.99, 2.96, -0.25);

    // Thảm dệt hoa văn cổ điển giữa phòng
    mkMat(3.2, 0.02, 2.2, rugMat, -1.4, 0.011, 0.2);

    // Cửa sổ rèm sáo trên tường trái (x = -3.98, z = -1.8)
    mk(0.05, 1.35, 1.7, 0x231b14, -3.98, 1.75, -1.8);
    mk(0.03, 1.22, 1.56, 0x0c1828, -3.97, 1.75, -1.8, 0.2, 0.2);
    for (let i = 0; i < 11; i++) {
      mk(0.04, 0.025, 1.54, 0x8a8274, -3.95, 1.2 + i * 0.11, -1.8, 0.6);
    }

    // Kệ sắt lưu trữ hồ sơ sát tường phải (x = 3.55, z = -2.0)
    const shelfX = 3.55;
    const shelfZ = -2.0;
    [
      [-0.35, -0.9],
      [0.35, -0.9],
      [-0.35, 0.9],
      [0.35, 0.9],
    ].forEach(([dx, dz]) => {
      mk(0.04, 2.1, 0.04, 0x2a2e35, shelfX + dx, 1.05, shelfZ + dz, 0.5, 0.6);
    });
    [0.18, 0.72, 1.28, 1.85].forEach((sy) => {
      mk(0.74, 0.03, 1.84, 0x353a42, shelfX, sy, shelfZ, 0.5, 0.5);
    });
    // Các hộp hồ sơ lưu trữ trên kệ sắt
    [
      [0.32, -0.55, 0x7c5c3e],
      [0.32, -0.1, 0x6b4e35],
      [0.32, 0.45, 0x32485c],
      [0.86, -0.45, 0x2c4254],
      [0.86, 0.15, 0x7a5b3e],
      [0.86, 0.55, 0x5c2828],
      [1.42, -0.5, 0x6b4e35],
      [1.42, 0.05, 0x354b5e],
    ].forEach(([by, bz, bcol]) => {
      mk(0.48, 0.24, 0.34, bcol, shelfX, by, shelfZ + bz, 0.85);
      mk(0.5, 0.04, 0.36, 0xd8d0c0, shelfX - 0.01, by + 0.03, shelfZ + bz, 0.9);
    });

    // Bảng nội quy đóng khung treo tường trong phòng bảo mật
    function makeSignMesh(
      text: string,
      sub: string,
      w: number,
      h: number,
      bg = '#1b2838',
      fg = '#f0ece0'
    ) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 256;
      const g = c.getContext('2d')!;
      g.fillStyle = bg;
      g.fillRect(0, 0, 512, 256);
      g.strokeStyle = '#c8b88a';
      g.lineWidth = 8;
      g.strokeRect(12, 12, 488, 232);
      g.fillStyle = fg;
      g.textAlign = 'center';
      g.font = 'bold 38px "Courier New",monospace';
      g.fillText(text, 256, 112);
      g.font = '24px "Courier New",monospace';
      g.fillStyle = '#d0c8b0';
      g.fillText(sub, 256, 174);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 })
      );
    }

    const innerRuleBoard = makeSignMesh(
      'KHU VỰC LƯU TRỮ MẬT',
      'Không phận sự cấm vào sau 20:00',
      0.75,
      0.38,
      '#241c18',
      '#f2ead8'
    );
    innerRuleBoard.rotation.y = -Math.PI / 2;
    innerRuleBoard.position.set(3.98, 1.75, 0.6);
    scene.add(innerRuleBoard);

    // Bộ máng đèn trần đôi trong phòng bảo mật
    mk(1.2, 0.05, 0.42, 0x2a2d34, 0, 2.98, 0, 0.4, 0.5, false);
    const bulb = mk(1.08, 0.04, 0.32, 0x888888, 0, 2.96, 0, 0.3, 0.05, false);
    bulb.material.emissive = new THREE.Color(0);

    // Đồng hồ treo tường mặt tròn chỉ 20:48 (ngay sau thời điểm CCTV ghi hình 20:45)
    const clockGroup = new THREE.Group();
    clockGroup.position.set(0, 2.32, -5.08);
    const clockRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.04, 28),
      new THREE.MeshStandardMaterial({
        color: 0x1d2026,
        roughness: 0.35,
        metalness: 0.6,
      })
    );
    clockRim.rotation.x = Math.PI / 2;
    clockGroup.add(clockRim);
    const clockFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.195, 28),
      new THREE.MeshStandardMaterial({
        map: createClockFaceTexture(),
        roughness: 0.25,
      })
    );
    clockFace.position.z = 0.022;
    clockGroup.add(clockFace);
    scene.add(clockGroup);

    // Cây nước nóng lạnh & thùng rác văn phòng ở góc phòng bảo mật
    mk(0.34, 0.92, 0.34, 0xd8dce2, -3.55, 0.46, -4.55, 0.35, 0.2);
    mk(0.28, 0.24, 0.02, 0x1e242d, -3.55, 0.72, -4.37, 0.3, 0.4);
    const waterJug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.38, 18),
      new THREE.MeshStandardMaterial({
        color: 0x3b88c4,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.78,
      })
    );
    waterJug.position.set(-3.55, 1.11, -4.55);
    scene.add(waterJug);

    // Đầu ghi hình CCTV DVR & hộp cáp mạng dưới camera an ninh
    mk(0.42, 0.09, 0.32, 0x181b20, 3.72, 1.88, -1.8, 0.35, 0.7);
    const dvrLed = mk(0.02, 0.015, 0.01, 0x22ff66, 3.5, 1.88, -1.68, 0.2, 0, false);
    dvrLed.material.emissive = new THREE.Color(0x18cc44);

    /* =====================================================================
     * 2. HÀNH LANG TRƯỜNG HỌC BÊN NGOÀI CỬA (x: -6.5 -> 6.5, z: 4.65 -> 8.85)
     * ===================================================================== */
    // Sàn gạch terrazzo bóng & trần hành lang
    mkMat(13, 0.1, 4.2, hallFloorMat, 0, -0.05, 6.75);
    mkMat(13, 0.1, 4.2, ceilingMat, 0, 3.05, 6.75);

    // Tường nối mặt tiền hành lang hai bên phòng bảo mật
    mkMat(2.5, 3, 0.1, hallWallMat, -5.25, 1.5, 4.65);
    mkMat(2.5, 3, 0.1, hallWallMat, 5.25, 1.5, 4.65);

    // Tường ngoài hành lang z = 8.85 (chừa 2 ô cửa sổ trong suốt tại x = -3.4 và x = 3.6 để nhìn ra sân bóng)
    mkMat(13, 1.08, 0.1, hallWallMat, 0, 0.54, 8.85); // tường dưới bệ cửa sổ
    mkMat(13, 0.65, 0.1, hallWallMat, 0, 2.675, 8.85); // tường trên đỉnh cửa sổ
    mkMat(2.15, 1.27, 0.1, hallWallMat, -5.425, 1.715, 8.85); // mảng tường trái ngoài cùng
    mkMat(5.1, 1.27, 0.1, hallWallMat, 0.1, 1.715, 8.85); // mảng tường giữa 2 cửa sổ
    mkMat(1.95, 1.27, 0.1, hallWallMat, 5.525, 1.715, 8.85); // mảng tường phải ngoài cùng

    mkMat(0.1, 3, 4.2, hallWallMat, -6.5, 1.5, 6.75);
    mkMat(0.1, 3, 4.2, hallWallMat, 6.5, 1.5, 6.75);

    // Gạch thẻ men xanh rêu sẫm ốp chân tường (Dado tile có bump map) + chỉ gỗ chạy dọc 2 bên hành lang
    mkMat(13, 1.06, 0.03, dadoTileMat, 0, 0.53, 8.79);
    mk(13, 0.05, 0.045, 0x4a3522, 0, 1.08, 8.79, 0.55, 0.05, false);
    mkMat(8.1, 1.06, 0.03, dadoTileMat, -2.45, 0.53, 4.71);
    mk(8.1, 0.05, 0.045, 0x4a3522, -2.45, 1.08, 4.71, 0.55, 0.05, false);
    mkMat(3.7, 1.06, 0.03, dadoTileMat, 4.6, 0.53, 4.71);
    mk(3.7, 0.05, 0.045, 0x4a3522, 4.6, 1.08, 4.71, 0.55, 0.05, false);

    // Các cột trụ bê tông & dầm ngang trần hành lang tạo chiều sâu kiến trúc
    [-4.6, -0.4, 3.2].forEach((px) => {
      mk(0.26, 3.0, 0.22, 0x383d46, px, 1.5, 4.76, 0.8);
      mk(0.26, 3.0, 0.22, 0x383d46, px, 1.5, 8.74, 0.8);
      mk(0.28, 0.24, 4.2, 0x2f333c, px, 2.9, 6.75, 0.8, 0.05, false);
    });

    // Hệ thống máng đèn huỳnh quang hành lang ban đêm (3 cụm đèn dọc hành lang)
    [-4.2, 0.3, 4.4].forEach((lx, idx) => {
      const hLight = new THREE.PointLight(
        idx === 1 ? 0xffe4b5 : 0x9ab8dc,
        (idx === 1 ? 0.56 : 0.44) * PI,
        10.5,
        0
      );
      hLight.position.set(lx, 2.7, 6.75);
      if (idx === 1) {
        hLight.castShadow = true;
        hLight.shadow.mapSize.set(1024, 1024);
        hLight.shadow.bias = -0.0012;
      }
      scene.add(hLight);
      mk(1.1, 0.05, 0.26, 0x252830, lx, 2.98, 6.75, 0.4, 0.5, false);
      const hBulb = mk(0.98, 0.04, 0.18, 0xd8e8ff, lx, 2.95, 6.75, 0.2, 0.05, false);
      hBulb.material.emissive = new THREE.Color(
        idx === 1 ? 0xb59c6e : 0x7292b8
      );
    });

    // Biển phòng "PHÒNG BẢO MẬT - P.202" + ô kính thông gió trên cửa
    const secSign = makeSignMesh(
      'P.202 — PHÒNG BẢO MẬT',
      'LƯU TRỮ HỒ SƠ & ĐỀ THI',
      0.52,
      0.24
    );
    secSign.position.set(1.25, 1.68, 4.72);
    scene.add(secSign);
    mk(1.04, 0.36, 0.12, 0x241911, 2.2, 2.42, 4.65);
    mk(0.92, 0.26, 0.14, 0x101822, 2.2, 2.42, 4.65, 0.2);

    // Cửa gỗ "PHÒNG GIÁO VỤ - P.201" (có khe sáng vàng ấm hắt ra từ ô kính trên cửa)
    mk(1.12, 2.2, 0.1, 0x241810, -2.2, 1.1, 4.71);
    mk(0.98, 2.12, 0.08, 0x422c1d, -2.2, 1.06, 4.72, 0.7);
    mk(0.04, 0.14, 0.06, 0xc8a862, -1.78, 1.05, 4.77, 0.3, 0.8); // tay nắm đồng
    mk(1.12, 0.38, 0.1, 0x241810, -2.2, 2.42, 4.71);
    const staffTransom = mk(0.98, 0.28, 0.11, 0xffd28a, -2.2, 2.42, 4.72, 0.2);
    staffTransom.material.emissive = new THREE.Color(0x9a6828);
    const staffSign = makeSignMesh(
      'P.201 — PHÒNG GIÁO VỤ',
      'HỘI ĐỒNG GIÁO VIÊN',
      0.52,
      0.24
    );
    staffSign.position.set(-1.28, 1.68, 4.72);
    scene.add(staffSign);

    // Cửa "LỚP 11A3" ở đầu hành lang trái (x = -6.42, z = 6.75)
    mk(0.1, 2.2, 1.12, 0x241810, -6.44, 1.1, 6.75);
    mk(0.08, 2.12, 0.98, 0x422c1d, -6.42, 1.06, 6.75, 0.7);
    const classSign = makeSignMesh('LỚP 11A3', 'GVCN: THẦY HÙNG', 0.5, 0.24);
    classSign.rotation.y = Math.PI / 2;
    classSign.position.set(-6.43, 1.68, 5.85);
    scene.add(classSign);

    // Bảng thông báo kính lớn của trường trên tường đối diện hành lang (x = 0.3, z = 8.76)
    mk(2.3, 1.26, 0.08, 0x3b2716, 0.3, 1.58, 8.78, 0.6);
    const bulletinMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.16, 1.12),
      new THREE.MeshStandardMaterial({
        map: createBulletinBoardTexture(),
        roughness: 0.45,
      })
    );
    bulletinMesh.rotation.y = Math.PI;
    bulletinMesh.position.set(0.3, 1.58, 8.73);
    scene.add(bulletinMesh);

    // Kính cửa sổ trong suốt + bệ đá hoa cương + cảnh SÂN BÓNG TRƯỜNG HỌC BAN ĐÊM bên ngoài (z > 8.9)
    [-3.4, 3.6].forEach((wx) => {
      const glassPane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.75, 1.28),
        new THREE.MeshStandardMaterial({
          color: 0x88b4e8,
          roughness: 0.08,
          metalness: 0.2,
          transparent: true,
          opacity: 0.22,
        })
      );
      glassPane.rotation.y = Math.PI;
      glassPane.position.set(wx, 1.72, 8.82);
      scene.add(glassPane);
      // Bệ cửa sổ đá hoa cương đen bóng
      mk(1.86, 0.05, 0.2, 0x242932, wx, 1.06, 8.75, 0.25, 0.2);
    });

    /* =====================================================================
     * 3. KHUNG CẢNH SÂN BÓNG SAU TRƯỜNG BAN ĐÊM NHÌN QUA CỬA SỔ HÀNH LANG
     * ===================================================================== */
    // Mặt sân bóng cỏ/đất đỏ phía dưới (y = -1.6, z: 9.2 -> 19.5)
    mk(22, 0.1, 11, 0x1a261e, 0, -1.65, 14.5, 0.95, 0, false);
    // Đường biên đất đỏ & vạch vôi trắng trên sân bóng
    mk(16, 0.02, 0.12, 0xd8dce4, 0, -1.58, 11.2, 0.7, 0, false);
    mk(16, 0.02, 0.12, 0xd8dce4, 0, -1.58, 17.6, 0.7, 0, false);
    mk(0.12, 0.02, 6.4, 0xd8dce4, -4.5, -1.58, 14.4, 0.7, 0, false);
    mk(0.12, 0.02, 6.4, 0xd8dce4, 4.5, -1.58, 14.4, 0.7, 0, false);
    // Dải đường chạy đất đỏ quanh sân bóng (nơi bắt nguồn mẫu bùn đỏ)
    mk(19, 0.015, 1.3, 0x4a2016, 0, -1.59, 10.2, 0.95, 0, false);

    // Khung thành bóng đá sơn trắng ở phía sân sau
    mk(0.08, 1.6, 0.08, 0xe8edf5, -3.2, -0.8, 15.2, 0.3, 0.4, false);
    mk(0.08, 1.6, 0.08, 0xe8edf5, -1.2, -0.8, 15.2, 0.3, 0.4, false);
    mk(2.08, 0.08, 0.08, 0xe8edf5, -2.2, 0.0, 15.2, 0.3, 0.4, false);

    // 2 Cột đèn cao áp sân vận động & bầu trời đêm có ánh trăng
    [-5.2, 5.2].forEach((tx) => {
      mk(0.14, 6.8, 0.14, 0x262c36, tx, 1.7, 16.5, 0.5, 0.7, false);
      const floodLamp = mk(0.75, 0.28, 0.2, 0xdbeaff, tx, 5.1, 16.3, 0.2, 0.5, false);
      floodLamp.material.emissive = new THREE.Color(0x9ec4ff);
    });
    const moonMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 24),
      new THREE.MeshBasicMaterial({ color: 0xeaf4ff })
    );
    moonMesh.position.set(2.4, 5.4, 18.8);
    moonMesh.rotation.y = Math.PI;
    scene.add(moonMesh);

    const yardMoonLight = new THREE.PointLight(0x7ca2dc, 0.55 * PI, 16, 0);
    yardMoonLight.position.set(0, 4.2, 13.5);
    scene.add(yardMoonLight);

    // Hàng cây tán rộng rìa sân trường trong bóng đêm
    [-4.2, -1.1, 1.8, 4.6].forEach((treeX, idx) => {
      mk(0.26, 2.8, 0.26, 0x231914, treeX, -0.2, 17.8, 0.9, 0, false);
      const crown = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.15 + (idx % 2) * 0.25, 1),
        new THREE.MeshStandardMaterial({ color: 0x13221a, roughness: 0.9 })
      );
      crown.position.set(treeX, 1.65 + (idx % 2) * 0.2, 17.8);
      scene.add(crown);
    });

    // Cầu thang bộ 3D dẫn xuống sân vận động ở đầu hành lang phải (x: 5.5 -> 6.38, z: 4.8 -> 5.65)
    for (let s = 0; s < 5; s++) {
      mk(
        0.22,
        0.16,
        0.95,
        0x4a505c,
        5.52 + s * 0.2,
        0.08 + s * 0.14,
        5.22,
        0.75
      );
    }
    // Tay vịn inox cầu thang bộ
    mk(1.05, 0.04, 0.04, 0x9aa4b4, 5.9, 0.95, 5.7, 0.25, 0.85);
    mk(0.04, 0.85, 0.04, 0x9aa4b4, 5.45, 0.45, 5.7, 0.25, 0.85);
    mk(0.04, 0.85, 0.04, 0x9aa4b4, 6.32, 0.95, 5.7, 0.25, 0.85);

    // Tủ điện kỹ thuật tầng 2 trên tường hành lang
    mk(0.46, 0.62, 0.08, 0x7a828c, -4.1, 1.58, 4.72, 0.4, 0.6);
    mk(0.12, 0.12, 0.09, 0xd8b218, -4.1, 1.64, 4.72, 0.4, 0.2);

    // Bình chữa cháy & Hộp báo cháy đỏ gắn trên cột trụ hành lang (x = 3.2, z = 4.9)
    const extGroup = new THREE.Group();
    extGroup.position.set(3.2, 0.95, 4.92);
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.42, 16),
      new THREE.MeshStandardMaterial({
        color: 0xb81d1d,
        roughness: 0.35,
        metalness: 0.4,
      })
    );
    extGroup.add(tank);
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.03, 0.1, 12),
      new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.3,
      })
    );
    nozzle.position.y = 0.24;
    extGroup.add(nozzle);
    scene.add(extGroup);
    // Chuông báo cháy đỏ
    const alarmBox = mk(0.14, 0.14, 0.04, 0xc42020, 3.2, 1.55, 4.89, 0.4);
    alarmBox.material.emissive = new THREE.Color(0x3a0505);

    // Dãy tủ Locker học sinh sát tường phải hành lang (x = 6.18, z = 6.75)
    mk(0.48, 1.95, 2.4, 0x243040, 6.2, 0.975, 6.75, 0.5, 0.4);
    const lockerFront = new THREE.Mesh(
      new THREE.PlaneGeometry(2.36, 1.88),
      new THREE.MeshStandardMaterial({
        map: createLockerFrontTexture(),
        roughness: 0.45,
        metalness: 0.35,
      })
    );
    lockerFront.rotation.y = -Math.PI / 2;
    lockerFront.position.set(5.95, 0.975, 6.75);
    scene.add(lockerFront);

    // Biển đèn "EXIT / LỐI RA SÂN BÓNG" phát sáng xanh lá ở đầu hành lang phải
    const exitSign = makeSignMesh(
      'EXIT → CẦU THANG',
      'LỐI XUỐNG SÂN VẬN ĐỘNG',
      0.56,
      0.22,
      '#0f4d2a',
      '#dcffe8'
    );
    exitSign.rotation.y = -Math.PI / 2;
    exitSign.position.set(6.42, 2.45, 6.75);
    (exitSign.material as THREE.MeshStandardMaterial).emissive =
      new THREE.Color(0x0a381e);
    scene.add(exitSign);

    // Ghế băng gỗ có tựa lưng ngoài hành lang (x = -2.2, z = 8.32)
    mk(1.75, 0.05, 0.46, 0x63442b, -2.2, 0.46, 8.32, 0.65);
    mk(1.75, 0.36, 0.04, 0x573b24, -2.2, 0.72, 8.53, 0.65);
    [-2.95, -2.2, -1.45].forEach((bx) => {
      mk(0.06, 0.46, 0.42, 0x22262c, bx, 0.23, 8.32, 0.5, 0.6);
    });

    // 2 Chậu cây cảnh trang trí hai bên hành lang
    [
      [0.65, 5.02],
      [-4.1, 8.32],
    ].forEach(([px, pz]) => {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.13, 0.36, 16),
        new THREE.MeshStandardMaterial({ color: 0x8c583a, roughness: 0.8 })
      );
      pot.position.set(px, 0.18, pz);
      scene.add(pot);
      for (let k = 0; k < 5; k++) {
        const leaf = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.14, 0),
          new THREE.MeshStandardMaterial({ color: 0x23422a, roughness: 0.85 })
        );
        leaf.position.set(
          px + Math.cos(k * 1.25) * 0.09,
          0.44 + (k % 2) * 0.1,
          pz + Math.sin(k * 1.25) * 0.09
        );
        scene.add(leaf);
      }
    });

    // Vệt giày đinh dính bùn đỏ sân bóng từ cầu thang hành lang dẫn vào cửa phòng bảo mật
    [
      [5.1, 7.1, 0.25],
      [4.3, 6.7, 0.32],
      [3.6, 6.2, 0.42],
      [2.95, 5.7, 0.48],
      [2.45, 5.15, 0.2],
    ].forEach(([fx, fz, rot]) => {
      const fp = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.005, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x5c2314, roughness: 1 })
      );
      fp.position.set(fx, 0.004, fz);
      fp.rotation.y = rot;
      scene.add(fp);
    });

    /* camera an ninh */
    const cc = new THREE.Group();
    cc.position.set(3.85, 2.5, -1);
    cc.rotation.y = -Math.PI / 2 - 0.3;
    const cm = new THREE.MeshStandardMaterial({
      color: 0x222428,
      metalness: 0.4,
      roughness: 0.5,
    });
    cc.add(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.13, 0.13), cm));
    const ln = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.2 })
    );
    ln.rotation.z = Math.PI / 2;
    ln.position.x = 0.22;
    cc.add(ln);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.2), cm);
    arm.position.set(-0.15, 0, -0.12);
    cc.add(arm);
    const ccProxy = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    ccProxy.userData.proxy = true;
    cc.add(ccProxy);
    cc.userData.act = { type: 'cctv' };
    scene.add(cc);

    function setLamp(on: boolean) {
      lampOn = on;
      lamp.intensity = on ? 1.25 * PI : 0;
      amb.intensity = (on ? 0.56 : 0.36) * PI;
      bulb.material.emissive.setHex(on ? 0xffe9b0 : 0x000000);
    }

    const isBlocked = (x: number, z: number, isDoorOpen = false) => {
      // Khu vực bên trong phòng bảo mật (tránh bàn chữ L và kệ sắt bên phải)
      const inRoom =
        x >= -3.7 &&
        x <= 3.7 &&
        z >= -3.85 &&
        z <= 4.35 &&
        !(x < -3.05 && z > 0.6 && z < 3.0) &&
        !(x < -2.3 && z > 2.25 && z < 3.0) &&
        !(x > 3.15 && z > -2.95 && z < -1.15);

      // Khu vực ô cửa phòng bảo mật (chỉ đi qua được khi đã mở cửa cua1.glb)
      const inDoorway =
        isDoorOpen && x >= 1.82 && x <= 2.58 && z >= 4.2 && z <= 5.1;

      // Khu vực hành lang trường học bên ngoài cửa
      const inHallway =
        x >= -6.0 &&
        x <= 5.65 &&
        z >= 5.0 &&
        z <= 8.4 &&
        !(x > -3.1 && x < -1.3 && z > 7.95); // tránh ghế băng hành lang

      return !(inRoom || inDoorway || inHallway);
    };

    return {
      setLamp,
      getLampOn: () => lampOn,
      isBlocked,
    };
  },
};
