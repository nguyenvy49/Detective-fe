'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const BagPanel: React.FC = () => {
  const currentMap = useDetectiveStore((s) => s.currentMap);
  const phase = useDetectiveStore((s) => s.phase);
  const activePanel = useDetectiveStore((s) => s.activePanel);
  const bagIds = useDetectiveStore((s) => s.bagIds);
  const closePanels = useDetectiveStore((s) => s.closePanels);
  const sceneActions = useDetectiveStore((s) => s.sceneActions);

  const visible = phase === 'panel' && activePanel === 'bag';

  return (
    <div className={`ov ${visible ? 'on' : ''}`} id="bagp">
      <div className="panel">
        <h2>TÚI VẬT CHỨNG</h2>
        <div id="baglist">
          {bagIds.length === 0 ? (
            <p className="dim">Túi trống.</p>
          ) : (
            bagIds.map((itemId, idx) => {
              const itemDef = currentMap.items[itemId];
              if (!itemDef) return null;
              return (
                <button
                  key={`${itemId}-${idx}`}
                  className="row"
                  onClick={() => {
                    closePanels();
                    sceneActions?.inspectBagItem(itemId);
                  }}
                >
                  <b>{itemDef.name}</b>
                  <span>{itemDef.desc}</span>
                </button>
              );
            })
          )}
        </div>
        <p className="dim">
          Chọn một vật để cầm lên xoay 3D. Nhấn I hoặc Esc để đóng.
        </p>
      </div>
    </div>
  );
};

