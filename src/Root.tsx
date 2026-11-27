import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { TOTAL_DURATION } from './components/GridBackground';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LaravelMigration"
      component={Main}
      durationInFrames={TOTAL_DURATION} // 1950 frames = 65.0s @ 30fps (synced to 64.21s VO)
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
