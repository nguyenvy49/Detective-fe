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
  createChalkboardTexture,
  createClockFaceTexture,
  createDadoTileMaterial,
  createHallwayTileMaterial,
  createHonorBoardTexture,
  createLockerFrontTexture,
  createPersianRugTexture,
  createTacticsBoardTexture,
  createWallPlasterMaterial,
  createWoodFloorMaterial,
} from '@/lib/three/roomTextures';

const PI = Math.PI;
const F1_Y = -3.2; // Độ cao sàn Tầng 1 & Sân trường (Tầng 2 ở y = 0.0)

export const map01SecurityRoom: CrimeSceneMapConfig = {
  id: 'map_01_security_room',
  title: 'HIỆN TRƯỜNG 01 — TRƯỜNG THPT (KHU HIỆU BỘ & SÂN VẬN ĐỘNG)',
  briefing:
    'Đêm 14/10, trường THPT. Tủ hồ sơ kỷ luật tại Phòng Bảo Mật (Tầng 2) bị cạy. Bạn có thể tự tay mở các ngăn tủ, bật đèn, xem camera, mở cửa các phòng học / phòng giáo vụ / thư viện / phòng đội bóng, đi cầu thang bộ xuống Tầng 1 và bước ra Sân vận động sau trường để đối chiếu toàn bộ chứng cứ.',
  loadingText: 'Đang dựng mô hình toàn khu trường học…',
  enterButtonText: 'Bước vào hiện trường',
  errorModelText: 'Không tải được mô hình hiện trường',
  spawn: {
    position: [0.8, 1.65, 3.2],
    yaw: 0,
    pitch: 0,
  },
  backgroundHex: 0x04070e,
  fogNear: 14,
  fogFar: 44,

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
    // Tủ hồ sơ kỷ luật tại P.202 (Tầng 2)
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
    // Cửa P.202 — Phòng Bảo Mật (Tầng 2)
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
    // Cửa P.201 — Phòng Giáo Vụ (Tầng 2)
    {
      id: 'door_p201',
      url: '/models/map1/cua1.glb',
      rootObjectName: 'Simple white door',
      position: [-5.6, 0, 4.65],
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
    // Cửa Lớp 11A3 (Tầng 2 — đối diện hành lang)
    {
      id: 'door_11a3',
      url: '/models/map1/cua1.glb',
      rootObjectName: 'Simple white door',
      position: [-7.5, 0, 8.85],
      rotation: [0, 0, 0],
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
    // Cửa P.101 — Thư Viện Trường (Tầng 1)
    {
      id: 'door_library',
      url: '/models/map1/cua1.glb',
      rootObjectName: 'Simple white door',
      position: [-5.6, F1_Y, 4.65],
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
    // Cửa P.102 — Phòng Đội Bóng & Thể Chất (Tầng 1)
    {
      id: 'door_sports',
      url: '/models/map1/cua1.glb',
      rootObjectName: 'Simple white door',
      position: [2.2, F1_Y, 4.65],
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
    // Bàn làm việc + Ghế xoay tại P.202 Phòng Bảo Mật
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
    // Bàn làm việc Thầy Hùng tại P.201 Phòng Giáo Vụ
    {
      id: 'workdesk_p201',
      url: '/models/map1/workdesk.glb',
      rootObjectName: 'Complete Office Workplace Setup',
      position: [-10.5, 0, 1.8],
      rotation: [0, -Math.PI / 2, 0],
      scale: 1,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'ikea_markus.001',
          seatPos: [-10.14, 1.18, 1.61],
          seatYaw: Math.PI / 2,
          seatPitch: -0.12,
        },
      ],
    },
    // Bàn Thủ thư tại P.101 Thư Viện (Tầng 1)
    {
      id: 'workdesk_library',
      url: '/models/map1/workdesk.glb',
      rootObjectName: 'Complete Office Workplace Setup',
      position: [-10.5, F1_Y, 1.8],
      rotation: [0, -Math.PI / 2, 0],
      scale: 1,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'ikea_markus.001',
          seatPos: [-10.14, F1_Y + 1.18, 1.61],
          seatYaw: Math.PI / 2,
          seatPitch: -0.12,
        },
      ],
    },
    // Công tắc đèn P.202
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
    // Cửa sổ hành lang Tầng 2
    {
      id: 'hall_window_left',
      url: '/models/map1/window.glb',
      rootObjectName: '2 panel sliding window',
      position: [-3.5, 1.1, 8.78],
      rotation: [0, 0, 0],
      scale: 1.25,
      speed: 1,
      parts: [],
    },
    {
      id: 'hall_window_right',
      url: '/models/map1/window.glb',
      rootObjectName: '2 panel sliding window',
      position: [4.2, 1.1, 8.78],
      rotation: [0, 0, 0],
      scale: 1.25,
      speed: 1,
      parts: [],
    },
    // Quạt trần các phòng
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
    {
      id: 'ceiling_fan_p201',
      url: '/models/map1/ceiling_fan.glb',
      rootObjectName: 'Ceiling Fan',
      position: [-7.8, 2.48, -0.5],
      rotation: [0, 0, 0],
      scale: 1.55,
      speed: 1,
      autoSpinY: 1.8,
      parts: [],
    },
    {
      id: 'ceiling_fan_11a3',
      url: '/models/map1/ceiling_fan.glb',
      rootObjectName: 'Ceiling Fan',
      position: [-7.8, 2.48, 12.2],
      rotation: [0, 0, 0],
      scale: 1.55,
      speed: 1,
      autoSpinY: 2.2,
      parts: [],
    },
    // Kệ sách GLB (bookshelf.glb) được bố trí tại các vị trí phòng học & thư viện
    // Giữ nguyên gltf.scene để kệ sách và toàn bộ 10 bộ sách bách khoa đi liền khối nhau
    // 1. P.101 — Thư Viện Trường (Tầng 1): 3 kệ sách lớn song song đặt sát tường Bắc và trung tâm
    {
      id: 'bookshelf_lib_1',
      url: '/models/map1/bookshelf.glb',
      position: [-7.5, F1_Y, -3.8],
      rotation: [0, 0, 0],
      scale: 1.15,
      speed: 1,
      parts: [],
    },
    {
      id: 'bookshelf_lib_2',
      url: '/models/map1/bookshelf.glb',
      position: [-7.5, F1_Y, -1.8],
      rotation: [0, 0, 0],
      scale: 1.15,
      speed: 1,
      parts: [],
    },
    {
      id: 'bookshelf_lib_3',
      url: '/models/map1/bookshelf.glb',
      position: [-7.5, F1_Y, 0.2],
      rotation: [0, 0, 0],
      scale: 1.15,
      speed: 1,
      parts: [],
    },
    // 2. P.201 — Phòng Giáo Vụ (Tầng 2): Kệ sách tài liệu, giáo án và sổ điểm cạnh bàn họp
    {
      id: 'bookshelf_staff',
      url: '/models/map1/bookshelf.glb',
      position: [-4.6, 0, -2.5],
      rotation: [0, -Math.PI / 2, 0],
      scale: 1.1,
      speed: 1,
      parts: [],
    },
    // 3. Lớp 11A3 (Tầng 2): Góc thư viện lớp học / tủ sách tham khảo cuối lớp
    {
      id: 'bookshelf_class11a3',
      url: '/models/map1/bookshelf.glb',
      position: [-4.6, 0, 14.5],
      rotation: [0, -Math.PI / 2, 0],
      scale: 1.1,
      speed: 1,
      parts: [],
    },
    // Bình chữa cháy PCCC (fire_extinguisher.glb)
    {
      id: 'fire_extinguisher_f2',
      url: '/models/map1/fire_extinguisher.glb',
      position: [2.85, 0.0, 4.92],
      rotation: [0, 0.4, 0],
      scale: 1.25,
      speed: 1,
      parts: [],
    },
    {
      id: 'fire_extinguisher_p202',
      url: '/models/map1/fire_extinguisher.glb',
      position: [3.65, 0.0, 4.2],
      rotation: [0, -1.2, 0],
      scale: 1.2,
      speed: 1,
      parts: [],
    },
    {
      id: 'fire_extinguisher_f1',
      url: '/models/map1/fire_extinguisher.glb',
      position: [2.85, F1_Y, 4.92],
      rotation: [0, 0.4, 0],
      scale: 1.25,
      speed: 1,
      parts: [],
    },
    {
      id: 'fire_extinguisher_sports',
      url: '/models/map1/fire_extinguisher.glb',
      position: [3.65, F1_Y, 4.2],
      rotation: [0, -1.2, 0],
      scale: 1.2,
      speed: 1,
      parts: [],
    },
    // Ghế băng Nelson Bench (bench1.glb) có tính năng bấm E để ngồi
    // Ghế băng hành lang Tầng 2 dưới cửa sổ nhìn ra sân trường
    {
      id: 'bench_hall_f2',
      url: '/models/map1/bench1.glb',
      position: [-3.5, 0.0, 8.35],
      rotation: [0, 0, 0],
      scale: 0.95,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'Nelson Bench',
          seatPos: [-3.5, 1.05, 8.3],
          seatYaw: Math.PI,
          seatPitch: -0.1,
        },
      ],
    },
    // Ghế băng nghỉ chân sân trường bên trái
    {
      id: 'bench_yard_left',
      url: '/models/map1/bench1.glb',
      position: [-3.8, F1_Y, 11.4],
      rotation: [0, 0, 0],
      scale: 0.95,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'Nelson Bench',
          seatPos: [-3.8, F1_Y + 1.05, 11.4],
          seatYaw: 0,
          seatPitch: -0.1,
        },
      ],
    },
    // Ghế băng nghỉ chân sân trường bên phải
    {
      id: 'bench_yard_right',
      url: '/models/map1/bench1.glb',
      position: [3.2, F1_Y, 11.4],
      rotation: [0, 0, 0],
      scale: 0.95,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'Nelson Bench',
          seatPos: [3.2, F1_Y + 1.05, 11.4],
          seatYaw: 0,
          seatPitch: -0.1,
        },
      ],
    },
    // Ghế băng thay đồ đội bóng P.102
    {
      id: 'bench_sports',
      url: '/models/map1/bench1.glb',
      position: [-0.3, F1_Y, -1.2],
      rotation: [0, 0, 0],
      scale: 1.0,
      speed: 1,
      parts: [],
      seatNodes: [
        {
          nodeName: 'Nelson Bench',
          seatPos: [-0.3, F1_Y + 1.05, -1.2],
          seatYaw: 0,
          seatPitch: -0.1,
        },
      ],
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
    '19:30 — Minh rời Lớp 11A3 về nhà (lời khai)',
    '20:30 — Tuấn kết thúc buổi tập ở Sân bóng & Phòng Đội bóng P.102 (lời khai)',
    '20:45 — CCTV Phòng Bảo Mật P.202 (Tầng 2): có bóng người đi qua',
    '21:00 — Thầy Hùng (P.201 Giáo vụ) và Lan (P.101 Thư viện) rời trường',
  ],

  suspects: [
    {
      id: 'hung',
      name: 'Thầy Hùng',
      role: 'GVCN lớp 11A3 (Phòng Giáo vụ P.201)',
      statement:
        '“Tôi ở phòng giáo vụ P.201 chấm bài đến 21:00, không đi qua phòng bảo mật.”',
    },
    {
      id: 'minh',
      name: 'Nguyễn Văn Minh',
      role: 'Học sinh 11A3',
      statement: '“Em trực nhật lớp 11A3 xong là về nhà lúc 19:30.”',
    },
    {
      id: 'tuan',
      name: 'Nguyễn Anh Tuấn',
      role: 'Học sinh 11A3, đội trưởng đội bóng',
      statement:
        '“Tập xong ở sân vận động lúc 20:30 là em về luôn, không lên tầng 2.”',
    },
    {
      id: 'lan',
      name: 'Phạm Thu Lan',
      role: 'Học sinh 11A1 (Thư viện P.101)',
      statement: '“Em đọc sách ở thư viện tầng 1 đến 21:00, thủ thư có thấy em.”',
    },
  ],

  solution: {
    culpritId: 'tuan',
    minEvidenceCount: 3,
    totalKeyEvidence: 4,
    trueEndingText:
      'Khuy áo 11A3, mẫu bùn đỏ sân bóng, quyết định đình chỉ thi đấu và đoạn CCTV 20:45 (cùng vệt giày đinh dính bùn từ Phòng Đội bóng P.102 theo cầu thang bộ lên thẳng P.202) đã bác bỏ hoàn toàn lời khai của Tuấn. Tuấn thừa nhận đã lẻn lên tầng 2 cạy tủ tìm bản gốc quyết định.',
    insufficientEvidenceText:
      'Bạn nghi đúng người nhưng bằng chứng chưa đủ then chốt. Luật sư bác bỏ cáo buộc và vụ án bị đình lại.',
    wrongSuspectText: (name) =>
      `Bạn buộc tội nhầm ${name}. Hung thủ thật vẫn ngoài vòng pháp luật.`,
  },

  buildEnvironment(scene: THREE.Scene) {
    const amb = new THREE.AmbientLight(0x7488b0, 0.38 * PI);
    scene.add(amb);

    const hemi = new THREE.HemisphereLight(0x8aa4d6, 0x2a211b, 0.26 * PI);
    scene.add(hemi);

    // Đèn chính trong Phòng Bảo Mật P.202 (bật/tắt bằng công tắc switch.glb)
    const lamp = new THREE.PointLight(0xffe6b8, 0, 18, 0);
    lamp.position.set(0, 2.72, 0);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.bias = -0.0012;
    lamp.shadow.normalBias = 0.02;
    scene.add(lamp);

    // Ánh sáng màn hình máy tính bàn P.202
    const monitorLight = new THREE.PointLight(0x6ab8ff, 0.28 * PI, 2.8, 0);
    monitorLight.position.set(-3.28, 1.08, 1.8);
    scene.add(monitorLight);

    let lampOn = false;

    const woodFloorMat = createWoodFloorMaterial();
    const roomWallMat = createWallPlasterMaterial('#484d56', 4, 2);
    const classWallMat = createWallPlasterMaterial('#525648', 4, 2);
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
      g.font = 'bold 36px "Courier New",monospace';
      g.fillText(text, 256, 110);
      g.font = '23px "Courier New",monospace';
      g.fillStyle = '#d0c8b0';
      g.fillText(sub, 256, 174);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 })
      );
    }

    /* =====================================================================
     * TẦNG 2 — PHÒNG BẢO MẬT P.202 (x: -4 -> 4, z: -5.1 -> 4.65, y = 0)
     * ===================================================================== */
    mkMat(8, 0.1, 9.75, woodFloorMat, 0, -0.05, -0.225);
    mkMat(8, 0.1, 9.75, ceilingMat, 0, 3.05, -0.225);
    mkMat(8, 3, 0.1, roomWallMat, 0, 1.5, -5.15);
    mkMat(0.1, 3, 9.75, roomWallMat, -4.05, 1.5, -0.225);
    mkMat(0.1, 3, 9.75, roomWallMat, 4.05, 1.5, -0.225);
    // Phào chân tường P.202
    mk(8, 0.14, 0.03, 0x221a14, 0, 0.07, -5.09, 0.8, 0.05, false);
    mk(0.03, 0.14, 9.7, 0x221a14, -3.99, 0.07, -0.25, 0.8, 0.05, false);
    mk(0.03, 0.14, 9.7, 0x221a14, 3.99, 0.07, -0.25, 0.8, 0.05, false);

    // Thảm dệt cổ điển giữa phòng P.202
    mkMat(3.2, 0.02, 2.2, rugMat, -1.4, 0.011, 0.2);

    // Kệ sắt lưu trữ hồ sơ sát tường phải P.202 (x = 3.55, z = -2.0)
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

    // Đồng hồ treo tường P.202 chỉ 20:48
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

    // Cây nước nóng lạnh & đầu ghi CCTV DVR tại P.202
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
    mk(0.42, 0.09, 0.32, 0x181b20, 3.72, 1.88, -1.8, 0.35, 0.7);
    const dvrLed = mk(0.02, 0.015, 0.01, 0x22ff66, 3.5, 1.88, -1.68, 0.2, 0, false);
    dvrLed.material.emissive = new THREE.Color(0x18cc44);

    /* =====================================================================
     * TẦNG 2 — PHÒNG GIÁO VỤ P.201 (x: -11.5 -> -4.05, z: -5.1 -> 4.65, y = 0)
     * ===================================================================== */
    mkMat(7.45, 0.1, 9.75, woodFloorMat, -7.775, -0.05, -0.225);
    mkMat(7.45, 0.1, 9.75, ceilingMat, -7.775, 3.05, -0.225);
    mkMat(7.45, 3, 0.1, roomWallMat, -7.775, 1.5, -5.15);
    mkMat(0.1, 3, 9.75, roomWallMat, -11.5, 1.5, -0.225);

    // Đèn trần vàng ấm trong Phòng Giáo Vụ (nơi Thầy Hùng vừa ngồi chấm bài)
    const staffRoomLight = new THREE.PointLight(0xffdfa8, 0.72 * PI, 13, 0);
    staffRoomLight.position.set(-7.8, 2.72, -0.5);
    scene.add(staffRoomLight);
    const staffBulb = mk(1.1, 0.04, 0.32, 0xfff0c8, -7.8, 2.96, -0.5, 0.2, 0.05, false);
    staffBulb.material.emissive = new THREE.Color(0xd8a858);

    // Bàn họp dài Hội đồng Giáo viên ở giữa P.201 (x = -7.4, z = -0.8)
    mk(1.5, 0.06, 3.8, 0x4d321e, -7.2, 0.76, -0.8, 0.45, 0.1);
    [
      [-7.8, -2.4],
      [-6.6, -2.4],
      [-7.8, 0.8],
      [-6.6, 0.8],
    ].forEach(([lx, lz]) => {
      mk(0.08, 0.75, 0.08, 0x2b1d12, lx, 0.375, lz, 0.6);
    });
    // Ghế gỗ quanh bàn họp giáo viên
    [-2.0, -0.8, 0.4].forEach((cz) => {
      // Bên trái & bên phải bàn họp
      [-8.25, -6.15].forEach((cx, side) => {
        mk(0.44, 0.05, 0.44, 0x3b2616, cx, 0.45, cz, 0.6);
        mk(0.06, 0.48, 0.44, 0x3b2616, cx + (side === 0 ? -0.2 : 0.2), 0.7, cz, 0.6);
        mk(0.42, 0.44, 0.05, 0x26180e, cx, 0.22, cz - 0.18, 0.7);
        mk(0.42, 0.44, 0.05, 0x26180e, cx, 0.22, cz + 0.18, 0.7);
      });
    });
    // Ấm trà sứ + tách trà + chồng vở chấm bài 11A3 của Thầy Hùng trên bàn giáo vụ
    mk(0.32, 0.02, 0.24, 0x2b1b10, -7.2, 0.8, -0.6, 0.5); // khay trà gỗ
    const teapot = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.2 })
    );
    teapot.position.set(-7.2, 0.87, -0.6);
    scene.add(teapot);
    // Chồng vở bài kiểm tra học sinh 11A3
    mk(0.24, 0.09, 0.32, 0x2b547e, -7.0, 0.835, 0.25, 0.8);
    mk(0.24, 0.07, 0.32, 0x8a2be2, -7.38, 0.825, -1.5, 0.8);

    // Tủ trưng bày Cúp lưu niệm & Bằng khen sát tường Bắc P.201 (x = -7.6, z = -4.78)
    mk(3.2, 2.1, 0.45, 0x382415, -7.6, 1.05, -4.82, 0.55);
    [-1.4, -0.5, 0.4, 1.3].forEach((tx, idx) => {
      // Cúp vàng lưu niệm trên kệ tủ
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.03, 0.22, 14),
        new THREE.MeshStandardMaterial({
          color: idx % 2 === 0 ? 0xffd700 : 0xe0e6ed,
          metalness: 0.85,
          roughness: 0.2,
        })
      );
      cup.position.set(-7.6 + tx * 0.7, 1.35, -4.72);
      scene.add(cup);
    });

    const staffBoard = makeSignMesh(
      'LỊCH CÔNG TÁC TUẦN — PHÒNG GIÁO VỤ',
      'Thầy Hùng (11A3): Trực chấm bài tối 14/10 đến 21:00',
      1.6,
      0.75,
      '#1e3528',
      '#f4f1e6'
    );
    staffBoard.rotation.y = -Math.PI / 2;
    staffBoard.position.set(-4.12, 1.72, -1.2);
    scene.add(staffBoard);

    /* =====================================================================
     * TẦNG 2 — LỚP HỌC 11A3 (x: -11.5 -> -4.1, z: 8.85 -> 15.65, y = 0)
     * ===================================================================== */
    mkMat(7.4, 0.1, 6.8, hallFloorMat, -7.8, -0.05, 12.25);
    mkMat(7.4, 0.1, 6.8, ceilingMat, -7.8, 3.05, 12.25);
    mkMat(7.4, 3, 0.1, classWallMat, -7.8, 1.5, 15.65); // tường Nam lớp 11A3
    mkMat(0.1, 3, 6.8, classWallMat, -11.5, 1.5, 12.25); // tường Tây (treo bảng phấn)
    mkMat(0.1, 3, 6.8, classWallMat, -4.1, 1.5, 12.25); // tường Đông lớp 11A3

    // Đèn tuýp lớp học 11A3
    const classLight = new THREE.PointLight(0xdceaff, 0.65 * PI, 12, 0);
    classLight.position.set(-7.8, 2.75, 12.25);
    scene.add(classLight);
    const classBulb = mk(1.2, 0.04, 0.3, 0xe8f2ff, -7.8, 2.96, 12.25, 0.2, 0.05, false);
    classBulb.material.emissive = new THREE.Color(0x8ab4e8);

    // Bục giảng gỗ & Bảng phấn xanh lớn Lớp 11A3 trên tường Tây (x = -11.42)
    mk(1.1, 0.18, 4.4, 0x4a321e, -10.85, 0.09, 12.25, 0.7);
    mk(0.06, 1.48, 3.7, 0x3b2616, -11.42, 1.68, 12.25, 0.6);
    const chalkMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.56, 1.36),
      new THREE.MeshStandardMaterial({
        map: createChalkboardTexture(),
        roughness: 0.75,
      })
    );
    chalkMesh.rotation.y = Math.PI / 2;
    chalkMesh.position.set(-11.38, 1.68, 12.25);
    scene.add(chalkMesh);

    // Khẩu hiệu "TIÊN HỌC LỄ - HẬU HỌC VĂN" phía trên bảng lớp 11A3
    const mottoSign = makeSignMesh(
      'TIÊN HỌC LỄ — HẬU HỌC VĂN',
      'LỚP 11A3 — ĐOÀN KẾT · CHĂM NGOAN · HỌC GIỎI',
      2.6,
      0.38,
      '#7a1216',
      '#ffe866'
    );
    mottoSign.rotation.y = Math.PI / 2;
    mottoSign.position.set(-11.4, 2.65, 12.25);
    scene.add(mottoSign);

    // Bàn giáo viên Lớp 11A3 (x = -10.3, z = 14.3)
    mk(0.7, 0.75, 1.15, 0x4d331f, -10.3, 0.55, 14.3, 0.6);
    mk(0.28, 0.04, 0.36, 0x1e3a5f, -10.25, 0.95, 14.3, 0.8); // sổ đầu bài lớp 11A3

    // 9 Bộ bàn ghế học sinh gỗ đôi Lớp 11A3 (3 dãy x 3 hàng, có lối đi rộng ở giữa)
    [-8.9, -7.2, -5.5].forEach((dx) => {
      [10.7, 12.3, 13.9].forEach((dz) => {
        // Mặt bàn học sinh + ngăn bàn + chân sắt
        mk(0.52, 0.04, 1.12, 0x6e4b2b, dx, 0.72, dz, 0.55);
        mk(0.46, 0.12, 1.06, 0x54381f, dx, 0.62, dz, 0.7);
        mk(0.04, 0.72, 1.06, 0x262b33, dx - 0.22, 0.36, dz, 0.5, 0.6);
        // Ghế băng học sinh
        mk(0.32, 0.04, 1.08, 0x634224, dx + 0.44, 0.44, dz, 0.6);
        mk(0.04, 0.44, 1.04, 0x262b33, dx + 0.44, 0.22, dz, 0.5, 0.6);
      });
    });

    /* =====================================================================
     * TẦNG 2 — HÀNH LANG TRƯỜNG HỌC (x: -11.5 -> 6.5, z: 4.65 -> 8.85, y = 0)
     * ===================================================================== */
    mkMat(18, 0.1, 4.2, hallFloorMat, -2.5, -0.05, 6.75);
    mkMat(18, 0.1, 4.2, ceilingMat, -2.5, 3.05, 6.75);
    mkMat(0.1, 3, 4.2, hallWallMat, -11.5, 1.5, 6.75);

    // Tường Bắc Hành lang Tầng 2 z = 4.65 (chừa cửa P.201 tại x = -5.6 và cửa P.202 tại x = 2.2)
    mkMat(5.4, 3, 0.1, hallWallMat, -8.8, 1.5, 4.65); // -11.5 -> -6.1
    mkMat(1.0, 0.8, 0.1, hallWallMat, -5.6, 2.6, 4.65); // trên cửa P.201
    mkMat(6.8, 3, 0.1, hallWallMat, -1.7, 1.5, 4.65); // -5.1 -> 1.7
    mkMat(1.0, 0.8, 0.1, hallWallMat, 2.2, 2.6, 4.65); // trên cửa P.202
    mkMat(3.8, 3, 0.1, hallWallMat, 4.6, 1.5, 4.65); // 2.7 -> 6.5

    // Tường Nam Hành lang Tầng 2 z = 8.85 (chừa cửa Lớp 11A3 tại x = -7.5 và 2 cửa sổ tại x = -3.5, 4.2)
    mkMat(3.5, 3, 0.1, hallWallMat, -9.75, 1.5, 8.85); // -11.5 -> -8.0
    mkMat(1.0, 0.8, 0.1, hallWallMat, -7.5, 2.6, 8.85); // trên cửa 11A3
    mkMat(2.85, 3, 0.1, hallWallMat, -5.575, 1.5, 8.85); // -7.0 -> -4.15
    mkMat(10.65, 1.1, 0.1, hallWallMat, 1.175, 0.55, 8.85); // dưới bệ 2 cửa sổ (-4.15 -> 6.5)
    mkMat(10.65, 0.45, 0.1, hallWallMat, 1.175, 2.775, 8.85); // trên đỉnh 2 cửa sổ (-4.15 -> 6.5)
    mkMat(6.4, 1.45, 0.1, hallWallMat, 0.35, 1.825, 8.85); // mảng tường giữa 2 cửa sổ (-2.85 -> 3.55)
    mkMat(1.65, 1.45, 0.1, hallWallMat, 5.675, 1.825, 8.85); // mảng tường phải (4.85 -> 6.5)

    // Gạch thẻ men xanh rêu ốp chân tường hành lang Tầng 2
    mkMat(5.3, 1.04, 0.03, dadoTileMat, -8.8, 0.52, 4.71);
    mkMat(6.7, 1.04, 0.03, dadoTileMat, -1.7, 0.52, 4.71);
    mkMat(3.7, 1.04, 0.03, dadoTileMat, 4.6, 0.52, 4.71);
    mkMat(3.4, 1.04, 0.03, dadoTileMat, -9.75, 0.52, 8.79);
    mkMat(13.4, 1.04, 0.03, dadoTileMat, -0.25, 0.52, 8.79);

    // Hệ cột trụ bê tông & dầm trần hành lang Tầng 2
    [-9.2, -5.0, -1.65, 2.85].forEach((px) => {
      mk(0.24, 3.0, 0.18, 0x383d46, px, 1.5, 4.74, 0.8);
      mk(0.24, 3.0, 0.18, 0x383d46, px, 1.5, 8.76, 0.8);
      mk(0.26, 0.22, 4.2, 0x2f333c, px, 2.9, 6.75, 0.8, 0.05, false);
    });

    // Đèn trần hành lang Tầng 2
    [-8.2, -3.5, 0.55, 4.2].forEach((lx, idx) => {
      const hLight = new THREE.PointLight(
        idx === 2 ? 0xffe4b5 : 0x9ab8dc,
        (idx === 2 ? 0.58 : 0.44) * PI,
        11,
        0
      );
      hLight.position.set(lx, 2.7, 6.75);
      if (idx === 2) {
        hLight.castShadow = true;
        hLight.shadow.mapSize.set(1024, 1024);
        hLight.shadow.bias = -0.0012;
      }
      scene.add(hLight);
      mk(1.1, 0.05, 0.26, 0x252830, lx, 2.98, 6.75, 0.4, 0.5, false);
      const hBulb = mk(0.98, 0.04, 0.18, 0xd8e8ff, lx, 2.95, 6.75, 0.2, 0.05, false);
      hBulb.material.emissive = new THREE.Color(
        idx === 2 ? 0xb59c6e : 0x7292b8
      );
    });

    // Biển tên các phòng Tầng 2
    const secSign = makeSignMesh(
      'P.202 — PHÒNG BẢO MẬT',
      'LƯU TRỮ HỒ SƠ & ĐỀ THI',
      0.52,
      0.24
    );
    secSign.position.set(1.15, 1.68, 4.72);
    scene.add(secSign);

    const staffSign = makeSignMesh(
      'P.201 — PHÒNG GIÁO VỤ',
      'HỘI ĐỒNG GIÁO VIÊN (MỞ CỬA)',
      0.56,
      0.24
    );
    staffSign.position.set(-6.65, 1.68, 4.72);
    scene.add(staffSign);

    const classSign = makeSignMesh(
      'LỚP 11A3',
      'GVCN: THẦY HÙNG (MỞ CỬA)',
      0.54,
      0.24
    );
    classSign.rotation.y = Math.PI;
    classSign.position.set(-6.45, 1.68, 8.78);
    scene.add(classSign);

    // Bảng thông báo kính lớn của trường (chính giữa khoang cột -1.65 và 2.85, tại x = 0.55)
    mk(2.3, 1.24, 0.06, 0x3b2716, 0.55, 1.72, 8.79, 0.6);
    const bulletinMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.16, 1.1),
      new THREE.MeshStandardMaterial({
        map: createBulletinBoardTexture(),
        roughness: 0.45,
      })
    );
    bulletinMesh.rotation.y = Math.PI;
    bulletinMesh.position.set(0.55, 1.72, 8.75);
    scene.add(bulletinMesh);

    // Kính 2 cửa sổ hành lang Tầng 2
    [-3.5, 4.2].forEach((wx) => {
      const glassPane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.3, 1.45),
        new THREE.MeshStandardMaterial({
          color: 0x88b4e8,
          roughness: 0.08,
          metalness: 0.2,
          transparent: true,
          opacity: 0.22,
        })
      );
      glassPane.rotation.y = Math.PI;
      glassPane.position.set(wx, 1.82, 8.82);
      scene.add(glassPane);
      mk(1.42, 0.05, 0.18, 0x242932, wx, 1.08, 8.75, 0.25, 0.2);
    });

    // Tủ điện, Chuông báo cháy & Dãy tủ Locker học sinh Tầng 2
    mk(0.46, 0.62, 0.08, 0x7a828c, -3.5, 1.58, 4.72, 0.4, 0.6);
    mk(0.12, 0.12, 0.09, 0xd8b218, -3.5, 1.64, 4.72, 0.4, 0.2);

    // Hộp nút báo cháy khẩn cấp trên tường hành lang (bình chữa cháy GLB đặt ngay bên dưới)
    const alarmBox = mk(0.14, 0.14, 0.04, 0xc42020, 2.85, 1.55, 4.86, 0.4);
    alarmBox.material.emissive = new THREE.Color(0x3a0505);

    mk(2.2, 1.95, 0.44, 0x243040, 4.35, 0.975, 4.93, 0.5, 0.4);
    const lockerFront = new THREE.Mesh(
      new THREE.PlaneGeometry(2.14, 1.88),
      new THREE.MeshStandardMaterial({
        map: createLockerFrontTexture(),
        roughness: 0.45,
        metalness: 0.35,
      })
    );
    lockerFront.position.set(4.35, 0.975, 5.16);
    scene.add(lockerFront);

    /* =====================================================================
     * BUỒNG CẦU THANG BỘ 2 NHỊP CÓ CHIẾU NGHỈ (x: 6.5 -> 10.5, z: 4.65 -> 8.85)
     * - Nhịp trên (z: 4.75 -> 6.6): đi từ Tầng 2 (x = 6.5, y = 0) xuống Chiếu nghỉ (x = 8.6, y = -1.6)
     * - Chiếu nghỉ (x: 8.6 -> 10.45, z: 4.65 -> 8.85, y = -1.6)
     * - Nhịp dưới (z: 6.9 -> 8.75): đi từ Chiếu nghỉ (x = 8.6, y = -1.6) xuống Tầng 1 (x = 6.5, y = -3.2)
     * ===================================================================== */
    // Trần & tường bao buồng cầu thang Đông (cao từ y = -3.2 đến y = 3.0)
    mkMat(4.0, 0.1, 4.2, ceilingMat, 8.5, 3.05, 6.75);
    mkMat(4.0, 0.1, 4.2, hallFloorMat, 8.5, F1_Y - 0.05, 6.75);
    mkMat(4.0, 6.3, 0.1, hallWallMat, 8.5, -0.1, 4.65); // tường Bắc cầu thang
    mkMat(4.0, 6.3, 0.1, hallWallMat, 8.5, -0.1, 8.85); // tường Nam cầu thang
    mkMat(0.1, 6.3, 4.2, hallWallMat, 10.5, -0.1, 6.75); // tường Đông chiếu nghỉ
    // Tường chắn lan can đầu hành lang Tầng 2 phía trên nhịp cầu thang dưới (x = 6.5, z: 6.85 -> 8.85, y: 0 -> 1.05)
    mk(0.12, 1.05, 1.95, 0x383d46, 6.48, 0.525, 7.85, 0.7);
    mk(0.16, 0.06, 1.98, 0x4a3522, 6.48, 1.06, 7.85, 0.5);

    // Biển đèn EXIT chỉ lối xuống Cầu thang Tầng 1 & Sân trường
    const exitSignF2 = makeSignMesh(
      'EXIT ↓ CẦU THANG BỘ',
      'XUỐNG TẦNG 1 & SÂN VẬN ĐỘNG',
      0.62,
      0.24,
      '#0f4d2a',
      '#dcffe8'
    );
    exitSignF2.rotation.y = -Math.PI / 2;
    exitSignF2.position.set(6.48, 2.55, 5.65);
    (exitSignF2.material as THREE.MeshStandardMaterial).emissive =
      new THREE.Color(0x0a381e);
    scene.add(exitSignF2);

    // Đèn chiếu sáng buồng cầu thang
    const stairLight = new THREE.PointLight(0xffe0b2, 0.65 * PI, 11, 0);
    stairLight.position.set(8.8, 1.2, 6.75);
    scene.add(stairLight);

    // Sàn chiếu nghỉ giữa tầng (x: 8.6 -> 10.45, z: 4.7 -> 8.8, y = -1.6)
    mkMat(1.9, 0.16, 4.1, hallFloorMat, 9.52, -1.68, 6.75);
    // Cửa sổ kính lớn & song chắn an toàn tại Chiếu nghỉ cầu thang (x = 10.44, z = 6.75)
    mk(0.14, 1.85, 2.1, 0x242a34, 10.46, -0.35, 6.75, 0.4, 0.3);
    const stairGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.94, 1.68),
      new THREE.MeshStandardMaterial({
        color: 0x7aa8e8,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.25,
      })
    );
    stairGlass.rotation.y = -Math.PI / 2;
    stairGlass.position.set(10.41, -0.35, 6.75);
    scene.add(stairGlass);

    // 10 Bậc cầu thang nhịp trên (từ x = 6.5, y = 0 xuống x = 8.6, y = -1.6 tại z = 5.68)
    for (let i = 0; i < 10; i++) {
      const sx = 6.605 + i * 0.21;
      const sy = -0.08 - i * 0.16;
      mk(0.23, 0.16, 1.82, 0x464c56, sx, sy, 5.68, 0.65);
      // Nẹp mũi bậc chống trượt màu vàng đồng
      mk(0.03, 0.02, 1.8, 0xc8a44d, sx - 0.1, sy + 0.082, 5.68, 0.4, 0.7, false);
    }

    // 10 Bậc cầu thang nhịp dưới (từ x = 8.6, y = -1.6 xuống x = 6.5, y = -3.2 tại z = 7.82)
    for (let i = 0; i < 10; i++) {
      const sx = 8.495 - i * 0.21;
      const sy = -1.68 - i * 0.16;
      mk(0.23, 0.16, 1.82, 0x464c56, sx, sy, 7.82, 0.65);
      mk(0.03, 0.02, 1.8, 0xc8a44d, sx + 0.1, sy + 0.082, 7.82, 0.4, 0.7, false);
    }

    // Tường lửng & Tay vịn inox ngăn giữa 2 nhịp cầu thang (z = 6.75, x: 6.5 -> 8.6)
    for (let i = 0; i < 7; i++) {
      const rx = 6.65 + i * 0.31;
      const ry = -0.1 - i * 0.22;
      mk(0.05, 1.05, 0.05, 0x9aa4b4, rx, ry + 0.45, 6.75, 0.25, 0.85);
    }
    const railSlope1 = mk(2.35, 0.05, 0.06, 0x5c3c24, 7.55, 0.12, 6.65, 0.5);
    railSlope1.rotation.z = -0.65;
    const railSlope2 = mk(2.35, 0.05, 0.06, 0x5c3c24, 7.55, -1.48, 6.85, 0.5);
    railSlope2.rotation.z = 0.65;

    /* =====================================================================
     * TẦNG 1 — SẢNH CHÍNH & HÀNH LANG TẦNG 1 (x: -11.5 -> 6.5, z: 4.65 -> 8.85, y = -3.2)
     * ===================================================================== */
    mkMat(18, 0.1, 4.2, hallFloorMat, -2.5, F1_Y - 0.05, 6.75);
    mkMat(18, 0.1, 4.2, ceilingMat, -2.5, F1_Y + 3.05, 6.75);
    mkMat(0.1, 3.1, 4.2, hallWallMat, -11.5, F1_Y + 1.55, 6.75);

    // Tường Bắc Hành lang Tầng 1 z = 4.65 (chừa cửa Thư Viện P.101 tại x = -5.6 và cửa Phòng Đội Bóng P.102 tại x = 2.2)
    mkMat(5.4, 3.1, 0.1, hallWallMat, -8.8, F1_Y + 1.55, 4.65);
    mkMat(1.0, 0.9, 0.1, hallWallMat, -5.6, F1_Y + 2.65, 4.65);
    mkMat(6.8, 3.1, 0.1, hallWallMat, -1.7, F1_Y + 1.55, 4.65);
    mkMat(1.0, 0.9, 0.1, hallWallMat, 2.2, F1_Y + 2.65, 4.65);
    mkMat(3.8, 3.1, 0.1, hallWallMat, 4.6, F1_Y + 1.55, 4.65);

    // Tường Nam Sảnh Chính Tầng 1 z = 8.85 (MỞ CỔNG ĐẠI SẢNH RỘNG 3.5m TẠI x: -1.2 -> 2.3 RA SÂN TRƯỜNG!)
    mkMat(10.3, 3.1, 0.1, hallWallMat, -6.35, F1_Y + 1.55, 8.85); // -11.5 -> -1.2
    mkMat(3.5, 0.65, 0.1, hallWallMat, 0.55, F1_Y + 2.775, 8.85); // dầm trên cổng đại sảnh
    mkMat(4.2, 3.1, 0.1, hallWallMat, 4.4, F1_Y + 1.55, 8.85); // 2.3 -> 6.5
    // 2 Cột trụ đá hoa cương cổng Đại Sảnh Tầng 1
    mk(0.32, 3.1, 0.28, 0x28303d, -1.2, F1_Y + 1.55, 8.85, 0.35, 0.2);
    mk(0.32, 3.1, 0.28, 0x28303d, 2.3, F1_Y + 1.55, 8.85, 0.35, 0.2);

    // Đèn chùm / đèn trần Sảnh Chính Tầng 1
    [-7.5, -2.5, 0.55, 4.2].forEach((lx) => {
      const f1Light = new THREE.PointLight(0xffebb8, 0.52 * PI, 11, 0);
      f1Light.position.set(lx, F1_Y + 2.75, 6.75);
      scene.add(f1Light);
      const f1Bulb = mk(1.1, 0.05, 0.26, 0xfff0d0, lx, F1_Y + 2.96, 6.75, 0.2, 0.05, false);
      f1Bulb.material.emissive = new THREE.Color(0xb89b64);
    });

    // Bảng Vàng Danh Dự & Sơ Đồ Trường tại Sảnh Chính Tầng 1 (x = -1.65, z = 4.72)
    mk(2.8, 1.42, 0.06, 0x4a2c18, -1.65, F1_Y + 1.68, 4.71, 0.5);
    const honorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.66, 1.3),
      new THREE.MeshStandardMaterial({
        map: createHonorBoardTexture(),
        roughness: 0.4,
      })
    );
    honorMesh.position.set(-1.65, F1_Y + 1.68, 4.75);
    scene.add(honorMesh);

    // Biển phòng Thư Viện P.101 & Phòng Đội Bóng P.102 (Tầng 1)
    const libSign = makeSignMesh(
      'P.101 — THƯ VIỆN TRƯỜNG',
      'PHÒNG ĐỌC & MƯỢN SÁCH (MỞ CỬA)',
      0.58,
      0.24
    );
    libSign.position.set(-6.65, F1_Y + 1.68, 4.72);
    scene.add(libSign);

    const sportSign = makeSignMesh(
      'P.102 — PHÒNG ĐỘI BÓNG',
      'DỤNG CỤ THỂ CHẤT & THAY ĐỒ (MỞ CỬA)',
      0.58,
      0.24
    );
    sportSign.position.set(1.1, F1_Y + 1.68, 4.72);
    scene.add(sportSign);

    // Máy bán nước tự động phát sáng tại Sảnh Chính Tầng 1 (x = 4.6, z = 5.05)
    mk(0.92, 1.92, 0.62, 0x1d283a, 4.6, F1_Y + 0.96, 5.02, 0.35, 0.5);
    const vendGlass = mk(0.68, 1.15, 0.04, 0xd8f0ff, 4.5, F1_Y + 1.18, 5.32, 0.15, 0.1, false);
    vendGlass.material.emissive = new THREE.Color(0x5294cc);
    const vendBtn = mk(0.12, 0.45, 0.04, 0xffaa33, 4.92, F1_Y + 1.1, 5.32, 0.2, 0.2, false);
    vendBtn.material.emissive = new THREE.Color(0xcc6611);

    /* =====================================================================
     * TẦNG 1 — P.101 THƯ VIỆN TRƯỜNG THPT (x: -11.5 -> -4.05, z: -5.1 -> 4.65, y = -3.2)
     * ===================================================================== */
    mkMat(7.45, 0.1, 9.75, woodFloorMat, -7.775, F1_Y - 0.05, -0.225);
    mkMat(7.45, 0.1, 9.75, ceilingMat, -7.775, F1_Y + 3.05, -0.225);
    mkMat(7.45, 3.1, 0.1, roomWallMat, -7.775, F1_Y + 1.55, -5.15);
    mkMat(0.1, 3.1, 9.75, roomWallMat, -11.5, F1_Y + 1.55, -0.225);
    mkMat(0.1, 3.1, 9.75, roomWallMat, -4.05, F1_Y + 1.55, -0.225);

    const libLight = new THREE.PointLight(0xffe4b2, 0.68 * PI, 13, 0);
    libLight.position.set(-7.8, F1_Y + 2.75, -0.5);
    scene.add(libLight);

    // Bàn đọc sách của Phạm Thu Lan (11A1) có đèn bàn xanh lá cổ điển đang sáng (x = -6.8, z = 2.4)
    mk(1.8, 0.06, 1.1, 0x4d321e, -6.8, F1_Y + 0.76, 2.4, 0.5);
    mk(0.12, 0.75, 0.9, 0x2b1d12, -7.6, F1_Y + 0.375, 2.4, 0.6);
    mk(0.12, 0.75, 0.9, 0x2b1d12, -6.0, F1_Y + 0.375, 2.4, 0.6);
    // Đèn đọc sách thư viện (Banker's lamp)
    mk(0.04, 0.28, 0.04, 0xc8a44d, -6.8, F1_Y + 0.92, 2.4, 0.3, 0.8);
    const bankerShade = mk(0.24, 0.09, 0.16, 0x146b3a, -6.8, F1_Y + 1.06, 2.4, 0.3);
    bankerShade.material.emissive = new THREE.Color(0x1b8a48);
    // Sách giáo khoa mở trên bàn thư viện
    mk(0.32, 0.02, 0.24, 0xf5f0e1, -6.8, F1_Y + 0.8, 2.65, 0.9);

    /* =====================================================================
     * TẦNG 1 — P.102 PHÒNG ĐỘI BÓNG & THỂ CHẤT (x: -4 -> 4, z: -5.1 -> 4.65, y = -3.2)
     * ===================================================================== */
    mkMat(8, 0.1, 9.75, hallFloorMat, 0, F1_Y - 0.05, -0.225);
    mkMat(8, 0.1, 9.75, ceilingMat, 0, F1_Y + 3.05, -0.225);
    mkMat(8, 3.1, 0.1, roomWallMat, 0, F1_Y + 1.55, -5.15);
    mkMat(0.1, 3.1, 9.75, roomWallMat, 4.05, F1_Y + 1.55, -0.225);

    const sportLight = new THREE.PointLight(0xd8e8ff, 0.64 * PI, 13, 0);
    sportLight.position.set(0, F1_Y + 2.75, -0.5);
    scene.add(sportLight);

    // Bảng chiến thuật Đội bóng 11A3 trên tường Bắc P.102 (x = 0, z = -5.06)
    mk(2.2, 1.55, 0.05, 0x262d38, 0, F1_Y + 1.7, -5.08, 0.5);
    const tacticsMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.06, 1.42),
      new THREE.MeshStandardMaterial({
        map: createTacticsBoardTexture(),
        roughness: 0.35,
      })
    );
    tacticsMesh.position.set(0, F1_Y + 1.7, -5.04);
    scene.add(tacticsMesh);

    // Kệ sắt để bóng đá & bóng rổ sát tường trái P.102 (x = -3.3, z = -1.5)
    mk(0.65, 1.5, 2.6, 0x28303b, -3.3, F1_Y + 0.75, -1.5, 0.5, 0.6);
    [-2.4, -1.8, -1.2, -0.6].forEach((bz, bIdx) => {
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 18, 14),
        new THREE.MeshStandardMaterial({
          color: bIdx % 2 === 0 ? 0xf0f4f8 : 0xd4622a,
          roughness: 0.45,
        })
      );
      ball.position.set(-3.3, F1_Y + 1.64, bz);
      scene.add(ball);
    });

    // Đôi giày đá bóng dính bùn đỏ của Tuấn để cạnh ghế thay đồ P.102
    mk(0.12, 0.09, 0.28, 0x5c2314, -0.4, F1_Y + 0.045, -0.75, 0.9);
    mk(0.12, 0.09, 0.28, 0x5c2314, -0.15, F1_Y + 0.045, -0.72, 0.9);

    /* =====================================================================
     * SÂN TRƯỜNG & SÂN VẬN ĐỘNG NGOÀI TRỜI (x: -12 -> 10.5, z: 8.85 -> 25.0, y = -3.2)
     * ===================================================================== */
    // Bầu trời đêm đầy sao (520 ngôi sao lấp lánh trên bầu trời sân trường) & Trăng tròn có hào quang
    const starCount = 520;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 68;
      starPos[i * 3 + 1] = 6.5 + Math.random() * 24;
      starPos[i * 3 + 2] = -6 + Math.random() * 38;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xeaf4ff,
        size: 0.09,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      })
    );
    starPoints.raycast = () => { };
    starPoints.userData.noRaycast = true;
    scene.add(starPoints);

    const moonMesh = new THREE.Mesh(
      new THREE.CircleGeometry(1.15, 32),
      new THREE.MeshBasicMaterial({ color: 0xf2f8ff })
    );
    moonMesh.position.set(3.2, 8.2, 24.5);
    moonMesh.rotation.y = Math.PI;
    scene.add(moonMesh);
    const moonHalo = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 32),
      new THREE.MeshBasicMaterial({
        color: 0x6ea4e8,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    );
    moonHalo.position.set(3.2, 8.2, 24.55);
    moonHalo.rotation.y = Math.PI;
    moonHalo.raycast = () => { };
    moonHalo.userData.noRaycast = true;
    scene.add(moonHalo);

    // Mái ngói đỏ sẫm & Phào chỉ đỉnh mái Tòa nhà Trường THPT 2 tầng nhìn từ Sân trường
    mk(22.6, 0.28, 15.2, 0x2c313a, -0.5, 3.22, 2.0, 0.75, 0.1, false);
    const roofSlope = mk(22.8, 0.95, 4.6, 0x5e241c, -0.5, 3.68, 7.1, 0.75, 0.05, false);
    roofSlope.rotation.x = 0.22;

    // Mái đón Đại Sảnh Tầng 1 (Canopy) + 2 Cột trụ tròn sảnh chính + Đèn hiên ấm áp
    mk(4.6, 0.24, 1.95, 0x2f3540, 0.55, -0.05, 9.75, 0.6);
    mk(4.8, 0.08, 2.05, 0xc8b282, 0.55, 0.09, 9.75, 0.4, 0.3);
    [-1.4, 2.5].forEach((cx) => {
      const porchCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.18, 3.1, 20),
        new THREE.MeshStandardMaterial({ color: 0xd8d2c5, roughness: 0.55 })
      );
      porchCol.position.set(cx, F1_Y + 1.55, 10.45);
      porchCol.castShadow = true;
      porchCol.receiveShadow = true;
      scene.add(porchCol);
    });
    const porchLight = new THREE.PointLight(0xffd896, 0.65 * PI, 9, 0);
    porchLight.position.set(0.55, -0.22, 9.8);
    scene.add(porchLight);

    // Biển tên trường lớn gắn trên mái hiên Đại Sảnh nhìn từ sân trường
    const schoolMainBanner = makeSignMesh(
      'TRƯỜNG TRUNG HỌC PHỔ THÔNG',
      'KHU HIỆU BỘ · THƯ VIỆN · NHÀ HỌC 2 TẦNG',
      4.4,
      0.68,
      '#13294b',
      '#ffd966'
    );
    schoolMainBanner.position.set(0.55, 0.52, 10.74);
    (schoolMainBanner.material as THREE.MeshStandardMaterial).emissive =
      new THREE.Color(0x0c1b33);
    scene.add(schoolMainBanner);

    // Sân gạch trước sảnh trường (z: 8.85 -> 13.5, y = -3.2)
    mk(23, 0.1, 4.7, 0x2b3038, -0.75, F1_Y - 0.05, 11.2, 0.85, 0.05, false);

    // 2 Cột đèn sân trường cổ điển tỏa ánh sáng vàng ấm dọc lối đi
    [-5.8, 7.2].forEach((lx) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 3.4, 14),
        new THREE.MeshStandardMaterial({
          color: 0x1c2229,
          metalness: 0.75,
          roughness: 0.35,
        })
      );
      pole.position.set(lx, F1_Y + 1.7, 12.2);
      scene.add(pole);
      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 12),
        new THREE.MeshStandardMaterial({
          color: 0xfff0cc,
          emissive: new THREE.Color(0xffbe66),
          roughness: 0.2,
        })
      );
      globe.position.set(lx, F1_Y + 3.45, 12.2);
      scene.add(globe);
      const yardLamp = new THREE.PointLight(0xffcb80, 0.45 * PI, 9.5, 0);
      yardLamp.position.set(lx, F1_Y + 3.25, 12.2);
      scene.add(yardLamp);
    });

    // Kỳ đài & Cột cờ Tổ quốc ngoài sân trường (x = 5.2, z = 11.6, y = -3.2)
    mk(1.6, 0.24, 1.6, 0x3a404a, 5.2, F1_Y + 0.12, 11.6, 0.6);
    mk(1.1, 0.24, 1.1, 0x48505c, 5.2, F1_Y + 0.36, 11.6, 0.6);
    const flagpole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.07, 7.5, 16),
      new THREE.MeshStandardMaterial({
        color: 0xd0d8e0,
        metalness: 0.85,
        roughness: 0.2,
      })
    );
    flagpole.position.set(5.2, F1_Y + 4.1, 11.6);
    scene.add(flagpole);
    // Lá cờ đỏ sao vàng trên đỉnh cột cờ
    const flagMesh = mk(1.35, 0.88, 0.02, 0xc81d25, 5.88, F1_Y + 7.3, 11.6, 0.6, 0, false);
    flagMesh.material.emissive = new THREE.Color(0x4a0808);

    // Dải đường chạy đất đỏ ẩm ướt (z: 13.5 -> 15.1, y = -3.2) — nguồn gốc mẫu bùn đỏ!
    mk(23, 0.08, 1.6, 0x542317, -0.75, F1_Y - 0.03, 14.3, 0.95, 0, false);

    // Mặt sân bóng đá cỏ & vạch vôi trắng (x: -9.5 -> 7.5, z: 15.1 -> 24.5, y = -3.2)
    mk(23, 0.1, 9.8, 0x192e20, -0.75, F1_Y - 0.05, 19.8, 0.92, 0, false);
    // Đường biên vôi trắng sân bóng
    mk(16.4, 0.02, 0.12, 0xe8edf5, -1.0, F1_Y + 0.01, 15.6, 0.7, 0, false);
    mk(16.4, 0.02, 0.12, 0xe8edf5, -1.0, F1_Y + 0.01, 23.6, 0.7, 0, false);
    mk(0.12, 0.02, 8.0, 0xe8edf5, -9.2, F1_Y + 0.01, 19.6, 0.7, 0, false);
    mk(0.12, 0.02, 8.0, 0xe8edf5, 7.2, F1_Y + 0.01, 19.6, 0.7, 0, false);
    mk(0.1, 0.02, 8.0, 0xe8edf5, -1.0, F1_Y + 0.01, 19.6, 0.7, 0, false); // vạch giữa sân
    // Vòng tròn giữa sân & chấm giao bóng
    const centerCircle = new THREE.Mesh(
      new THREE.RingGeometry(1.45, 1.55, 36),
      new THREE.MeshStandardMaterial({ color: 0xe8edf5, roughness: 0.7 })
    );
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.set(-1.0, F1_Y + 0.015, 19.6);
    scene.add(centerCircle);

    // Quả bóng đá để lại trên mặt cỏ sân vận động
    const fieldBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 18, 14),
      new THREE.MeshStandardMaterial({ color: 0xf2f5fa, roughness: 0.4 })
    );
    fieldBall.position.set(-1.8, F1_Y + 0.12, 18.9);
    fieldBall.castShadow = true;
    scene.add(fieldBall);

    // 4 Cột cờ góc sân bóng đá
    [
      [-9.2, 15.6],
      [7.2, 15.6],
      [-9.2, 23.6],
      [7.2, 23.6],
    ].forEach(([cx, cz]) => {
      mk(0.03, 1.1, 0.03, 0xf5f5f5, cx, F1_Y + 0.55, cz, 0.4);
      mk(0.24, 0.16, 0.015, 0xff3b30, cx + 0.12, F1_Y + 1.0, cz, 0.6);
    });

    // Khán đài bê tông 3 bậc bên cánh trái sân bóng (x = -10.6, z = 19.6)
    for (let b = 0; b < 3; b++) {
      mk(
        0.48,
        0.34 * (b + 1),
        6.8,
        0x48505c,
        -10.2 - b * 0.48,
        F1_Y + 0.17 * (b + 1),
        19.6,
        0.8
      );
    }

    // 2 Khung thành bóng đá sơn trắng + Lưới khung thành ở 2 đầu sân (x = -9.0 và x = 7.0, z = 19.6, y = -3.2)
    [-9.0, 7.0].forEach((gx, gIdx) => {
      const dir = gIdx === 0 ? -1 : 1;
      mk(0.1, 2.1, 0.1, 0xf0f4fa, gx, F1_Y + 1.05, 18.2, 0.3, 0.4);
      mk(0.1, 2.1, 0.1, 0xf0f4fa, gx, F1_Y + 1.05, 21.0, 0.3, 0.4);
      mk(0.1, 0.1, 2.9, 0xf0f4fa, gx, F1_Y + 2.1, 19.6, 0.3, 0.4);
      // Lưới sau khung thành
      const netBack = new THREE.Mesh(
        new THREE.PlaneGeometry(2.8, 2.05),
        new THREE.MeshStandardMaterial({
          color: 0xdce6f2,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          wireframe: true,
        })
      );
      netBack.rotation.y = Math.PI / 2;
      netBack.position.set(gx + dir * 0.65, F1_Y + 1.02, 19.6);
      netBack.raycast = () => { };
      netBack.userData.noRaycast = true;
      scene.add(netBack);
    });

    // Cột đèn pha cao áp + Luồng sáng Volumetric chiếu xuống Sân trường & Sân bóng đá
    [-8.5, 0.5, 7.5].forEach((tx) => {
      mk(0.16, 7.5, 0.16, 0x262c36, tx, F1_Y + 3.75, 24.2, 0.5, 0.7, false);
      const floodLamp = mk(0.85, 0.32, 0.24, 0xdbeaff, tx, F1_Y + 7.4, 23.9, 0.2, 0.5, false);
      floodLamp.material.emissive = new THREE.Color(0x9ec4ff);

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(3.2, 7.2, 20, 1, true),
        new THREE.MeshBasicMaterial({
          color: 0x9ec4ff,
          transparent: true,
          opacity: 0.055,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      cone.position.set(tx, F1_Y + 3.9, 22.4);
      cone.rotation.x = -0.35;
      cone.raycast = () => { };
      cone.userData.noRaycast = true;
      scene.add(cone);
    });
    const stadiumLight = new THREE.PointLight(0x8cb4f0, 0.85 * PI, 28, 0);
    stadiumLight.position.set(0, F1_Y + 6.5, 17.5);
    scene.add(stadiumLight);

    // Hàng cây cổ thụ quanh sân vận động
    [-10.5, -5.5, 3.5, 8.8].forEach((treeX, idx) => {
      mk(0.32, 3.2, 0.32, 0x231914, treeX, F1_Y + 1.6, 24.4, 0.9);
      const crown = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.35 + (idx % 2) * 0.25, 1),
        new THREE.MeshStandardMaterial({ color: 0x13261b, roughness: 0.9 })
      );
      crown.position.set(treeX, F1_Y + 3.6 + (idx % 2) * 0.2, 24.4);
      scene.add(crown);
    });

    // Tường rào bao quanh khuôn viên sân trường
    mk(24, 2.2, 0.2, 0x2c323b, -0.75, F1_Y + 1.1, 24.8, 0.85, 0, false);
    mk(0.2, 2.2, 16.2, 0x2c323b, -11.8, F1_Y + 1.1, 16.8, 0.85, 0, false);
    mk(0.2, 2.2, 16.2, 0x2c323b, 10.5, F1_Y + 1.1, 16.8, 0.85, 0, false);

    // Chuỗi vết giày đinh dính bùn đỏ xuyên suốt từ Sân bóng -> Phòng Đội Bóng (Tầng 1) -> Cầu thang -> Phòng Bảo Mật (Tầng 2)
    [
      // Vết bùn ở Tầng 1 (từ Sân bóng vào Phòng Đội Bóng P.102 rồi lên Cầu thang)
      [0.6, F1_Y + 0.005, 11.5, 0.1],
      [1.2, F1_Y + 0.005, 8.2, 0.2],
      [2.1, F1_Y + 0.005, 5.4, 0.05],
      [4.2, F1_Y + 0.005, 7.6, -0.3],
      [5.8, F1_Y + 0.005, 7.8, -0.2],
      // Vết bùn trên Chiếu nghỉ cầu thang (y = -1.6)
      [9.2, -1.595, 7.2, 0.4],
      [9.2, -1.595, 5.8, -0.4],
      // Vết bùn ở Hành lang Tầng 2 dẫn vào cửa P.202
      [5.8, 0.005, 5.7, 0.25],
      [4.5, 0.005, 6.2, 0.32],
      [3.4, 0.005, 5.8, 0.42],
      [2.45, 0.005, 5.15, 0.2],
    ].forEach(([fx, fy, fz, rot]) => {
      const fp = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.005, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x5c2314, roughness: 1 })
      );
      fp.position.set(fx, fy, fz);
      fp.rotation.y = rot;
      scene.add(fp);
    });

    /* Camera an ninh P.202 */
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
      amb.intensity = (on ? 0.54 : 0.38) * PI;
      bulb.material.emissive.setHex(on ? 0xffe9b0 : 0x000000);
    }

    // Tính độ cao sàn thực tế (hỗ trợ đi lên/xuống cầu thang mượt mà giữa Tầng 2 y=0, Chiếu nghỉ y=-1.6 và Tầng 1/Sân trường y=-3.2)
    const getFloorY = (x: number, z: number, currentFloorY: number): number => {
      // Khu vực buồng cầu thang Đông (x > 6.45)
      if (x >= 6.45 && x <= 10.35 && z >= 4.75 && z <= 8.75) {
        if (x >= 8.6) {
          return -1.6; // Chiếu nghỉ giữa tầng
        }
        const t = Math.max(0, Math.min(1, (x - 6.5) / 2.1));
        if (z < 6.75) {
          // Nhịp cầu thang trên: nối Tầng 2 (y = 0) với Chiếu nghỉ (y = -1.6)
          return -1.6 * t;
        }
        // Nhịp cầu thang dưới: nối Chiếu nghỉ (y = -1.6) với Tầng 1 (y = -3.2)
        return -3.2 + 1.6 * t;
      }

      // Ngoài sân trường (z > 8.95) khi đang ở Tầng 1 thì luôn ở độ cao F1_Y (-3.2)
      if (currentFloorY < -1.6) {
        return F1_Y;
      }
      return 0;
    };

    const isBlocked = (
      x: number,
      z: number,
      openDoors: Record<string, boolean> = {},
      currentFloorY = 0
    ): boolean => {
      // 1. KIỂM TRA TRONG BUỒNG CẦU THANG BỘ ĐÔNG (x: 6.35 -> 10.2)
      const inUpperFlight =
        x >= 6.35 && x <= 8.75 && z >= 4.9 && z <= 6.45 && currentFloorY >= -1.85;
      const inLanding =
        x >= 8.5 && x <= 10.15 && z >= 4.9 && z <= 8.6 && Math.abs(currentFloorY - -1.6) <= 1.1;
      const inLowerFlight =
        x >= 6.35 && x <= 8.75 && z >= 7.05 && z <= 8.6 && currentFloorY <= -1.35;

      if (inUpperFlight || inLanding || inLowerFlight) {
        return false;
      }

      // 2. NẾU NGƯỜI CHƠI ĐANG Ở TẦNG 2 (currentFloorY > -1.6)
      if (currentFloorY > -1.6) {
        // P.202 — Phòng Bảo Mật
        const inP202 =
          x >= -3.7 &&
          x <= 3.7 &&
          z >= -3.85 &&
          z <= 4.35 &&
          !(x < -3.05 && z > 0.6 && z < 3.0) &&
          !(x < -2.3 && z > 2.25 && z < 3.0) &&
          !(x > 3.15 && z > -2.95 && z < -1.15);

        // Cửa P.202
        const inDoorP202 =
          Boolean(openDoors['door']) &&
          x >= 1.8 &&
          x <= 2.6 &&
          z >= 4.2 &&
          z <= 5.15;

        // P.201 — Phòng Giáo Vụ (tránh bàn họp ở giữa, bàn Thầy Hùng góc trái, và kệ sách tài liệu)
        const inP201 =
          x >= -11.1 &&
          x <= -4.4 &&
          z >= -4.25 &&
          z <= 4.35 &&
          !(x > -8.5 && x < -5.9 && z > -2.8 && z < 1.2) &&
          !(x < -9.8 && z > 0.5 && z < 3.0) &&
          !(x > -5.2 && z > -3.2 && z < -1.8);

        // Cửa P.201
        const inDoorP201 =
          Boolean(openDoors['door_p201']) &&
          x >= -6.0 &&
          x <= -5.2 &&
          z >= 4.2 &&
          z <= 5.15;

        // Lớp 11A3 (bên kia hành lang Tầng 2, tránh góc tủ sách cuối lớp)
        const inClass11A3 =
          x >= -11.1 &&
          x <= -4.45 &&
          z >= 9.15 &&
          z <= 15.25 &&
          !(x > -5.2 && z > 13.8 && z < 15.2);

        // Cửa Lớp 11A3
        const inDoor11A3 =
          Boolean(openDoors['door_11a3']) &&
          x >= -7.9 &&
          x <= -7.1 &&
          z >= 8.4 &&
          z <= 9.3;

        // Hành lang Tầng 2 (x: -11.1 -> 6.55)
        const inHallF2 =
          x >= -11.1 &&
          x <= 6.55 &&
          z >= 5.05 &&
          z <= 8.45 &&
          !(x > 6.2 && z > 6.5) && // tránh tường chắn cầu thang dưới ở Tầng 2
          !(x > -4.4 && x < -2.6 && z > 7.95) && // tránh ghế băng
          !(x > 3.1 && x < 5.5 && z < 5.45); // tránh tủ locker

        return !(
          inP202 ||
          inDoorP202 ||
          inP201 ||
          inDoorP201 ||
          inClass11A3 ||
          inDoor11A3 ||
          inHallF2
        );
      }

      // 3. NẾU NGƯỜI CHƠI ĐANG Ở TẦNG 1 & SÂN TRƯỜNG (currentFloorY <= -1.6)
      // Hành lang & Sảnh Chính Tầng 1
      const inHallF1 =
        x >= -11.1 &&
        x <= 6.55 &&
        z >= 5.05 &&
        z <= 8.45;

      // P.101 — Thư Viện Trường (Tầng 1)
      const inLibrary =
        x >= -11.1 &&
        x <= -4.4 &&
        z >= -4.4 &&
        z <= 4.35 &&
        !(x < -9.8 && z > 0.5 && z < 3.0);

      const inDoorLibrary =
        Boolean(openDoors['door_library']) &&
        x >= -6.0 &&
        x <= -5.2 &&
        z >= 4.2 &&
        z <= 5.15;

      // P.102 — Phòng Đội Bóng & Thể Chất (Tầng 1)
      const inSportsRoom =
        x >= -3.6 &&
        x <= 3.65 &&
        z >= -4.4 &&
        z <= 4.35;

      const inDoorSports =
        Boolean(openDoors['door_sports']) &&
        x >= 1.8 &&
        x <= 2.6 &&
        z >= 4.2 &&
        z <= 5.15;

      // Cổng Đại Sảnh Chính Tầng 1 thông ra Sân Trường
      const inMainGate =
        x >= -0.95 && x <= 2.05 && z >= 8.3 && z <= 9.4;

      // Toàn bộ Khuôn viên Sân Trường, Kỳ Đài & Sân Vận Động ngoài trời
      const inSchoolyard =
        x >= -11.2 &&
        x <= 9.8 &&
        z >= 9.2 &&
        z <= 24.1 &&
        !(x > 4.2 && x < 6.2 && z > 10.6 && z < 12.6); // tránh bệ cột cờ

      return !(
        inHallF1 ||
        inLibrary ||
        inDoorLibrary ||
        inSportsRoom ||
        inDoorSports ||
        inMainGate ||
        inSchoolyard
      );
    };

    return {
      setLamp,
      getLampOn: () => lampOn,
      getFloorY,
      isBlocked,
    };
  },
};
