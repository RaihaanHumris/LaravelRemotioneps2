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

const STRATA = [
  { colName: 'id', colType: 'BIGINT PK', color: PALETTE.cobalt, index: 0 },
  { colName: 'nama', colType: 'VARCHAR(255)', color: PALETTE.laravelRed, index: 1 },
  { colName: 'harga', colType: 'INTEGER', color: PALETTE.amber, index: 2, hasWarning: true },
  { colName: 'timestamps', colType: 'CREATED / UPDATED', color: PALETTE.emerald, index: 3 },
];

const ROLLBACK_CMD = '$ php artisan migrate:rollback';

export const Scene4Rollback: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // VO Sync (Scene 4 = frames 0..276 -> 00:43.8 to 00:53.0):
  // 00:43.8 - 00:45.8 (f 0-62): "Salah bikin kolom? Santai."
  // 00:45.8 - 00:48.5 (f 62-140): "Tinggal ketik migrate rollback."
  // 00:48.5 - 00:53.0 (f 140-276): "Struktur tabelnya langsung terlipat rapi kembali seperti tombol undo di database kamu."

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [260, 276], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Close-up zoom focus onto centered Database Cylinder
  const zoomSpring = spring({
    frame,
    fps,
    config: { stiffness: 150, damping: 16 },
  });
  const cylScale = interpolate(zoomSpring, [0, 1], [0.92, 1.08]);

  // Warning Badge: "Salah Bikin Kolom?"
  const warnSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { stiffness: 220, damping: 12 },
  });
  const warnWiggle = frame > 12 && frame < 140 ? Math.sin(frame * 0.45) * 2.2 : 0;

  // Calm Badge: "Santai!"
  const santaiSpring = spring({
    frame: Math.max(0, frame - 36),
    fps,
    config: { stiffness: 200, damping: 13 },
  });

  // Command Pill typing "$ php artisan migrate:rollback"
  const cmdSpring = spring({
    frame: Math.max(0, frame - 58),
    fps,
    config: { stiffness: 185, damping: 14 },
  });
  const typedLen = Math.floor(
    interpolate(frame, [66, 130], [0, ROLLBACK_CMD.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const rollbackFired = frame >= 136;

  // Reverse Shockwave when rollback fires
  const shockAge = frame - 136;
  const shockR = interpolate(shockAge, [0, 32], [35, 420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const shockOp = interpolate(shockAge, [0, 8, 32], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Animated circular Undo SVG arc sweeping around cylinder (f 150 - 255)
  const undoArcDash = interpolate(frame, [152, 212], [680, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Kinetic Stamp: "UNDO DATABASE!"
  const undoStampSpring = spring({
    frame: Math.max(0, frame - 176),
    fps,
    config: { stiffness: 210, damping: 12 },
  });

  // Centered Cylinder geometry
  const cylCX = 960;
  const cylTopY = 232;
  const cylHeight = 465;
  const cylRX = 250;
  const cylRY = 58;
  const cylBottomY = cylTopY + cylHeight;

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      {/* SVG Close-up Cylinder + Reverse Folding Strata + Undo Ring */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="s4-cyl-wall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.62" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.88" />
            <stop offset="75%" stopColor="#F1F5F9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Reverse Shockwave behind cylinder */}
        {shockAge >= 0 && shockAge <= 36 && (
          <circle
            cx={cylCX}
            cy={520}
            r={shockR}
            fill="none"
            stroke={PALETTE.amber}
            strokeWidth="7"
            strokeDasharray="18 10"
            opacity={shockOp}
          />
        )}

        <g
          transform={`translate(${cylCX}, 490) scale(${cylScale}) translate(${-cylCX}, -490)`}
        >
          {/* Ground Shadow */}
          <ellipse
            cx={cylCX}
            cy={cylBottomY + 28}
            rx={cylRX * 1.05}
            ry={cylRY * 0.72}
            fill="rgba(15, 23, 42, 0.08)"
          />

          {/* Cylinder Translucent Wall */}
          <path
            d={`
              M ${cylCX - cylRX} ${cylTopY}
              L ${cylCX - cylRX} ${cylBottomY}
              A ${cylRX} ${cylRY} 0 0 0 ${cylCX + cylRX} ${cylBottomY}
              L ${cylCX + cylRX} ${cylTopY}
              Z
            `}
            fill="url(#s4-cyl-wall)"
            stroke="#94A3B8"
            strokeWidth="3"
          />

          {/* Dashed Blueprint Outlines revealed as strata fold away */}
          {STRATA.map((s) => {
            const slotY = cylTopY + 90 + s.index * 92;
            const foldStart = 140 + (3 - s.index) * 14;
            const blueprintReveal = interpolate(
              frame,
              [foldStart, foldStart + 24],
              [0.2, 0.92],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <g key={`outline-${s.colName}`} opacity={blueprintReveal}>
                <ellipse
                  cx={cylCX}
                  cy={slotY}
                  rx={cylRX - 22}
                  ry={cylRY - 12}
                  fill="rgba(37, 99, 235, 0.05)"
                  stroke={PALETTE.cobalt}
                  strokeWidth="2.5"
                  strokeDasharray="10 8"
                />
                {frame >= foldStart + 14 && (
                  <text
                    x={cylCX}
                    y={slotY + 7}
                    textAnchor="middle"
                    fill={PALETTE.cobalt}
                    fontFamily={MONO_FONT}
                    fontSize="18"
                    fontWeight="700"
                    opacity={0.75}
                  >
                    [ blueprint: {s.colName} ]
                  </text>
                )}
              </g>
            );
          })}

          {/* SOLID STRATA FOLDING UPWARD IN REVERSE (Bottom -> Top: index 3, 2, 1, 0) */}
          {[...STRATA].reverse().map((s) => {
            const foldStart = 140 + (3 - s.index) * 14;
            const foldSpring = spring({
              frame: Math.max(0, frame - foldStart),
              fps,
              config: { stiffness: 165, damping: 14 },
            });

            const baseSlotY = cylTopY + 90 + s.index * 92;
            const currentY = interpolate(foldSpring, [0, 1], [baseSlotY, cylTopY - 26]);
            const scaleY = interpolate(foldSpring, [0, 0.7, 1], [1, 0.25, 0], {
              extrapolateRight: 'clamp',
            });
            const opacity = interpolate(foldSpring, [0, 0.55, 0.95], [1, 0.85, 0], {
              extrapolateRight: 'clamp',
            });

            if (opacity <= 0.01) return null;

            const stratumRX = cylRX - 22;
            const stratumRY = (cylRY - 12) * Math.max(0.15, scaleY);
            const thickness = 52 * Math.max(0.05, scaleY);

            // Subtle amber highlight flash on the "wrong column" before rollback
            const warnPulse =
              s.hasWarning && !rollbackFired
                ? 0.5 + 0.5 * Math.sin(frame * 0.35)
                : 0;

            return (
              <g key={`solid-${s.colName}`} opacity={opacity}>
                <path
                  d={`
                    M ${cylCX - stratumRX} ${currentY}
                    L ${cylCX - stratumRX} ${currentY + thickness}
                    A ${stratumRX} ${stratumRY} 0 0 0 ${cylCX + stratumRX} ${
                      currentY + thickness
                    }
                    L ${cylCX + stratumRX} ${currentY}
                    A ${stratumRX} ${stratumRY} 0 0 1 ${cylCX - stratumRX} ${currentY}
                    Z
                  `}
                  fill={s.color}
                  fillOpacity={0.92}
                />
                <ellipse
                  cx={cylCX}
                  cy={currentY}
                  rx={stratumRX}
                  ry={stratumRY}
                  fill={warnPulse > 0.4 ? '#FEF3C7' : '#FFFFFF'}
                  stroke={s.hasWarning && !rollbackFired ? PALETTE.amber : s.color}
                  strokeWidth={s.hasWarning && !rollbackFired ? 5.5 : 4}
                />
                {scaleY > 0.35 && (
                  <>
                    <text
                      x={cylCX - 155}
                      y={currentY + thickness + 14}
                      fill="#FFFFFF"
                      fontFamily={MONO_FONT}
                      fontSize="23"
                      fontWeight="700"
                    >
                      {s.colName}
                    </text>
                    <text
                      x={cylCX + 155}
                      y={currentY + thickness + 14}
                      fill="#FFFFFF"
                      fillOpacity="0.92"
                      fontFamily={MONO_FONT}
                      fontSize="18"
                      fontWeight="700"
                      textAnchor="end"
                    >
                      {s.hasWarning && !rollbackFired ? '⚠ SALAH TIPE?' : s.colType}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Cylinder Top Rim */}
          <ellipse
            cx={cylCX}
            cy={cylTopY}
            rx={cylRX}
            ry={cylRY}
            fill="rgba(255, 255, 255, 0.48)"
            stroke={rollbackFired ? PALETTE.cobalt : PALETTE.deepInk}
            strokeWidth="4"
          />

          {/* Curved Counter-Clockwise Undo Arrow sweeping over Cylinder Rim */}
          {frame >= 150 && (
            <g>
              <path
                d={`M ${cylCX + 295} ${cylTopY + 120} A 320 135 0 1 0 ${cylCX - 265} ${
                  cylTopY + 45
                }`}
                fill="none"
                stroke={PALETTE.laravelRed}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="680"
                strokeDashoffset={undoArcDash}
              />
              {frame >= 190 && (
                <polygon
                  points={`${cylCX - 285},${cylTopY + 25} ${cylCX - 240},${
                    cylTopY + 38
                  } ${cylCX - 268},${cylTopY + 75}`}
                  fill={PALETTE.laravelRed}
                  opacity={interpolate(frame, [190, 204], [0, 1], {
                    extrapolateRight: 'clamp',
                  })}
                />
              )}
            </g>
          )}
        </g>
      </svg>

      {/* PLAYFUL AMBER WARNING BADGE: "Salah Bikin Kolom?" */}
      {frame >= 6 && (
        <div
          style={{
            position: 'absolute',
            left: 145,
            top: 235,
            transform: `scale(${warnSpring}) rotate(${-3.2 + warnWiggle}deg)`,
            opacity: interpolate(frame, [160, 180], [1, 0.35], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            backgroundColor: PALETTE.amber,
            color: PALETTE.deepInk,
            borderRadius: 26,
            padding: '22px 42px',
            fontFamily: DISPLAY_FONT,
            fontSize: 42,
            fontWeight: 800,
            boxShadow: '0 20px 44px rgba(245, 158, 11, 0.34)',
            border: '4px solid #FFFFFF',
          }}
        >
          Salah Bikin Kolom?
        </div>
      )}

      {/* CALM MINT BADGE: "Santai!" */}
      {frame >= 36 && (
        <div
          style={{
            position: 'absolute',
            left: 255,
            top: 365,
            transform: `scale(${santaiSpring}) rotate(2.4deg)`,
            backgroundColor: PALETTE.emerald,
            color: '#FFFFFF',
            borderRadius: 999,
            padding: '14px 36px',
            fontFamily: DISPLAY_FONT,
            fontSize: 34,
            fontWeight: 800,
            boxShadow: '0 14px 32px rgba(16, 185, 129, 0.3)',
          }}
        >
          Santai!
        </div>
      )}

      {/* PLAYFUL TILTED STAMP: "UNDO DATABASE!" */}
      {frame >= 174 && (
        <div
          style={{
            position: 'absolute',
            right: 135,
            top: 295,
            transform: `scale(${undoStampSpring}) rotate(3deg)`,
            backgroundColor: PALETTE.laravelRed,
            color: '#FFFFFF',
            borderRadius: 28,
            padding: '24px 44px',
            fontFamily: DISPLAY_FONT,
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            boxShadow: '0 24px 52px rgba(255, 45, 32, 0.36)',
            border: '5px solid #FFFFFF',
          }}
        >
          UNDO DATABASE!
        </div>
      )}

      {/* BOTTOM MINIMALIST COMMAND PILL: $ php artisan migrate:rollback */}
      {frame >= 56 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 92,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${cmdSpring}) translateY(${interpolate(
              cmdSpring,
              [0, 1],
              [48, 0]
            )}px)`,
          }}
        >
          <div
            style={{
              backgroundColor: PALETTE.deepInk,
              borderRadius: 999,
              padding: '24px 46px',
              border: `3.5px solid ${rollbackFired ? PALETTE.amber : '#334155'}`,
              boxShadow: rollbackFired
                ? '0 22px 54px rgba(245, 158, 11, 0.34)'
                : '0 20px 44px rgba(15, 23, 42, 0.24)',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 34,
                fontWeight: 700,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ color: PALETTE.amber, marginRight: 10 }}>
                {ROLLBACK_CMD.slice(0, Math.min(2, typedLen))}
              </span>
              <span>{ROLLBACK_CMD.slice(2, typedLen)}</span>
              {Math.floor(frame / 8) % 2 === 0 && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 15,
                    height: 36,
                    backgroundColor: PALETTE.amber,
                    marginLeft: 8,
                    borderRadius: 4,
                  }}
                />
              )}
            </div>

            {rollbackFired && (
              <div
                style={{
                  backgroundColor: PALETTE.amber,
                  color: PALETTE.deepInk,
                  borderRadius: 999,
                  padding: '8px 22px',
                  fontFamily: DISPLAY_FONT,
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                ROLLED BACK ↺
              </div>
            )}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
