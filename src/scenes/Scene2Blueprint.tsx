import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DISPLAY_FONT, MONO_FONT, PALETTE } from '../components/GridBackground';

const CODE_LINES = [
  { text: "Schema::create('products', function ($table) {", color: '#94A3B8', delay: 238, indent: 0 },
  { text: '$table->id();', color: '#60A5FA', delay: 258, indent: 1 },
  { text: "$table->string('nama');", color: '#F87171', delay: 278, indent: 1 },
  { text: "$table->integer('harga');", color: '#FBBF24', delay: 298, indent: 1 },
  { text: '$table->timestamps();', color: '#34D399', delay: 318, indent: 1 },
  { text: '});', color: '#94A3B8', delay: 332, indent: 0 },
];

export const Scene2Blueprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // VO Sync (Scene 2 = frames 0..390 -> 00:14.8 to 00:27.8):
  // 00:14.8 - 00:20.0 (f 0-156): "Gampangnya, anggap aja migration itu kayak cetak biru atau blueprint sebuah bangunan."
  // 00:20.0 - 00:22.8 (f 156-240): "Kamu gak perlu nyusun batu bata manual di database."
  // 00:22.8 - 00:27.8 (f 240-390): "Cukup tulis daftar kolom dan tipe datanya langsung di dalam file kode PHP."

  const enterOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [374, 390], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Blueprint wireframe SVG drawing progression
  const frameDraw = interpolate(frame, [6, 72], [2400, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const towerDraw = interpolate(frame, [28, 105], [1400, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const floorDraw = interpolate(frame, [60, 130], [800, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Callout 1: "Cetak Biru Struktur"
  const callout1Spring = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { stiffness: 180, damping: 13 },
  });

  // Anti-manual bricks micro-badge (f 150 - 235)
  const bricksSpring = spring({
    frame: Math.max(0, frame - 152),
    fps,
    config: { stiffness: 190, damping: 14 },
  });
  const slashProgress = interpolate(frame, [175, 196], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Callout 2: "Tanpa Buka phpMyAdmin"
  const callout2Spring = spring({
    frame: Math.max(0, frame - 178),
    fps,
    config: { stiffness: 185, damping: 13 },
  });

  // Floating dark-slate PHP Code Card (f 226+)
  const codeCardSpring = spring({
    frame: Math.max(0, frame - 224),
    fps,
    config: { stiffness: 165, damping: 13 },
  });

  // Callout 3: "Tulis di PHP"
  const callout3Spring = spring({
    frame: Math.max(0, frame - 260),
    fps,
    config: { stiffness: 185, damping: 13 },
  });

  // Connecting leader lines from blueprint floors -> PHP code lines
  const connectorProgress = interpolate(frame, [265, 325], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gentle orbital float
  const orbitA = Math.sin(frame * 0.06) * 10;
  const orbitB = Math.cos(frame * 0.055) * 9;

  return (
    <AbsoluteFill style={{ opacity: enterOpacity * exitOpacity }}>
      {/* Section Header Accent */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 112,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          transform: `translateY(${interpolate(callout1Spring, [0, 1], [18, 0])}px)`,
          opacity: callout1Spring,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 54,
            fontWeight: 800,
            color: PALETTE.deepInk,
            letterSpacing: '-0.03em',
          }}
        >
          Analogi{' '}
          <span style={{ color: PALETTE.cobalt }}>Cetak Biru</span>
        </div>
      </div>

      {/* LEFT SIDE: Architectural Blueprint Wireframe SVG */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Outer Blueprint Drafting Frame */}
        <rect
          x="112"
          y="210"
          width="740"
          height="680"
          rx="28"
          fill="rgba(37, 99, 235, 0.045)"
          stroke={PALETTE.cobalt}
          strokeWidth="3.5"
          strokeDasharray="2400"
          strokeDashoffset={frameDraw}
        />

        {/* Inner Drafting Border */}
        <rect
          x="136"
          y="234"
          width="692"
          height="632"
          rx="18"
          fill="none"
          stroke={PALETTE.cobalt}
          strokeWidth="1.5"
          strokeDasharray="10 10"
          opacity={0.55}
        />

        {/* Abstract Architectural Building / Schema Structure */}
        <g transform="translate(260, 300)">
          {/* Roof / Pediment */}
          <polygon
            points="220,10 420,96 20,96"
            fill="rgba(37, 99, 235, 0.1)"
            stroke={PALETTE.cobalt}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeDasharray="1400"
            strokeDashoffset={towerDraw}
          />
          {/* Main Building Frame */}
          <rect
            x="44"
            y="96"
            width="352"
            height="390"
            rx="12"
            fill="#FFFFFF"
            fillOpacity="0.65"
            stroke={PALETTE.cobalt}
            strokeWidth="4"
            strokeDasharray="1400"
            strokeDashoffset={towerDraw}
          />
          {/* 4 Structural Floors corresponding to table columns */}
          {[
            { y: 122, label: 'FLOOR 01 • ID', accent: PALETTE.cobalt },
            { y: 208, label: 'FLOOR 02 • NAMA', accent: PALETTE.laravelRed },
            { y: 294, label: 'FLOOR 03 • HARGA', accent: PALETTE.amber },
            { y: 380, label: 'FLOOR 04 • TIMESTAMPS', accent: PALETTE.emerald },
          ].map((floor, idx) => {
            const floorReveal = spring({
              frame: Math.max(0, frame - (70 + idx * 14)),
              fps,
              config: { stiffness: 170, damping: 14 },
            });
            return (
              <g key={floor.label} opacity={floorReveal}>
                <rect
                  x="70"
                  y={floor.y}
                  width="300"
                  height="64"
                  rx="12"
                  fill="#FFFFFF"
                  stroke={floor.accent}
                  strokeWidth="3"
                  strokeDasharray="800"
                  strokeDashoffset={floorDraw}
                />
                <circle cx="102" cy={floor.y + 32} r="8" fill={floor.accent} />
                <text
                  x="126"
                  y={floor.y + 39}
                  fill={PALETTE.deepInk}
                  fontFamily={MONO_FONT}
                  fontSize="19"
                  fontWeight="700"
                >
                  {floor.label}
                </text>
              </g>
            );
          })}

          {/* Dimension Ruler on Left of Blueprint */}
          <g opacity={interpolate(frame, [85, 115], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            <line x1="-18" y1="96" x2="-18" y2="486" stroke={PALETTE.cobalt} strokeWidth="2.5" />
            <line x1="-30" y1="96" x2="-6" y2="96" stroke={PALETTE.cobalt} strokeWidth="2.5" />
            <line x1="-30" y1="486" x2="-6" y2="486" stroke={PALETTE.cobalt} strokeWidth="2.5" />
            <text
              x="-42"
              y="300"
              fill={PALETTE.cobalt}
              fontFamily={MONO_FONT}
              fontSize="17"
              fontWeight="700"
              transform="rotate(-90 -42 300)"
              textAnchor="middle"
            >
              SCHEMA: PRODUCTS
            </text>
          </g>
        </g>

        {/* Dashed Cobalt Connectors linking Blueprint -> Code Card */}
        {frame >= 260 && (
          <g>
            {[
              { y1: 454, y2: 472, color: PALETTE.cobalt },
              { y1: 540, y2: 534, color: PALETTE.laravelRed },
              { y1: 626, y2: 596, color: PALETTE.amber },
              { y1: 712, y2: 658, color: PALETTE.emerald },
            ].map((line, i) => (
              <path
                key={i}
                d={`M 630 ${line.y1} C 760 ${line.y1}, 820 ${line.y2}, 940 ${line.y2}`}
                fill="none"
                stroke={line.color}
                strokeWidth="3"
                strokeDasharray="10 8"
                strokeDashoffset={connectorProgress * 360 - frame * 1.4}
                opacity={0.75}
              />
            ))}
          </g>
        )}
      </svg>

      {/* FLOATING KINETIC CALLOUT 1: "Cetak Biru Struktur" */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          top: 162 + orbitA,
          transform: `scale(${callout1Spring}) rotate(2.4deg)`,
          backgroundColor: PALETTE.cobalt,
          color: '#FFFFFF',
          borderRadius: 999,
          padding: '16px 34px',
          fontFamily: DISPLAY_FONT,
          fontSize: 30,
          fontWeight: 800,
          boxShadow: '0 16px 36px rgba(37, 99, 235, 0.32)',
          whiteSpace: 'nowrap',
        }}
      >
        Cetak Biru Struktur
      </div>

      {/* ANTI-MANUAL BRICKS CROSS-OUT BADGE (f 152 - 390) */}
      {frame >= 150 && (
        <div
          style={{
            position: 'absolute',
            left: 165,
            top: 846 + orbitB * 0.5,
            transform: `scale(${bricksSpring}) rotate(-2deg)`,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {/* Mini Abstract Brick Stack with Red Slash */}
          <div
            style={{
              position: 'relative',
              backgroundColor: '#FFFFFF',
              border: '3px solid #E2E8F0',
              borderRadius: 20,
              padding: '14px 20px',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <svg width="64" height="44" viewBox="0 0 64 44">
              <rect x="4" y="24" width="26" height="14" rx="3" fill="#FCA5A5" stroke={PALETTE.laravelRed} strokeWidth="2" />
              <rect x="34" y="24" width="26" height="14" rx="3" fill="#FCA5A5" stroke={PALETTE.laravelRed} strokeWidth="2" />
              <rect x="19" y="6" width="26" height="14" rx="3" fill="#FCA5A5" stroke={PALETTE.laravelRed} strokeWidth="2" />
              <line
                x1="4"
                y1="40"
                x2="60"
                y2="4"
                stroke={PALETTE.laravelRed}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="72"
                strokeDashoffset={slashProgress * 72}
              />
            </svg>
            <span
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: 28,
                fontWeight: 800,
                color: PALETTE.deepInk,
              }}
            >
              Tanpa Buka phpMyAdmin
            </span>
          </div>
        </div>
      )}

      {/* RIGHT SIDE: Floating Dark-Slate PHP Code Card (#0F172A) */}
      {frame >= 220 && (
        <div
          style={{
            position: 'absolute',
            right: 112,
            top: 265,
            width: 860,
            transform: `translateX(${interpolate(
              codeCardSpring,
              [0, 1],
              [140, 0]
            )}px) scale(${interpolate(codeCardSpring, [0, 1], [0.92, 1])})`,
            opacity: codeCardSpring,
            backgroundColor: PALETTE.deepInk,
            borderRadius: 30,
            padding: '32px 38px 42px',
            boxShadow: '0 32px 72px rgba(15, 23, 42, 0.24)',
            border: '2px solid #1E293B',
          }}
        >
          {/* Card Header / Filename */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 24,
              marginBottom: 26,
              borderBottom: '1.5px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#EF4444' }} />
              <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#F59E0B' }} />
              <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#10B981' }} />
            </div>
            <div
              style={{
                fontFamily: MONO_FONT,
                fontSize: 23,
                fontWeight: 700,
                color: '#E2E8F0',
                backgroundColor: '#1E293B',
                padding: '8px 20px',
                borderRadius: 12,
              }}
            >
              create_products_table.php
            </div>
          </div>

          {/* Code Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {CODE_LINES.map((line, index) => {
              const lineSpring = spring({
                frame: Math.max(0, frame - line.delay),
                fps,
                config: { stiffness: 200, damping: 16 },
              });
              const highlight =
                line.indent === 1 &&
                frame >= line.delay &&
                frame <= line.delay + 28;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    opacity: lineSpring,
                    transform: `translateX(${interpolate(lineSpring, [0, 1], [28, 0])}px)`,
                    backgroundColor: highlight
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'transparent',
                    padding: '6px 14px',
                    borderRadius: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 22,
                      color: '#475569',
                      width: 30,
                      textAlign: 'right',
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 27,
                      fontWeight: 700,
                      color: line.color,
                      paddingLeft: line.indent * 34,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING KINETIC CALLOUT 3: "Tulis di PHP" */}
      {frame >= 258 && (
        <div
          style={{
            position: 'absolute',
            right: 140,
            top: 204 - orbitA * 0.7,
            transform: `scale(${callout3Spring}) rotate(-2.2deg)`,
            backgroundColor: PALETTE.emerald,
            color: '#FFFFFF',
            borderRadius: 999,
            padding: '15px 34px',
            fontFamily: DISPLAY_FONT,
            fontSize: 30,
            fontWeight: 800,
            boxShadow: '0 16px 34px rgba(16, 185, 129, 0.34)',
          }}
        >
          Tulis di PHP
        </div>
      )}

      {/* Orbiting subtle secondary cue at bottom right */}
      {frame >= 180 && (
        <div
          style={{
            position: 'absolute',
            right: 150,
            bottom: 105 + orbitB * 0.6,
            transform: `scale(${callout2Spring}) rotate(1.5deg)`,
            fontFamily: MONO_FONT,
            fontSize: 22,
            fontWeight: 700,
            color: PALETTE.cobalt,
            opacity: 0.9,
          }}
        >
          database/migrations/2026_create_products_table.php
        </div>
      )}
    </AbsoluteFill>
  );
};
