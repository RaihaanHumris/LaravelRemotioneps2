import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  DISPLAY_FONT,
  GridBackground,
  MONO_FONT,
  PALETTE,
  SCENE_DURATIONS,
  VO_AUDIO_FILE,
} from './components/GridBackground';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Blueprint } from './scenes/Scene2Blueprint';
import { Scene3MigrateFlow } from './scenes/Scene3MigrateFlow';
import { Scene4Rollback } from './scenes/Scene4Rollback';
import { Scene5Outro } from './scenes/Scene5Outro';

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progressPct = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.canvas,
        fontFamily: DISPLAY_FONT,
        overflow: 'hidden',
      }}
    >
      {/* Persistent Drifting Architectural Grid */}
      <GridBackground />

      {/* Voiceover Track (Synced to 64.21s ElevenLabs VO) */}
      <Audio src={staticFile(VO_AUDIO_FILE)} />
      {/* Alternative standalone file reference if exporting outside workspace: */}
      {/* <Audio src={staticFile('vo-migration.mp3')} /> */}

      {/* 5 Seamlessly Connected Kinetic Motion Scenes */}
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene1}>
          <Scene1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene2}>
          <Scene2Blueprint />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3}>
          <Scene3MigrateFlow />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4}>
          <Scene4Rollback />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene5}>
          <Scene5Outro />
        </Series.Sequence>
      </Series>

      {/* Top-Left Persistent Floating Episode Badge */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '2px solid #E2E8F0',
          borderRadius: 999,
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
        }}
      >
        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: 999,
            backgroundColor: PALETTE.laravelRed,
          }}
        />
        <span
          style={{
            fontFamily: MONO_FONT,
            fontSize: 19,
            fontWeight: 700,
            color: PALETTE.deepInk,
            letterSpacing: '0.06em',
          }}
        >
          LARAVEL 101 • EPS. 02
        </span>
      </div>

      {/* Slim Top Progress Bar (#FF2D20) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: 'rgba(15, 23, 42, 0.07)',
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            backgroundColor: PALETTE.laravelRed,
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
