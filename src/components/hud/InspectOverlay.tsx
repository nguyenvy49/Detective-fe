'use client';

import React from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const InspectOverlay: React.FC = () => {
  const phase = useDetectiveStore((s) => s.phase);
  const inspectMeta = useDetectiveStore((s) => s.inspectMeta);

  const visible = phase === 'inspect' && inspectMeta !== null;
  const keysHelp = inspectMeta
    ? (inspectMeta.mode === 'take'
        ? 'E: bỏ vào túi · Q: đặt lại chỗ cũ'
        : 'E / Q / Esc: đóng') +
      ' · Chuột: xoay' +
      (inspectMeta.hasPages ? ' · A / D: lật trang' : '')
    : '';

  return (
    <div
      id="insp"
      style={{
        display: visible ? 'block' : 'none',
      }}
    >
      <b id="in_n">{inspectMeta?.name}</b>
      <p id="in_d">{inspectMeta?.desc}</p>
      <span className="dim" id="in_k">
        {keysHelp}
      </span>
    </div>
  );
};

