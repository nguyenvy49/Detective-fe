'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const StartOverlay: React.FC = () => {
  const currentMap = useDetectiveStore((s) => s.currentMap);
  const phase = useDetectiveStore((s) => s.phase);
  const modelReady = useDetectiveStore((s) => s.modelReady);
  const modelError = useDetectiveStore((s) => s.modelError);
  const resumeMode = useDetectiveStore((s) => s.resumeMode);
  const sceneActions = useDetectiveStore((s) => s.sceneActions);

  const visible = phase === 'start' || (resumeMode && phase === 'play');

  let btnLabel = currentMap.loadingText || 'Đang tải mô hình tủ…';
  if (modelError) {
    btnLabel = currentMap.errorModelText || 'Không tải được mô hình tủ';
  } else if (resumeMode) {
    btnLabel = 'Tiếp tục';
  } else if (modelReady) {
    btnLabel = currentMap.enterButtonText || 'Bước vào hiện trường';
  }

  return (
    <div className={`ov ${visible ? 'on' : ''}`} id="start">
      <h1>{currentMap.title}</h1>
      <p className="dim">{currentMap.briefing}</p>
      <button
        id="go"
        disabled={!modelReady || modelError}
        onClick={() => sceneActions?.enterOrResumeScene()}
      >
        {btnLabel}
      </button>
    </div>
  );
};

