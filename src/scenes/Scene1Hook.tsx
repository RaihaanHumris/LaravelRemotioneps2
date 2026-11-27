import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DISPLAY_FONT, MONO_FONT, PALETTE } from '../components/GridBackground';

interface FloatingTag {
  label: string;
  x: number;
  y: number;
  rotate: number;
  appearFrame: number;
  bg: string;
  color: string;
  border: string;
}

const CHAOTIC_TAGS: FloatingTag[] = [
  {
    label: 'phpMyAdmin',
    x: 240,
    y: 230,
    rotate: -6,
    appearFrame: 12,
    bg: '#FFFFFF',
    color: PALETTE.deepInk,
    border: '#CBD5E1',
  },
  {
    label: 'tambah_kolom_manual',
    x: 1240,
    y: 200,
    rotate: 4.5,
    appearFrame: 26,
    bg: '#FEF2F2',
    color: PALETTE.laravelRed,
    border: '#FECACA',
  },
  {
    label: 'klik_1_per_1',
    x: 200,
    y: 770,
    rotate: 3.5,
    appearFrame: 42,
    bg: '#FFFBEB',
    color: '#B45309',
    border: '#FDE68A',
  },
  {
    label: 'VARCHAR(255) ?',
    x: 1360,
    y: 790,
    rotate: -4,
    appearFrame: 62,
    bg: '#F1F5F9',
    color: PALETTE.slateMuted,
    border: '#CBD5E1',
  },
  {
    label: 'export_final_v2.sql',
    x: 1180,
    y: 350,
    rotate: -3.5,
    appearFrame: 158,
    bg: PALETTE.deepInk,
    color: '#FFFFFF',
    border: PALETTE.deepInk,
  },
  {
    label: 'import_revisi_fix.sql',
    x: 260,
    y: 630,
    rotate: 4,
    appearFrame: 185,
    bg: '#EFF6FF',
    color: PALETTE.cobalt,
    border: '#BFDBFE',
  },
];

const CLICK_RIPPLES = [
  { x: 380, y: 265, start: 8, color: PALETTE.laravelRed },
  { x: 1410, y: 240, start: 22, color: PALETTE.amber },
  { x: 960, y: 510, start: 38, color: PALETTE.laravelRed },
  { x: 350, y: 800, start: 56, color: PALETTE.cobalt },
  { x: 1510, y: 810, start: 78, color: PALETTE.laravelRed },
  { x: 760, y: 310, start: 102, color: PALETTE.amber },
  { x: 1200, y: 690, start: 126, color: PALETTE.laravelRed },
  { x: 520, y: 470, start: 162, color: PALETTE.cobalt },
  { x: 1390, y: 480, start: 192, color: PALETTE.laravelRed },
  { x: 960, y: 670, start: 230, color: PALETTE.amber },
  { x: 640, y: 600, start: 265, color: PALETTE.laravelRed },
];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0 - 150): Manual clicks & KLIK MANUAL TERUS?! stamp
  // Phase 2 (150 - 322): Team export-import SQL chaos
  // Phase 3 (322 - 444): Red geometric wave sweep -> MIGRATION hero reveal

  const stampSpring = spring({
    frame: Math.max(0, frame - 52),
    fps,
    config: { stiffness: 260, damping: 14, mass: 0.9 },
  });

  // Nervous micro-vibration on stamp before wave sweeps
  const isVibrating = frame > 62 && frame < 328;
  const vibX = isVibrating ? Math.sin(frame * 2.9) * 3.5 : 0;
  const vibY = isVibrating ? Math.cos(frame * 3.7) * 2.5 : 0;

  // Phase 2 Team SQL ping-pong transfer (frames 155 - 322)
  const teamPhaseIn = spring({
    frame: Math.max(0, frame - 152),
    fps,
    config: { stiffness: 170, damping: 14 },
  });
  const sqlPingPong = Math.sin(((frame - 165) / 22) * Math.PI);
  const sqlFlyX = interpolate(sqlPingPong, [-1, 1], [540, 1380]);
  const sqlFlyY = 740 - Math.abs(Math.cos(((frame - 165) / 22) * Math.PI)) * 115;

  // Animated cursor hopping between early click points (frames 0 - 155)
  const cursorWaypoints = [
    { f: 0, x: 380, y: 265 },
    { f: 22, x: 1410, y: 240 },
    { f: 38, x: 960, y: 510 },
    { f: 56, x: 350, y: 800 },
    { f: 78, x: 1510, y: 810 },
    { f: 102, x: 760, y: 310 },
    { f: 126, x: 1200, y: 690 },
    { f: 162, x: 520, y: 470 },
  ];
  const cursorFrames = cursorWaypoints.map((w) => w.f);
  const cursorX = interpolate(
    frame,
    cursorFrames,
    cursorWaypoints.map((w) => w.x),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cursorY = interpolate(
    frame,
    cursorFrames,
    cursorWaypoints.map((w) => w.y),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cursorOpacity = interpolate(frame, [0, 8, 290, 315], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Crisp Red Geometric Wave Sweep at frame 320 ("Di Laravel, semua itu beres cukup lewat migration")
  const waveProgress = interpolate(frame, [316, 360], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const waveExit = interpolate(frame, [356, 396], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const clutterOpacity = interpolate(frame, [332, 344], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hero MIGRATION Reveal after wave clears (frame 342+)
  const migrationSpring = spring({
    frame: Math.max(0, frame - 344),
    fps,
    config: { stiffness: 190, damping: 13 },
  });
  const subPillSpring = spring({
    frame: Math.max(0, frame - 364),
    fps,
    config: { stiffness: 170, damping: 14 },
  });
  const laravelPillSpring = spring({
    frame: Math.max(0, frame - 336),
    fps,
    config: { stiffness: 200, damping: 15 },
  });

  // Smooth exit zoom right at end of Scene 1
  const sceneExitOpacity = interpolate(frame, [428, 444], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Wave SVG path calculation sweeping left-to-right
  const waveLeadingX = interpolate(waveProgress, [0, 1], [-320, 2320]);
  const waveTrailingX = interpolate(waveExit, [0, 1], [-450, 2380]);

  return (
    <AbsoluteFill style={{ opacity: sceneExitOpacity }}>
      {/* CLUTTER LAYER (Cleared by Red Wave) */}
      <AbsoluteFill style={{ opacity: clutterOpacity }}>
        {/* Expanding SVG Click Ripples */}
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0 }}
        >
          {CLICK_RIPPLES.map((ripple, idx) => {
            const age = frame - ripple.start;
            if (age < 0 || age > 42) return null;
            const r1 = interpolate(age, [0, 36], [8, 125], {
              extrapolateRight: 'clamp',
            });
            const r2 = interpolate(age, [4, 42], [6, 86], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const op1 = interpolate(age, [0, 10, 36], [0, 0.75, 0], {
              extrapolateRight: 'clamp',
            });
            const op2 = interpolate(age, [4, 14, 42], [0, 0.5, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <g key={idx}>
                <circle
                  cx={ripple.x}
                  cy={ripple.y}
                  r={r1}
                  fill="none"
                  stroke={ripple.color}
                  strokeWidth="4"
                  opacity={op1}
                />
                <circle
                  cx={ripple.x}
                  cy={ripple.y}
                  r={r2}
                  fill="none"
                  stroke={ripple.color}
                  strokeWidth="2.5"
                  strokeDasharray="8 8"
                  opacity={op2}
                />
                <circle
                  cx={ripple.x}
                  cy={ripple.y}
                  r={6}
                  fill={ripple.color}
                  opacity={op1}
                />
              </g>
            );
          })}

          {/* Team Ping-Pong Dashed Arc (frames 155 - 322) */}
          {frame >= 152 && (
            <g opacity={teamPhaseIn}>
              <path
                d="M 520 740 Q 960 560 1400 740"
                fill="none"
                stroke={PALETTE.amber}
                strokeWidth="4"
                strokeDasharray="14 12"
                strokeDashoffset={-frame * 4}
                opacity={0.7}
              />
            </g>
          )}
        </svg>

        {/* Scattered Floating Pills */}
        {CHAOTIC_TAGS.map((tag, idx) => {
          const tagSpring = spring({
            frame: Math.max(0, frame - tag.appearFrame),
            fps,
            config: { stiffness: 210, damping: 13 },
          });
          if (frame < tag.appearFrame) return null;
          const floatY = Math.sin((frame + idx * 18) * 0.08) * 8;
          return (
            <div
              key={tag.label}
              style={{
                position: 'absolute',
                left: tag.x,
                top: tag.y + floatY,
                transform: `scale(${tagSpring}) rotate(${tag.rotate}deg)`,
                backgroundColor: tag.bg,
                color: tag.color,
                border: `2.5px solid ${tag.border}`,
                borderRadius: 999,
                padding: '16px 32px',
                fontFamily: MONO_FONT,
                fontSize: 28,
                fontWeight: 700,
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
                whiteSpace: 'nowrap',
              }}
            >
              {tag.label}
            </div>
          );
        })}

        {/* Team Sync Chaos Nodes + Flying SQL Capsule (00:05 - 00:11) */}
        {frame >= 152 && (
          <>
            {[
              { label: 'DEV A', x: 430, color: PALETTE.cobalt },
              { label: 'DEV B', x: 1340, color: PALETTE.emerald },
            ].map((dev) => (
              <div
                key={dev.label}
                style={{
                  position: 'absolute',
                  left: dev.x,
                  top: 710,
                  transform: `scale(${teamPhaseIn})`,
                  backgroundColor: '#FFFFFF',
                  border: `3px solid ${dev.color}`,
                  borderRadius: 24,
                  padding: '16px 30px',
                  fontFamily: DISPLAY_FONT,
                  fontSize: 26,
                  fontWeight: 800,
                  color: PALETTE.deepInk,
                  boxShadow: '0 12px 28px rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    backgroundColor: dev.color,
                  }}
                />
                {dev.label}
              </div>
            ))}

            {/* Flying .sql badge bouncing back and forth */}
            <div
              style={{
                position: 'absolute',
                left: sqlFlyX - 105,
                top: sqlFlyY - 26,
                transform: `scale(${teamPhaseIn}) rotate(${sqlPingPong * 8}deg)`,
                backgroundColor: PALETTE.amber,
                color: PALETTE.deepInk,
                borderRadius: 999,
                padding: '12px 26px',
                fontFamily: MONO_FONT,
                fontSize: 24,
                fontWeight: 700,
                boxShadow: '0 12px 24px rgba(245, 158, 11, 0.35)',
                whiteSpace: 'nowrap',
              }}
            >
              ⇄ db_latest_v4.sql
            </div>
          </>
        )}

        {/* Center Tilted Kinetic Stamp: KLIK MANUAL TERUS?! */}
        {frame >= 50 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 375,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translate(${vibX}px, ${vibY}px) scale(${interpolate(
                stampSpring,
                [0, 1],
                [2.2, 1]
              )}) rotate(-2.8deg)`,
              opacity: interpolate(stampSpring, [0, 0.25], [0, 1], {
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div
              style={{
                backgroundColor: PALETTE.laravelRed,
                color: '#FFFFFF',
                padding: '28px 64px',
                borderRadius: 28,
                fontFamily: DISPLAY_FONT,
                fontSize: 82,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                boxShadow: '0 24px 55px rgba(255, 45, 32, 0.34)',
                border: '6px solid #FFFFFF',
              }}
            >
              KLIK MANUAL TERUS?!
            </div>

            {/* Sub reaction badge synced to "export-import bolak-balik" */}
            {frame >= 195 && (
              <div
                style={{
                  marginTop: 22,
                  transform: `scale(${spring({
                    frame: Math.max(0, frame - 195),
                    fps,
                    config: { stiffness: 220, damping: 13 },
                  })}) rotate(2.5deg)`,
                  backgroundColor: PALETTE.deepInk,
                  color: '#FFFFFF',
                  padding: '14px 36px',
                  borderRadius: 999,
                  fontFamily: DISPLAY_FONT,
                  fontSize: 32,
                  fontWeight: 800,
                  boxShadow: '0 14px 32px rgba(15, 23, 42, 0.2)',
                }}
              >
                EXPORT–IMPORT BOLAK-BALIK!
              </div>
            )}
          </div>
        )}

        {/* Kinetic Pointer Cursor */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          style={{
            position: 'absolute',
            left: cursorX - 6,
            top: cursorY - 6,
            opacity: cursorOpacity,
            filter: 'drop-shadow(0 6px 10px rgba(15,23,42,0.22))',
          }}
        >
          <path
            d="M8 6 L42 22 L27 27 L22 42 Z"
            fill={PALETTE.deepInk}
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </svg>
      </AbsoluteFill>

      {/* HERO REVEAL LAYER: MIGRATION (Frames 336 - 444) */}
      {frame >= 334 && (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {/* Floating Laravel Red Kicker Pill */}
          <div
            style={{
              transform: `scale(${laravelPillSpring}) translateY(${interpolate(
                laravelPillSpring,
                [0, 1],
                [30, 0]
              )}px)`,
              backgroundColor: '#FEF2F2',
              color: PALETTE.laravelRed,
              border: `2.5px solid ${PALETTE.laravelRed}`,
              borderRadius: 999,
              padding: '12px 32px',
              fontFamily: MONO_FONT,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            SOLUSI DI LARAVEL
          </div>

          {/* Oversized Kinetic Wordmark */}
          <div
            style={{
              transform: `scale(${migrationSpring}) rotate(${interpolate(
                migrationSpring,
                [0, 1],
                [-6, -1.8]
              )}deg)`,
              fontFamily: DISPLAY_FONT,
              fontSize: 162,
              fontWeight: 800,
              color: PALETTE.deepInk,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              textAlign: 'center',
            }}
          >
            MIGRA<span style={{ color: PALETTE.laravelRed }}>TION</span>
          </div>

          {/* Sub-pill */}
          <div
            style={{
              transform: `scale(${subPillSpring}) translateY(${interpolate(
                subPillSpring,
                [0, 1],
                [26, 0]
              )}px) rotate(1.2deg)`,
              backgroundColor: PALETTE.deepInk,
              color: '#FFFFFF',
              borderRadius: 999,
              padding: '22px 52px',
              fontFamily: DISPLAY_FONT,
              fontSize: 40,
              fontWeight: 800,
              boxShadow: '0 20px 44px rgba(15, 23, 42, 0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: PALETTE.emerald,
                display: 'inline-block',
              }}
            />
            Bikin Tabel Langsung dari Kode
          </div>
        </AbsoluteFill>
      )}

      {/* CRISP LARAVEL RED GEOMETRIC WAVE SWEEP (Frames 316 - 398) */}
      {frame >= 315 && frame <= 400 && (
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <path
            d={`
              M ${waveTrailingX} 0
              L ${waveLeadingX} 0
              Q ${waveLeadingX + 260} 270 ${waveLeadingX - 60} 540
              Q ${waveLeadingX - 240} 810 ${waveLeadingX + 90} 1080
              L ${waveTrailingX} 1080
              Q ${waveTrailingX + 180} 810 ${waveTrailingX - 110} 540
              Q ${waveTrailingX - 220} 270 ${waveTrailingX} 0
              Z
            `}
            fill={PALETTE.laravelRed}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
