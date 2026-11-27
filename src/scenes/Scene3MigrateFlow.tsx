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

interface CapsuleSpec {
  id: string;
  code: string;
  colName: string;
  colType: string;
  color: string;
  softBg: string;
  startY: number;
  detachFrame: number;
  voicePulseFrame?: number;
  launchFrame: number;
  stackIndex: number; // 0 = top, 3 = bottom
}

const CAPSULES: CapsuleSpec[] = [
  {
    id: 'id',
    code: "$table->id()",
    colName: 'id',
    colType: 'BIGINT PK',
    color: PALETTE.cobalt,
    softBg: '#EFF6FF',
    startY: 325,
    detachFrame: 12,
    launchFrame: 296,
    stackIndex: 0,
  },
  {
    id: 'nama',
    code: "$table->string('nama')",
    colName: 'nama',
    colType: 'VARCHAR(255)',
    color: PALETTE.laravelRed,
    softBg: '#FEF2F2',
    startY: 435,
    detachFrame: 34,
    voicePulseFrame: 78, // "string nama"
    launchFrame: 322,
    stackIndex: 1,
  },
  {
    id: 'harga',
    code: "$table->integer('harga')",
    colName: 'harga',
    colType: 'INTEGER',
    color: PALETTE.amber,
    softBg: '#FFFBEB',
    startY: 545,
    detachFrame: 56,
    voicePulseFrame: 118, // "integer harga"
    launchFrame: 348,
    stackIndex: 2,
  },
  {
    id: 'timestamps',
    code: '$table->timestamps()',
    colName: 'timestamps',
    colType: 'CREATED / UPDATED',
    color: PALETTE.emerald,
    softBg: '#ECFDF5',
    startY: 655,
    detachFrame: 76,
    launchFrame: 374,
    stackIndex: 3,
  },
];

const COMMAND_TEXT = '$ php artisan migrate';
const FLIGHT_DURATION = 34;

// Quadratic Bezier point helper
const quadBezier = (t: number, p0: number, p1: number, p2: number) => {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
};

export const Scene3MigrateFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // VO Sync (Scene 3 = frames 0..480 -> 00:27.8 to 00:43.8):
  // 00:27.8 - 00:33.0 (f 0-156): "Lihat prosesnya. Begitu kamu tulis baris seperti string nama dan integer harga,"
  // 00:33.0 - 00:37.6 (f 156-295): "lalu jalanin satu perintah ajaib di terminal, php artisan migrate,"
  // 00:37.6 - 00:43.8 (f 295-480): "semua baris kode tadi otomatis meluncur ke database dan nyusun struktur tabelnya dari atas ke bawah."

  const enterOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [466, 480], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Left Dock entrance
  const dockSpring = spring({
    frame,
    fps,
    config: { stiffness: 170, damping: 15 },
  });

  // Right Database Cylinder entrance
  const cylSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { stiffness: 160, damping: 14 },
  });

  // Center Terminal Pill (f 156 - 295)
  const termSpring = spring({
    frame: Math.max(0, frame - 156),
    fps,
    config: { stiffness: 190, damping: 13 },
  });
  const typedChars = Math.floor(
    interpolate(frame, [175, 268], [0, COMMAND_TEXT.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const showCursor = Math.floor(frame / 8) % 2 === 0;
  const isTriggered = frame >= 280;

  // Emerald Shockwave triggered right after "php artisan migrate"
  const shockAge = frame - 280;
  const shockRadius = interpolate(shockAge, [0, 42], [40, 620], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const shockOpacity = interpolate(shockAge, [0, 8, 42], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cylinder geometry constants (Centered at x = 1480)
  const cylCX = 1480;
  const cylTopY = 305;
  const cylHeight = 475;
  const cylRX = 228;
  const cylRY = 56;
  const cylBottomY = cylTopY + cylHeight;

  // Compute subtle cylinder squash when any capsule impacts rim
  let cylImpactSquash = 0;
  for (const cap of CAPSULES) {
    const impactAge = frame - (cap.launchFrame + FLIGHT_DURATION);
    if (impactAge >= 0 && impactAge < 22) {
      cylImpactSquash += Math.sin((impactAge / 22) * Math.PI) * Math.exp(-impactAge * 0.14);
    }
  }
  const cylScaleX = 1 + cylImpactSquash * 0.055;
  const cylScaleY = 1 - cylImpactSquash * 0.045;

  // Completion badges after 4th stratum locks in (~f 415)
  const doneBadgeSpring = spring({
    frame: Math.max(0, frame - 416),
    fps,
    config: { stiffness: 180, damping: 12 },
  });
  const autoSusunSpring = spring({
    frame: Math.max(0, frame - 428),
    fps,
    config: { stiffness: 210, damping: 12 },
  });

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      {/* Top Section Title */}
      <div
        style={{
          position: 'absolute',
          top: 94,
          left: 112,
          fontFamily: DISPLAY_FONT,
          fontSize: 48,
          fontWeight: 800,
          color: PALETTE.deepInk,
          letterSpacing: '-0.03em',
          opacity: dockSpring,
        }}
      >
        Simulasi <span style={{ color: PALETTE.emerald }}>Auto-Susun</span> Tabel
      </div>

      {/* LEFT SIDE: Blueprint Capsule Dock Frame */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 220,
          width: 480,
          height: 560,
          borderRadius: 32,
          backgroundColor: 'rgba(15, 23, 42, 0.035)',
          border: '2.5px dashed #CBD5E1',
          transform: `scale(${dockSpring})`,
          padding: '24px 30px',
        }}
      >
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 21,
            fontWeight: 700,
            color: PALETTE.slateMuted,
            letterSpacing: '0.02em',
          }}
        >
          BLUEPRINT CAPSULES
        </div>
      </div>

      {/* SVG LAYER: Flight Guide Arcs, Emerald Shockwave & 2.5D Abstract Database Cylinder */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="cyl-wall-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.88" />
            <stop offset="75%" stopColor="#F1F5F9" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="cyl-rim-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.78" />
          </linearGradient>
        </defs>

        {/* Subtle Curved Bezier Trajectory Preview Lines once triggered */}
        {isTriggered &&
          CAPSULES.map((cap) => {
            const pathOp = interpolate(
              frame,
              [cap.launchFrame - 12, cap.launchFrame + 4, cap.launchFrame + FLIGHT_DURATION + 14],
              [0, 0.55, 0.14],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <path
                key={`arc-${cap.id}`}
                d={`M 336 ${cap.startY + 34} Q 920 ${120 + cap.stackIndex * 22} ${cylCX} ${cylTopY}`}
                fill="none"
                stroke={cap.color}
                strokeWidth="3"
                strokeDasharray="10 10"
                opacity={pathOp}
              />
            );
          })}

        {/* Emerald Shockwave from Terminal Center */}
        {shockAge >= 0 && shockAge <= 45 && (
          <g>
            <circle
              cx="940"
              cy="868"
              r={shockRadius}
              fill="none"
              stroke={PALETTE.emerald}
              strokeWidth="8"
              opacity={shockOpacity}
            />
            <circle
              cx="940"
              cy="868"
              r={shockRadius * 0.72}
              fill="none"
              stroke={PALETTE.emerald}
              strokeWidth="3.5"
              strokeDasharray="16 12"
              opacity={shockOpacity * 0.8}
            />
          </g>
        )}

        {/* RIGHT SIDE: 2.5D ABSTRACT DATABASE CYLINDER */}
        <g
          transform={`translate(${cylCX}, ${cylBottomY}) scale(${cylSpring * cylScaleX}, ${
            cylSpring * cylScaleY
          }) translate(${-cylCX}, ${-cylBottomY})`}
        >
          {/* Soft floor shadow under cylinder */}
          <ellipse
            cx={cylCX}
            cy={cylBottomY + 28}
            rx={cylRX * 1.06}
            ry={cylRY * 0.72}
            fill="rgba(15, 23, 42, 0.08)"
          />

          {/* Cylinder Back Wall & Translucent Body */}
          <path
            d={`
              M ${cylCX - cylRX} ${cylTopY}
              L ${cylCX - cylRX} ${cylBottomY}
              A ${cylRX} ${cylRY} 0 0 0 ${cylCX + cylRX} ${cylBottomY}
              L ${cylCX + cylRX} ${cylTopY}
              Z
            `}
            fill="url(#cyl-wall-grad)"
            stroke="#94A3B8"
            strokeWidth="3"
          />

          {/* Subtle Inner Dashed Blueprint Strata Guides before capsules drop */}
          {[0, 1, 2, 3].map((slot) => {
            const slotY = cylTopY + 95 + slot * 94;
            return (
              <ellipse
                key={`guide-${slot}`}
                cx={cylCX}
                cy={slotY}
                rx={cylRX - 24}
                ry={cylRY - 10}
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="8 8"
                opacity={0.75}
              />
            );
          })}

          {/* STACKED TABLE STRATA / PARTITIONS (rendered bottom-to-top in SVG z-order so top overlaps nicely, while animating top-to-bottom!) */}
          {[...CAPSULES].reverse().map((cap) => {
            const landFrame = cap.launchFrame + FLIGHT_DURATION;
            if (frame < landFrame) return null;

            const stratumSpring = spring({
              frame: Math.max(0, frame - landFrame),
              fps,
              config: { stiffness: 170, damping: 12 }, // Elastic spring bounce as requested
            });

            // Drops from cylinder top rim down into its slot (index 0 at top -> index 3 at bottom)
            const targetY = cylTopY + 92 + cap.stackIndex * 94;
            const currentY = interpolate(stratumSpring, [0, 1], [cylTopY + 18, targetY]);
            const stratumRX = cylRX - 20;
            const stratumRY = cylRY - 12;
            const thickness = 54;

            return (
              <g
                key={`stratum-${cap.id}`}
                opacity={interpolate(stratumSpring, [0, 0.25], [0, 1], {
                  extrapolateRight: 'clamp',
                })}
              >
                {/* 2.5D Stratum Side Band */}
                <path
                  d={`
                    M ${cylCX - stratumRX} ${currentY}
                    L ${cylCX - stratumRX} ${currentY + thickness}
                    A ${stratumRX} ${stratumRY} 0 0 0 ${cylCX + stratumRX} ${currentY + thickness}
                    L ${cylCX + stratumRX} ${currentY}
                    A ${stratumRX} ${stratumRY} 0 0 1 ${cylCX - stratumRX} ${currentY}
                    Z
                  `}
                  fill={cap.color}
                  fillOpacity="0.92"
                />
                {/* 2.5D Stratum Top Glowing Elliptical Cap */}
                <ellipse
                  cx={cylCX}
                  cy={currentY}
                  rx={stratumRX}
                  ry={stratumRY}
                  fill="#FFFFFF"
                  fillOpacity="0.96"
                  stroke={cap.color}
                  strokeWidth="4"
                />
                {/* Crisp Label on Front Curve of Partition */}
                <text
                  x={cylCX - 140}
                  y={currentY + thickness + 15}
                  fill="#FFFFFF"
                  fontFamily={MONO_FONT}
                  fontSize="23"
                  fontWeight="700"
                >
                  {cap.colName}
                </text>
                <text
                  x={cylCX + 145}
                  y={currentY + thickness + 15}
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                  fontFamily={MONO_FONT}
                  fontSize="18"
                  fontWeight="700"
                  textAnchor="end"
                >
                  {cap.colType}
                </text>
              </g>
            );
          })}

          {/* Cylinder Top Opening Rim (Drawn cleanly on top) */}
          <ellipse
            cx={cylCX}
            cy={cylTopY}
            rx={cylRX}
            ry={cylRY}
            fill="url(#cyl-rim-grad)"
            fillOpacity="0.55"
            stroke={PALETTE.deepInk}
            strokeWidth="4"
          />
          {/* Inner glowing rim ring */}
          <ellipse
            cx={cylCX}
            cy={cylTopY}
            rx={cylRX - 16}
            ry={cylRY - 7}
            fill="none"
            stroke={isTriggered ? PALETTE.emerald : PALETTE.cobalt}
            strokeWidth="3"
            strokeDasharray={isTriggered ? 'none' : '12 10'}
            opacity={0.85}
          />
          {/* Front Wall Glass Highlight */}
          <path
            d={`M ${cylCX - cylRX + 22} ${cylTopY + 52} L ${cylCX - cylRX + 22} ${cylBottomY - 24}`}
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      </svg>

      {/* Cylinder Header Tag: Tabel: products */}
      <div
        style={{
          position: 'absolute',
          left: cylCX - 135,
          top: 174,
          transform: `scale(${cylSpring})`,
          backgroundColor: PALETTE.deepInk,
          color: '#FFFFFF',
          borderRadius: 999,
          padding: '12px 30px',
          fontFamily: MONO_FONT,
          fontSize: 25,
          fontWeight: 700,
          boxShadow: '0 14px 32px rgba(15, 23, 42, 0.16)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: PALETTE.emerald,
          }}
        />
        Tabel: products
      </div>

      {/* KINETIC CODE BLUEPRINT CAPSULES (Dock -> Curved Bezier Flight -> Squash into Cylinder) */}
      {CAPSULES.map((cap) => {
        const appearSpring = spring({
          frame: Math.max(0, frame - cap.detachFrame),
          fps,
          config: { stiffness: 195, damping: 14 },
        });
        if (frame < cap.detachFrame) return null;

        // Voiceover emphasis pulse ("string nama" / "integer harga")
        let voPulse = 0;
        if (cap.voicePulseFrame !== undefined) {
          const pAge = frame - cap.voicePulseFrame;
          if (pAge >= 0 && pAge <= 34) {
            voPulse = Math.sin((pAge / 34) * Math.PI);
          }
        }

        const flightRaw = interpolate(
          frame,
          [cap.launchFrame, cap.launchFrame + FLIGHT_DURATION],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.32, 0.02, 0.56, 1),
          }
        );

        // Hide capsule once it transforms into stratum inside cylinder
        if (frame >= cap.launchFrame + FLIGHT_DURATION + 2) return null;

        const startX = 136;
        const startY = cap.startY;
        const ctrlX = 870;
        const ctrlY = 92 + cap.stackIndex * 24;
        const endX = cylCX - 180;
        const endY = cylTopY - 24;

        const floatIdle =
          frame < cap.launchFrame ? Math.sin((frame + cap.stackIndex * 16) * 0.08) * 6 : 0;

        const curX =
          frame < cap.launchFrame
            ? startX
            : quadBezier(flightRaw, startX, ctrlX, endX);
        const curY =
          frame < cap.launchFrame
            ? startY + floatIdle
            : quadBezier(flightRaw, startY, ctrlY, endY);

        // Dynamic squash-and-stretch physics along flight + impact squash
        let scaleX = 1 + voPulse * 0.09;
        let scaleY = 1 + voPulse * 0.09;
        let rotateDeg = 0;
        let capsuleOpacity = 1;

        if (frame >= cap.launchFrame) {
          const midStretch = Math.sin(flightRaw * Math.PI);
          // Stretch horizontally in mid-air, squash dramatically at rim impact (t > 0.84)
          if (flightRaw < 0.82) {
            scaleX = 1 + midStretch * 0.22;
            scaleY = 1 - midStretch * 0.16;
          } else {
            const impactT = (flightRaw - 0.82) / 0.18;
            scaleX = interpolate(impactT, [0, 0.6, 1], [1.14, 1.28, 0.65]);
            scaleY = interpolate(impactT, [0, 0.6, 1], [0.88, 0.68, 0.35]);
            capsuleOpacity = interpolate(impactT, [0.5, 1], [1, 0], {
              extrapolateLeft: 'clamp',
            });
          }
          rotateDeg = interpolate(flightRaw, [0, 0.45, 1], [-4, -14, 24]);
        }

        return (
          <div
            key={cap.id}
            style={{
              position: 'absolute',
              left: curX,
              top: curY,
              width: 396,
              transform: `scale(${appearSpring * scaleX}, ${
                appearSpring * scaleY
              }) rotate(${rotateDeg}deg)`,
              opacity: capsuleOpacity,
              backgroundColor: cap.softBg,
              border: `3.5px solid ${cap.color}`,
              borderRadius: 999,
              padding: '18px 30px',
              fontFamily: MONO_FONT,
              fontSize: 25,
              fontWeight: 700,
              color: PALETTE.deepInk,
              boxShadow:
                voPulse > 0.05 || frame >= cap.launchFrame
                  ? `0 18px 38px ${cap.color}44`
                  : '0 10px 24px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{cap.code}</span>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: cap.color,
              }}
            />
          </div>
        );
      })}

      {/* CENTER TRIGGER: Floating Terminal Pill ($ php artisan migrate) */}
      {frame >= 154 && (
        <div
          style={{
            position: 'absolute',
            left: 550,
            top: 816,
            width: 780,
            transform: `scale(${termSpring}) translateY(${interpolate(
              termSpring,
              [0, 1],
              [50, 0]
            )}px)`,
            backgroundColor: PALETTE.deepInk,
            borderRadius: 999,
            padding: '24px 40px',
            border: `3.5px solid ${isTriggered ? PALETTE.emerald : '#334155'}`,
            boxShadow: isTriggered
              ? '0 22px 54px rgba(16, 185, 129, 0.34)'
              : '0 22px 48px rgba(15, 23, 42, 0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            <span style={{ color: PALETTE.emerald, marginRight: 10 }}>
              {COMMAND_TEXT.slice(0, Math.min(2, typedChars))}
            </span>
            <span>{COMMAND_TEXT.slice(2, typedChars)}</span>
            {showCursor && (
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 36,
                  backgroundColor: PALETTE.emerald,
                  marginLeft: 8,
                  borderRadius: 4,
                }}
              />
            )}
          </div>

          {isTriggered && (
            <div
              style={{
                backgroundColor: PALETTE.emerald,
                color: '#FFFFFF',
                borderRadius: 999,
                padding: '8px 22px',
                fontFamily: DISPLAY_FONT,
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {frame >= 412 ? 'DONE ✓' : 'MIGRATING...'}
            </div>
          )}
        </div>
      )}

      {/* COMPLETION EMERALD BADGE: "Struktur Tabel Jadi Otomatis ✓" */}
      {frame >= 414 && (
        <div
          style={{
            position: 'absolute',
            left: 655,
            top: 430,
            transform: `scale(${doneBadgeSpring}) rotate(-2deg)`,
            backgroundColor: PALETTE.emerald,
            color: '#FFFFFF',
            borderRadius: 28,
            padding: '24px 42px',
            fontFamily: DISPLAY_FONT,
            fontSize: 34,
            fontWeight: 800,
            boxShadow: '0 22px 52px rgba(16, 185, 129, 0.38)',
            border: '4px solid #FFFFFF',
          }}
        >
          Struktur Tabel Jadi Otomatis ✓
        </div>
      )}

      {/* PLAYFUL TILTED REACTION STAMP: "AUTO SUSUN ✓" */}
      {frame >= 426 && (
        <div
          style={{
            position: 'absolute',
            left: 790,
            top: 545,
            transform: `scale(${autoSusunSpring}) rotate(3deg)`,
            backgroundColor: '#FFFFFF',
            color: PALETTE.deepInk,
            border: `3.5px solid ${PALETTE.emerald}`,
            borderRadius: 999,
            padding: '12px 32px',
            fontFamily: DISPLAY_FONT,
            fontSize: 28,
            fontWeight: 800,
            boxShadow: '0 14px 32px rgba(15, 23, 42, 0.12)',
          }}
        >
          AUTO SUSUN ✓
        </div>
      )}
    </AbsoluteFill>
  );
};
