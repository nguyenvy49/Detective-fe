'use client';

import React from 'react';
import { FirstPersonSceneCanvas } from '@/components/3d/FirstPersonSceneCanvas';
import { CrosshairAndPrompt } from '@/components/hud/CrosshairAndPrompt';
import { StatusHud } from '@/components/hud/StatusHud';
import { InspectOverlay } from '@/components/hud/InspectOverlay';
import { StartOverlay } from '@/components/panels/StartOverlay';
import { BagPanel } from '@/components/panels/BagPanel';
import { DossierPanel } from '@/components/panels/DossierPanel';
import { CctvOverlay } from '@/components/panels/CctvOverlay';
import { EndingOverlay } from '@/components/panels/EndingOverlay';

export const DetectiveGameExperience: React.FC = () => {
  return (
    <div className="dtv-root">
      <FirstPersonSceneCanvas />
      <CrosshairAndPrompt />
      <StatusHud />
      <InspectOverlay />
      <StartOverlay />
      <BagPanel />
      <DossierPanel />
      <CctvOverlay />
      <EndingOverlay />
    </div>
  );
};
