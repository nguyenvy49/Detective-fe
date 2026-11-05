import * as THREE from 'three';

export type GamePhase = 'start' | 'play' | 'inspect' | 'cctv' | 'panel' | 'end';
export type ActivePanelType = 'bag' | 'dossier' | null;

export interface ClipSegmentRuntime {
  act: THREE.AnimationAction;
  minTime: number;
  maxTime: number;
}

export interface AnimatedPartRuntime {
  node: THREE.Object3D;
  highlightNode?: THREE.Object3D;
  clips: ClipSegmentRuntime[];
  start: number;
  end: number;
  mid: number;
  t: number;
  state: 'closed' | 'opening' | 'open' | 'closing';
  label: string;
  isLightSwitch?: boolean;
}

export interface SeatInteractableRuntime {
  node: THREE.Object3D;
  seatPos: [number, number, number];
  seatYaw: number;
  seatPitch: number;
}

export type InteractableAction =
  | { type: 'part'; p: AnimatedPartRuntime }
  | { type: 'switch' }
  | { type: 'cctv' }
  | { type: 'pick'; id: string }
  | { type: 'sit'; seat: SeatInteractableRuntime };

export interface MapItemDefinition {
  id: string;
  name: string;
  desc: string;
  build: () => THREE.Group;
  initialPlacement?: {
    target: 'scene' | { modelId: string; partName: string };
    position: [number, number, number];
    rotation?: [number, number, number];
    hitRadius?: number;
  };
}

export interface AnimatedGlbPartConfig {
  nodeName: string;
  highlightNodeName?: string;
  clipName?: string;
  clipNames?: string[];
  midTime?: number;
  isLightSwitch?: boolean;
  hitRadius?: number;
}

export interface AnimatedGlbSeatConfig {
  nodeName: string;
  seatPos: [number, number, number];
  seatYaw: number;
  seatPitch?: number;
}

export interface AnimatedGlbModelConfig {
  id: string;
  url: string;
  rootObjectName?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: number;
  speed: number;
  autoSpinY?: number;
  parts: AnimatedGlbPartConfig[];
  seatNodes?: AnimatedGlbSeatConfig[];
}

export interface SuspectDefinition {
  id: string;
  name: string;
  role: string;
  statement: string;
}

export interface CctvConfig {
  cameraLabel: string;
  datePrefix: string;
  baseSeconds: number;
  unlockAfterSeconds: number;
  clueNote: string;
  renderFeed?: (
    ctx: CanvasRenderingContext2D,
    ct: number,
    width: number,
    height: number,
    cctvSeen: boolean,
    onUnlockClue: () => void
  ) => void;
}

export interface MapSolutionConfig {
  culpritId: string;
  minEvidenceCount: number;
  totalKeyEvidence: number;
  trueEndingText: string;
  insufficientEvidenceText: string;
  wrongSuspectText: (suspectName: string) => string;
}

export interface RoomEnvironmentResult {
  setLamp: (on: boolean) => void;
  getLampOn: () => boolean;
  toggleSwitchLever?: (on: boolean) => void;
  isBlocked: (x: number, z: number, isDoorOpen?: boolean) => boolean;
}

export interface CrimeSceneMapConfig {
  id: string;
  title: string;
  briefing: string;
  loadingText?: string;
  enterButtonText?: string;
  errorModelText?: string;
  spawn: {
    position: [number, number, number];
    yaw?: number;
    pitch?: number;
  };
  backgroundHex: number;
  fogNear: number;
  fogFar: number;
  items: Record<string, MapItemDefinition>;
  animatedModels: AnimatedGlbModelConfig[];
  cctv: CctvConfig;
  timeline: string[];
  suspects: SuspectDefinition[];
  solution: MapSolutionConfig;
  buildEnvironment: (
    scene: THREE.Scene,
    cam: THREE.PerspectiveCamera
  ) => RoomEnvironmentResult;
}

export interface EndingOutcome {
  isTrueEnding: boolean;
  title: 'TRUE ENDING' | 'BAD ENDING';
  rank: string;
  text: string;
}
