'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const DossierPanel: React.FC = () => {
  const currentMap = useDetectiveStore((s) => s.currentMap);
  const phase = useDetectiveStore((s) => s.phase);
  const activePanel = useDetectiveStore((s) => s.activePanel);
  const bagIds = useDetectiveStore((s) => s.bagIds);
  const cctvSeen = useDetectiveStore((s) => s.cctvSeen);
  const accuseSuspect = useDetectiveStore((s) => s.accuseSuspect);

  const visible = phase === 'panel' && activePanel === 'dossier';
  const uniqueHaveCount = new Set(bagIds).size;
  const evCount = uniqueHaveCount + (cctvSeen ? 1 : 0);

  return (
    <div className={`ov ${visible ? 'on' : ''}`} id="filep">
      <div className="panel">
        <h2>HỒ SƠ NGHI PHẠM &amp; TIMELINE LỜI KHAI</h2>
        <div className="tl">
          {currentMap.timeline.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < currentMap.timeline.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div id="suslist">
          {currentMap.suspects.map((s) => (
            <div key={s.id} className="sus">
              <div>
                <b>{s.name}</b>
                <i>{s.role}</i>
                {s.statement}
              </div>
              <button onClick={() => accuseSuspect(s)}>Buộc tội</button>
            </div>
          ))}
        </div>
        <p className="dim" id="evcount">
          Bằng chứng then chốt đã có: {evCount}/
          {currentMap.solution.totalKeyEvidence}
        </p>
        <p className="dim">
          Chỉ buộc tội khi đã đủ cơ sở. Mỗi lần kết luận sai sẽ bị trừ hạng.
          Nhấn J hoặc Esc để đóng.
        </p>
      </div>
    </div>
  );
};

