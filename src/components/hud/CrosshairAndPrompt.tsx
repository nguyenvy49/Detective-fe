'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const CrosshairAndPrompt: React.FC = () => {
  const promptText = useDetectiveStore((s) => s.promptText);
  const phase = useDetectiveStore((s) => s.phase);

  return (
    <>
      <div id="cross" />
      <div
        id="prompt"
        style={{
          display: phase === 'play' && promptText ? 'block' : 'none',
        }}
      >
        {promptText}
      </div>
    </>
  );
};

