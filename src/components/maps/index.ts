import { CrimeSceneMapConfig } from '@/types/mapSchema';
import { map01SecurityRoom } from './map01SecurityRoom';

export const CRIME_SCENE_MAPS: Record<string, CrimeSceneMapConfig> = {
  [map01SecurityRoom.id]: map01SecurityRoom,
};

export const DEFAULT_MAP_ID = map01SecurityRoom.id;

export { map01SecurityRoom };

