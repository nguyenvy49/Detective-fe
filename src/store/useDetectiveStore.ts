import { create } from 'zustand';
import {
  ActivePanelType,
  CrimeSceneMapConfig,
  EndingOutcome,
  GamePhase,
  SuspectDefinition,
} from '@/types/mapSchema';
import { CRIME_SCENE_MAPS, DEFAULT_MAP_ID } from '@/components/maps';

export interface InspectOverlayMeta {
  id: string;
  name: string;
  desc: string;
  mode: 'take' | 'bag';
  hasPages: boolean;
}

interface DetectiveStoreState {
  currentMap: CrimeSceneMapConfig;
  phase: GamePhase;
  activePanel: ActivePanelType;
  modelReady: boolean;
  modelError: boolean;
  resumeMode: boolean;
  fadeVisible: boolean;
  bagIds: string[];
  cctvSeen: boolean;
  wrongCount: number;
  promptText: string | null;
  inspectMeta: InspectOverlayMeta | null;
  endingOutcome: EndingOutcome | null;

  // Scene bridge callbacks (registered by FirstPersonSceneCanvas)
  sceneActions: {
    enterOrResumeScene: () => void;
    inspectBagItem: (itemId: string) => void;
  } | null;

  // Actions
  setMap: (mapId: string) => void;
  setPhase: (phase: GamePhase) => void;
  setActivePanel: (panel: ActivePanelType) => void;
  setModelStatus: (ready: boolean, error?: boolean) => void;
  setResumeMode: (resume: boolean) => void;
  setFadeVisible: (visible: boolean) => void;
  addBagItem: (id: string) => void;
  markCctvSeen: () => void;
  setPromptText: (text: string | null) => void;
  setInspectMeta: (meta: InspectOverlayMeta | null) => void;
  registerSceneActions: (
    actions: DetectiveStoreState['sceneActions']
  ) => void;
  openPanel: (panel: Exclude<ActivePanelType, null>) => void;
  closePanels: () => void;
  openCctv: () => void;
  closeCctv: () => void;
  accuseSuspect: (suspect: SuspectDefinition) => void;
  continueAfterBadEnding: () => void;
}

export const useDetectiveStore = create<DetectiveStoreState>((set, get) => ({
  currentMap: CRIME_SCENE_MAPS[DEFAULT_MAP_ID],
  phase: 'start',
  activePanel: null,
  modelReady: false,
  modelError: false,
  resumeMode: false,
  fadeVisible: true,
  bagIds: [],
  cctvSeen: false,
  wrongCount: 0,
  promptText: null,
  inspectMeta: null,
  endingOutcome: null,
  sceneActions: null,

  setMap: (mapId) => {
    const map = CRIME_SCENE_MAPS[mapId] || CRIME_SCENE_MAPS[DEFAULT_MAP_ID];
    set({
      currentMap: map,
      phase: 'start',
      activePanel: null,
      modelReady: false,
      modelError: false,
      resumeMode: false,
      fadeVisible: true,
      bagIds: [],
      cctvSeen: false,
      wrongCount: 0,
      promptText: null,
      inspectMeta: null,
      endingOutcome: null,
    });
  },

  setPhase: (phase) => set({ phase }),
  setActivePanel: (activePanel) => set({ activePanel }),
  setModelStatus: (modelReady, modelError = false) =>
    set({ modelReady, modelError }),
  setResumeMode: (resumeMode) => set({ resumeMode }),
  setFadeVisible: (fadeVisible) => set({ fadeVisible }),

  addBagItem: (id) =>
    set((s) => ({
      bagIds: [...s.bagIds, id],
    })),

  markCctvSeen: () => {
    if (!get().cctvSeen) {
      set({ cctvSeen: true });
    }
  },

  setPromptText: (promptText) => {
    if (get().promptText !== promptText) {
      set({ promptText });
    }
  },

  setInspectMeta: (inspectMeta) => set({ inspectMeta }),
  registerSceneActions: (sceneActions) => set({ sceneActions }),

  openPanel: (panel) => {
    if (document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }
    set({ phase: 'panel', activePanel: panel });
  },

  closePanels: () => {
    const { phase } = get();
    set({
      activePanel: null,
      phase: phase === 'panel' ? 'play' : phase,
    });
  },

  openCctv: () => {
    if (document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }
    set({ phase: 'cctv', promptText: null });
  },

  closeCctv: () => {
    set({ phase: 'play' });
  },

  accuseSuspect: (suspect) => {
    const { currentMap, bagIds, cctvSeen, wrongCount } = get();
    const uniqueHaveCount = new Set(bagIds).size;
    const evCount = uniqueHaveCount + (cctvSeen ? 1 : 0);
    const sol = currentMap.solution;

    if (document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }

    if (suspect.id === sol.culpritId && evCount >= sol.minEvidenceCount) {
      const rank = ['S', 'A', 'B'][wrongCount] || 'C';
      set({
        activePanel: null,
        phase: 'end',
        endingOutcome: {
          isTrueEnding: true,
          title: 'TRUE ENDING',
          rank: `Hạng ${rank}`,
          text: sol.trueEndingText,
        },
      });
    } else {
      const nextWrong = wrongCount + 1;
      const text =
        suspect.id === sol.culpritId
          ? sol.insufficientEvidenceText
          : sol.wrongSuspectText(suspect.name);
      set({
        activePanel: null,
        phase: 'end',
        wrongCount: nextWrong,
        endingOutcome: {
          isTrueEnding: false,
          title: 'BAD ENDING',
          rank: '',
          text,
        },
      });
    }
  },

  continueAfterBadEnding: () => {
    set({
      endingOutcome: null,
      phase: 'play',
    });
  },
}));

