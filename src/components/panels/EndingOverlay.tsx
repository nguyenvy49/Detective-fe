'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const EndingOverlay: React.FC = () => {
  const phase = useDetectiveStore((s) => s.phase);
  const endingOutcome = useDetectiveStore((s) => s.endingOutcome);
  const continueAfterBadEnding = useDetectiveStore(
    (s) => s.continueAfterBadEnding
  );

  const visible = phase === 'end' && endingOutcome !== null;

  return (
    <div className={`ov ${visible ? 'on' : ''}`} id="end">
      <h1 id="e_t">{endingOutcome?.title}</h1>
      <div className="rank" id="e_r">
        {endingOutcome?.rank}
      </div>
      <p id="e_p">{endingOutcome?.text}</p>
      <button
        id="e_b"
        onClick={() => {
          if (endingOutcome?.isTrueEnding) {
            window.location.reload();
          } else {
            continueAfterBadEnding();
          }
        }}
      >
        {endingOutcome?.isTrueEnding ? 'Chơi lại' : 'Tiếp tục điều tra'}
      </button>
    </div>
  );
};

