'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const StatusHud: React.FC = () => {
  const currentMap = useDetectiveStore((s) => s.currentMap);
  const bagIds = useDetectiveStore((s) => s.bagIds);
  const cctvSeen = useDetectiveStore((s) => s.cctvSeen);
  const wrongCount = useDetectiveStore((s) => s.wrongCount);
  const fadeVisible = useDetectiveStore((s) => s.fadeVisible);
  const phase = useDetectiveStore((s) => s.phase);

  const totalItems = Object.keys(currentMap.items).length;

  return (
    <>
      <div id="hud">
        {phase !== 'start' && (
          <>
            Vật chứng trong túi: {bagIds.length}/{totalItems}
            <br />
            CCTV: {cctvSeen ? 'đã xem' : 'chưa xem'}
            <br />
            Kết luận sai: {wrongCount}
          </>
        )}
      </div>

      <div id="hint">
        WASD di chuyển · Chuột nhìn quanh · E tương tác · F đèn pin · I túi vật
        chứng · J hồ sơ &amp; buộc tội
      </div>

      <div
        id="fade"
        style={{
          opacity: fadeVisible ? 1 : 0,
        }}
      />
    </>
  );
};

