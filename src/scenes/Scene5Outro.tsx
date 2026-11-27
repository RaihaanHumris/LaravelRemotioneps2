import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DISPLAY_FONT, MONO_FONT, PALETTE } from '../components/GridBackground';

interface BenefitPill {
  emoji: string;
  label: string;
  accent: string;
  bg: string;
  delay: number;
  rotate: number;
}

const PILLS: BenefitPill[] = [
  {
    emoji: '⚡',
    label: 'Otomatis',
    accent: PALETTE.emerald,
    bg: '#ECFDF5',
    delay: 40, // "rapi"
    rotate: -2.2,
  },
  {
    emoji: '📂',
    label: 'Tercatat di Git',
    accent: PALETTE.cobalt,
    bg: '#EFF6FF',
    delay: 92, // "tercatat di Git"
    rotate: 1.8,
  },
  {
    emoji: '🤝',
    label: 'Ramah Tim',
    accent: PALETTE.laravelRed,
    bg: '#FEF2F2',
    delay: 142, // "gampang dibagikan ke tim"
    rotate: -1.6,
  },
];

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // VO Sync (Scene 5 = frames 0..360 -> 00:53.0 to 01:05.0):
  // 00:53.0 - 00:59.5 (f 0-195): "Intinya, migration bikin struktur databasemu rapi, tercatat di Git, dan gampang dibagikan ke tim."
  // 00:59.5 - 01:05.0 (f 195-360): "Cek eksplorasi kode lainnya di GitHub saya. Sampai ketemu di episode berikutnya."

  const enterOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Converging abstract rings
  const convergeSpring = spring({
    frame,
    fps,
    config: { stiffness: 140, damping: 16 },
  });

  // Hero headline entrance
  const titleSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { stiffness: 175, damping: 14 },
  });

  // Developer Outro Card entrance synced to "Cek eksplorasi kode lainnya di GitHub saya"
  const outroCardSpring = spring({
    frame: Math.max(0, frame - 192),
    fps,
    config: { stiffness: 165, damping: 14 },
  });

  // Final sign-off line synced to "Sampai ketemu di episode berikutnya"
  const signOffSpring = spring({
    frame: Math.max(0, frame - 266),
    fps,
    config: { stiffness: 170, damping: 15 },
  });

  const gentleSpin = frame * 0.25;

  return (
    <AbsoluteFill style={{ opacity: enterOpacity }}>
      {/* Converging Geometric Orbits Background Accent */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <g
          transform={`translate(960, 500) scale(${convergeSpring}) rotate(${gentleSpin})`}
          opacity={0.35}
        >
          <ellipse
            cx="0"
            cy="0"
            rx="620"
            ry="230"
            fill="none"
            stroke={PALETTE.cobalt}
            strokeWidth="2"
            strokeDasharray="14 14"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="460"
            ry="320"
            fill="none"
            stroke={PALETTE.laravelRed}
            strokeWidth="1.8"
            strokeDasharray="10 12"
            transform="rotate(-24)"
          />
        </g>

        {/* Converging Geometric Floating Shapes */}
        {[
          { x: 260, y: 240, color: PALETTE.laravelRed, size: 22 },
          { x: 1650, y: 270, color: PALETTE.cobalt, size: 26 },
          { x: 290, y: 780, color: PALETTE.emerald, size: 24 },
          { x: 1610, y: 760, color: PALETTE.amber, size: 22 },
        ].map((shape, idx) => {
          const offset = interpolate(convergeSpring, [0, 1], [160, 0]);
          const bob = Math.sin((frame + idx * 24) * 0.06) * 10;
          const dx = shape.x < 960 ? -offset : offset;
          return (
            <rect
              key={idx}
              x={shape.x + dx}
              y={shape.y + bob}
              width={shape.size}
              height={shape.size}
              rx={6}
              fill={shape.color}
              opacity={0.8}
              transform={`rotate(${45 + frame * (idx % 2 === 0 ? 0.6 : -0.6)} ${
                shape.x + dx + shape.size / 2
              } ${shape.y + bob + shape.size / 2})`}
            />
          );
        })}
      </svg>

      {/* MAIN CENTERED COMPOSITION */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 44,
          paddingTop: 28,
        }}
      >
        {/* Minimalist Center Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            transform: `scale(${titleSpring}) translateY(${interpolate(
              titleSpring,
              [0, 1],
              [28, 0]
            )}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO_FONT,
              fontSize: 22,
              fontWeight: 700,
              color: PALETTE.laravelRed,
              letterSpacing: '0.12em',
            }}
          >
            RINGKASAN EPISODE 02
          </div>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: 88,
              fontWeight: 800,
              color: PALETTE.deepInk,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            Database Rapi dengan{' '}
            <span style={{ color: PALETTE.laravelRed }}>Migration</span>
          </div>
        </div>

        {/* THREE FLOATING KINETIC PILLS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}
        >
          {PILLS.map((pill, idx) => {
            const pSpring = spring({
              frame: Math.max(0, frame - pill.delay),
              fps,
              config: { stiffness: 190, damping: 12 },
            });
            const floatY = Math.sin((frame + idx * 22) * 0.07) * 7;

            return (
              <div
                key={pill.label}
                style={{
                  transform: `translateY(${
                    interpolate(pSpring, [0, 1], [48, 0]) + floatY
                  }px) scale(${pSpring}) rotate(${pill.rotate}deg)`,
                  opacity: interpolate(pSpring, [0, 0.25], [0, 1], {
                    extrapolateRight: 'clamp',
                  }),
                  backgroundColor: pill.bg,
                  border: `3.5px solid ${pill.accent}`,
                  borderRadius: 999,
                  padding: '22px 44px',
                  fontFamily: DISPLAY_FONT,
                  fontSize: 38,
                  fontWeight: 800,
                  color: PALETTE.deepInk,
                  boxShadow: `0 18px 40px ${pill.accent}24`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 36 }}>{pill.emoji}</span>
                <span>{pill.label}</span>
              </div>
            );
          })}
        </div>

        {/* CLEAN DEVELOPER OUTRO CARD */}
        <div
          style={{
            marginTop: 18,
            transform: `translateY(${interpolate(
              outroCardSpring,
              [0, 1],
              [70, 0]
            )}px) scale(${interpolate(outroCardSpring, [0, 1], [0.92, 1])})`,
            opacity: outroCardSpring,
            backgroundColor: '#FFFFFF',
            border: '3px solid #E2E8F0',
            borderRadius: 34,
            padding: '32px 54px',
            boxShadow: '0 28px 64px rgba(15, 23, 42, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 36,
          }}
        >
          {/* Geometric Monogram Mark */}
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              backgroundColor: PALETTE.laravelRed,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: DISPLAY_FONT,
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              boxShadow: '0 14px 30px rgba(255, 45, 32, 0.28)',
            }}
          >
            MRH
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 40,
                fontWeight: 800,
                color: PALETTE.deepInk,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Muhammad Raihaan Humris
            </div>

            {/* GitHub Badge with crisp vector GitHub Octocat mark */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                backgroundColor: PALETTE.deepInk,
                color: '#FFFFFF',
                borderRadius: 999,
                padding: '10px 26px',
                fontFamily: MONO_FONT,
                fontSize: 24,
                fontWeight: 700,
                alignSelf: 'flex-start',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>github.com/RaihaanHumris</span>
            </div>
          </div>
        </div>

        {/* Sign-off line synced to "Sampai ketemu di episode berikutnya" */}
        <div
          style={{
            opacity: signOffSpring,
            transform: `translateY(${interpolate(signOffSpring, [0, 1], [16, 0])}px)`,
            fontFamily: DISPLAY_FONT,
            fontSize: 28,
            fontWeight: 600,
            color: PALETTE.slateMuted,
          }}
        >
          Sampai ketemu di episode berikutnya →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
