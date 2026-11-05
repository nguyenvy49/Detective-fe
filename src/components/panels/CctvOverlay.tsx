'use client';

import React, { useEffect, useRef } from 'react';
import { useDetectiveStore } from '@/store/useDetectiveStore';

export const CctvOverlay: React.FC = () => {
  const currentMap = useDetectiveStore((s) => s.currentMap);
  const phase = useDetectiveStore((s) => s.phase);
  const cctvSeen = useDetectiveStore((s) => s.cctvSeen);
  const markCctvSeen = useDetectiveStore((s) => s.markCctvSeen);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seenRef = useRef(cctvSeen);

  useEffect(() => {
    seenRef.current = cctvSeen;
  }, [cctvSeen]);

  const visible = phase === 'cctv';

  useEffect(() => {
    if (!visible) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let ct = 0;
    let last = performance.now();
    let rafId = 0;
    const W = 320;
    const H = 180;
    const cfg = currentMap.cctv;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ct += dt;

      if (cfg.renderFeed) {
        cfg.renderFeed(cx, ct, W, H, seenRef.current, markCctvSeen);
      } else {
        if (ct < 1.2 || ct % 7 < 0.12) {
          const id = cx.createImageData(W, H);
          for (let i = 0; i < id.data.length; i += 4) {
            const v = Math.random() * 255;
            id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
            id.data[i + 3] = 255;
          }
          cx.putImageData(id, 0, 0);
        } else {
          cx.fillStyle = '#14201a';
          cx.fillRect(0, 0, W, H);
          cx.fillStyle = '#1c2d24';
          cx.fillRect(0, 120, W, 60);
          cx.fillStyle = '#0c1410';
          cx.fillRect(230, 40, 50, 80);

          const L = (ct - 1.2) % 9;
          const fx = -30 + L * 50;
          if (fx > -40 && fx < 350) {
            const b = Math.sin(ct * 9) * 2;
            cx.fillStyle = '#050a07';
            cx.beginPath();
            cx.arc(fx, 66 + b, 9, 0, 7);
            cx.fill();
            cx.fillRect(fx - 9, 75 + b, 18, 40);
            cx.fillRect(fx - 8, 115 + b, 6, 34);
            cx.fillRect(fx + 2, 115 + b, 6, 34);
            cx.fillStyle = '#0a1510';
            cx.fillRect(fx + 9, 84 + b, 22, 18);
            cx.fillStyle = '#a9c4b0';
            cx.fillRect(fx - 10, 98 + b, 2, 2);
          }

          for (let i = 0; i < 260; i++) {
            cx.fillStyle = 'rgba(200,255,220,' + Math.random() * 0.12 + ')';
            cx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
          }
          cx.fillStyle = 'rgba(0,0,0,.18)';
          for (let y = 0; y < H; y += 3) cx.fillRect(0, y, W, 1);

          if (ct > cfg.unlockAfterSeconds && !seenRef.current) {
            seenRef.current = true;
            markCctvSeen();
          }
        }

        cx.font = '10px monospace';
        cx.fillStyle = '#d8ffe0';
        cx.fillText(cfg.cameraLabel, 8, 14);
        cx.fillText(
          cfg.datePrefix +
            String(cfg.baseSeconds + Math.floor(ct % 40)).padStart(2, '0'),
          8,
          H - 8
        );
        if (Math.floor(ct * 2) % 2 === 0) {
          cx.fillStyle = '#e22';
          cx.beginPath();
          cx.arc(W - 14, 12, 4, 0, 7);
          cx.fill();
        }
        if (seenRef.current) {
          cx.fillStyle = '#fff';
          cx.fillText(cfg.clueNote, 8, H - 22);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible, currentMap, markCctvSeen]);

  return (
    <div className={`ov ${visible ? 'on' : ''}`} id="cctv">
      <canvas ref={canvasRef} id="cctvc" width={320} height={180} />
      <p className="dim">Esc / E để thoát khỏi camera</p>
    </div>
  );
};

