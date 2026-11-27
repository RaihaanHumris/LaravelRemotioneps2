import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { loadFont as loadPlusJakartaSans } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';

export const { fontFamily: DISPLAY_FONT } = loadPlusJakartaSans('normal', {
  weights: ['600', '800'],
  subsets: ['latin'],
});

export const { fontFamily: MONO_FONT } = loadJetBrainsMono('normal', {
  weights: ['700'],
  subsets: ['latin'],
});

export const PALETTE = {
  canvas: '#FFFFFF',
  grid: '#E5E7EB',
  laravelRed: '#FF2D20',
  deepInk: '#0F172A',
  slateMuted: '#475569',
  emerald: '#10B981',
  cobalt: '#2563EB',
  amber: '#F59E0B',
  softSurface: '#F8FAFC',
} as const;

export const VO_AUDIO_FILE =
  'assets/aistudio/ElevenLabs_2026-11-27T02_02_49_Professor_Concepcion_-_Deep_and_Full_pvc_s65_sim75_v4_4596ae3f.mp3';

export const SCENE_DURATIONS = {
  scene1: 444, // 00:00.0 - 00:14.8 (Hook: Klik Manual -> Migration Wave)
  scene2: 390, // 00:14.8 - 00:27.8 (Analogi Blueprint & Kode PHP)
  scene3: 480, // 00:27.8 - 00:43.8 (Simulasi php artisan migrate -> Cylinder)
  scene4: 276, // 00:43.8 - 00:53.0 (Rollback -> Undo Database)
  scene5: 360, // 00:53.0 - 01:05.0 (Summary Pills & Developer Outro)
} as const;

export const TOTAL_DURATION =
  SCENE_DURATIONS.scene1 +
  SCENE_DURATIONS.scene2 +
  SCENE_DURATIONS.scene3 +
  SCENE_DURATIONS.scene4 +
  SCENE_DURATIONS.scene5; // 1950 frames (65.0s @ 30fps, synced to 64.21s VO)

export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle slow architectural drift
  const driftX = (frame * 0.45) % 80;
  const driftY = (frame * 0.3) % 80;

  // Smooth Blueprint Cobalt tint during Scene 2 (frames 444 - 834)
  const s2Start = SCENE_DURATIONS.scene1;
  const s2End = s2Start + SCENE_DURATIONS.scene2;
  const blueprintTint = interpolate(
    frame,
    [s2Start - 15, s2Start + 25, s2End - 25, s2End + 15],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtle warm-amber tint during Scene 4 rollback tension (frames 1314 - 1590)
  const s4Start = s2End + SCENE_DURATIONS.scene3;
  const s4End = s4Start + SCENE_DURATIONS.scene4;
  const rollbackTint = interpolate(
    frame,
    [s4Start - 10, s4Start + 20, s4End - 20, s4End + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.canvas,
        overflow: 'hidden',
      }}
    >
      {/* Subtle cobalt wash for Scene 2 Blueprint */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 28% 48%, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.03) 48%, rgba(255, 255, 255, 0) 80%)',
          opacity: blueprintTint,
        }}
      />

      {/* Subtle amber-ink aura for Scene 4 Rollback */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.07) 0%, rgba(255, 255, 255, 0) 70%)',
          opacity: rollbackTint,
        }}
      />

      {/* Drifting Architectural Line + Dot Grid (Pure CSS for fast 1080p capture) */}
      <div
        style={{
          position: 'absolute',
          inset: -80,
          transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
          backgroundImage: `
            radial-gradient(circle, #CBD5E1 2px, transparent 2.2px),
            linear-gradient(to right, rgba(229, 231, 235, 0.85) 1.2px, transparent 1.2px),
            linear-gradient(to bottom, rgba(229, 231, 235, 0.85) 1.2px, transparent 1.2px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Cobalt Blueprint Grid Overlay (Scene 2) */}
      {blueprintTint > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: -80,
            transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
            opacity: blueprintTint,
            backgroundImage: `
              radial-gradient(circle, rgba(37, 99, 235, 0.42) 2.2px, transparent 2.4px),
              linear-gradient(to right, rgba(37, 99, 235, 0.24) 1.2px, transparent 1.2px),
              linear-gradient(to bottom, rgba(37, 99, 235, 0.24) 1.2px, transparent 1.2px)
            `,
            backgroundSize: '80px 80px',
            backgroundPosition: '0 0',
          }}
        />
      )}

      {/* Subtle corner architectural crosshairs */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {[
          { x: 64, y: 1016 },
          { x: 1856, y: 1016 },
          { x: 1856, y: 64 },
        ].map((pt, idx) => (
          <g key={idx} opacity={0.45}>
            <line
              x1={pt.x - 10}
              y1={pt.y}
              x2={pt.x + 10}
              y2={pt.y}
              stroke="#94A3B8"
              strokeWidth="2"
            />
            <line
              x1={pt.x}
              y1={pt.y - 10}
              x2={pt.x}
              y2={pt.y + 10}
              stroke="#94A3B8"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
