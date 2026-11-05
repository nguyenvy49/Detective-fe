'use client';

import React from 'react';
import { DetectiveGameExperience } from '@/components/game/DetectiveGameExperience';

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950">
      <DetectiveGameExperience />
    </main>
  );
}