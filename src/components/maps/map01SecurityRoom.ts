import * as THREE from 'three';
import { CrimeSceneMapConfig } from '@/types/mapSchema';
import {
  buildMudSample,
  buildTwoSidedDocument,
  buildUniformButton,
} from '@/lib/three/evidenceBuilders';

const PI = Math.PI;

export const map01SecurityRoom: CrimeSceneMapConfig = {
  id: 'map_01_security_room',
  title: 'HIỆN TRƯỜNG 01 — PHÒNG BẢO MẬT',
  briefing:
    'Đêm 14/10, trường THPT. Tủ hồ sơ kỷ luật bị cạy. Bạn là điều tra viên được điều động đến hiện trường: tự tay mở ngăn kéo, bật đèn, nhặt vật chứng, xem lại camera, rồi đưa ra cáo buộc.',
  loadingText: 'Đang tải mô hình tủ…',
  enterButtonText: 'Bước vào hiện trường',
  errorModelText: 'Không tải được mô hình tủ',
  spawn: {
    position: [0.8, 1.65, 3.2],
    yaw: 0,
    pitch: 0,
  },
  backgroundHex: 0x040507,
  fogNear: 6,
  fogFar: 17,

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
        hitRadius: 0.13,
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
        hitRadius: 0.13,
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
        hitRadius: 0.14,
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
    const amb = new THREE.AmbientLight(0x7080a8, 0.42 * PI);
    scene.add(amb);

    const lamp = new THREE.PointLight(0xffe6b8, 0, 18, 0);
    lamp.position.set(0, 2.7, 0);
    scene.add(lamp);

    let lampOn = false;

    const mk = (
      w: number,
      h: number,
      d: number,
      col: number,
      x: number,
      y: number,
      z: number,
      r = 0.9
    ) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color: col, roughness: r })
      );
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    };

    mk(8, 0.1, 9.7, 0x3a3d42, 0, -0.05, -0.25);
    mk(8, 0.1, 9.7, 0x2a2c30, 0, 3.05, -0.25);
    mk(8, 3, 0.1, 0x4a4e55, 0, 1.5, -5.15);
    // Tường phía cửa (chừa ô cửa x: 1.7 -> 2.7, y: 0 -> 2.2 cho cua1.glb)
    mk(5.7, 3, 0.1, 0x4a4e55, -1.15, 1.5, 4.65);
    mk(1.3, 3, 0.1, 0x4a4e55, 3.35, 1.5, 4.65);
    mk(1.0, 0.8, 0.1, 0x4a4e55, 2.2, 2.6, 4.65);
    mk(2.2, 0.1, 1.8, 0x1e2024, 2.2, -0.05, 5.5); // sàn hành lang ngoài cửa
    mk(0.1, 3, 9.7, 0x484c53, -4.05, 1.5, -0.25);
    mk(0.1, 3, 9.7, 0x484c53, 4.05, 1.5, -0.25);
    mk(3.2, 0.02, 2.2, 0x5a2a30, -1.4, 0.011, 0.2); // thảm

    const bulb = mk(0.5, 0.06, 0.5, 0x999999, 0, 2.97, 0);
    bulb.material.emissive = new THREE.Color(0);

    /* công tắc đèn */
    const sw = new THREE.Group();
    sw.position.set(4.0, 1.3, 2.2);
    sw.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.14, 0.09),
        new THREE.MeshStandardMaterial({ color: 0xddd8c8 })
      )
    );
    const lev = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.04, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x999999 })
    );
    lev.position.set(-0.02, 0, 0);
    sw.add(lev);
    sw.userData.act = { type: 'switch' };
    scene.add(sw);

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
    cc.userData.act = { type: 'cctv' };
    scene.add(cc);

    function setLamp(on: boolean) {
      lampOn = on;
      lamp.intensity = on ? 1.15 * PI : 0;
      amb.intensity = (on ? 0.6 : 0.42) * PI;
      bulb.material.emissive.setHex(on ? 0xffe9b0 : 0x000000);
      lev.rotation.z = on ? 0.5 : -0.5;
    }

    const bounds = { x0: -3.7, x1: 3.7, z0: -3.3, z1: 4.2 };
    const isBlocked = (x: number, z: number) =>
      x < bounds.x0 ||
      x > bounds.x1 ||
      z < bounds.z0 ||
      z > bounds.z1 ||
      (x < -3.05 && z > 0.6 && z < 3.0) ||
      (x < -2.3 && z > 2.25 && z < 3.0);

    return {
      setLamp,
      getLampOn: () => lampOn,
      isBlocked,
    };
  },
};

