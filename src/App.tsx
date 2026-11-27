import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import {
  Check,
  Code2,
  Copy,
  Download,
  Film,
  Layers,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Main } from './Main';
import { SCENE_DURATIONS, TOTAL_DURATION } from './components/GridBackground';

import rootCode from './Root.tsx?raw';
import mainCode from './Main.tsx?raw';
import gridCode from './components/GridBackground.tsx?raw';
import scene1Code from './scenes/Scene1Hook.tsx?raw';
import scene2Code from './scenes/Scene2Blueprint.tsx?raw';
import scene3Code from './scenes/Scene3MigrateFlow.tsx?raw';
import scene4Code from './scenes/Scene4Rollback.tsx?raw';
import scene5Code from './scenes/Scene5Outro.tsx?raw';

const FPS = 30;
const MP4_URL = '/laravel-migration-video.mp4';
const MP4_FILENAME = 'laravel-migration-eps02.mp4';

interface SceneMeta {
  id: string;
  shortLabel: string;
  title: string;
  startFrame: number;
  duration: number;
  accent: string;
  voSummary: string;
}

const SCENES: SceneMeta[] = [
  {
    id: 'scene1',
    shortLabel: 'Hook',
    title: '01. Hook — Klik Manual phpMyAdmin',
    startFrame: 0,
    duration: SCENE_DURATIONS.scene1,
    accent: '#FF2D20',
    voSummary:
      'Masih sering bikin tabel database dengan klik-klik manual di phpMyAdmin? Export-import SQL bolak-balik pas kerja tim. Di Laravel, beres lewat Migration.',
  },
  {
    id: 'scene2',
    shortLabel: 'Blueprint',
    title: '02. Analogi Cetak Biru & Kode PHP',
    startFrame: SCENE_DURATIONS.scene1,
    duration: SCENE_DURATIONS.scene2,
    accent: '#2563EB',
    voSummary:
      'Migration itu kayak cetak biru bangunan. Gak perlu nyusun batu bata manual—cukup tulis daftar kolom dan tipe datanya langsung di file PHP.',
  },
  {
    id: 'scene3',
    shortLabel: 'Migrate',
    title: '03. Simulasi php artisan migrate',
    startFrame: SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2,
    duration: SCENE_DURATIONS.scene3,
    accent: '#10B981',
    voSummary:
      'Tulis string nama & integer harga, jalankan php artisan migrate—semua baris kode meluncur otomatis menyusun struktur tabel dari atas ke bawah.',
  },
  {
    id: 'scene4',
    shortLabel: 'Rollback',
    title: '04. Tombol Undo — Rollback',
    startFrame:
      SCENE_DURATIONS.scene1 + SCENE_DURATIONS.scene2 + SCENE_DURATIONS.scene3,
    duration: SCENE_DURATIONS.scene4,
    accent: '#F59E0B',
    voSummary:
      'Salah bikin kolom? Santai. Ketik migrate:rollback, struktur tabel langsung terlipat rapi kembali seperti tombol undo di database kamu.',
  },
  {
    id: 'scene5',
    shortLabel: 'Outro',
    title: '05. Ringkasan & Developer Outro',
    startFrame:
      SCENE_DURATIONS.scene1 +
      SCENE_DURATIONS.scene2 +
      SCENE_DURATIONS.scene3 +
      SCENE_DURATIONS.scene4,
    duration: SCENE_DURATIONS.scene5,
    accent: '#0F172A',
    voSummary:
      'Migration bikin struktur database rapi, tercatat di Git, dan ramah tim. Cek eksplorasi kode di github.com/RaihaanHumris.',
  },
];

interface VoCue {
  startSec: number;
  endSec: number;
  text: string;
}

const VO_CUES: VoCue[] = [
  {
    startSec: 0,
    endSec: 4.9,
    text: 'Masih sering bikin tabel database dengan klik-klik manual satu per satu di phpMyAdmin?',
  },
  {
    startSec: 4.9,
    endSec: 10.8,
    text: 'Kebayang ribetnya pas kerja tim. Tiap ada kolom baru harus export-import file SQL bolak-balik.',
  },
  {
    startSec: 10.8,
    endSec: 14.8,
    text: 'Di Laravel, semua itu beres cukup lewat migration.',
  },
  {
    startSec: 14.8,
    endSec: 19.9,
    text: 'Gampangnya, anggap aja migration itu kayak cetak biru atau blueprint sebuah bangunan.',
  },
  {
    startSec: 19.9,
    endSec: 27.8,
    text: 'Kamu gak perlu nyusun batu bata manual di database. Cukup tulis daftar kolom dan tipe datanya langsung di dalam file kode PHP.',
  },
  {
    startSec: 27.8,
    endSec: 33.1,
    text: 'Lihat prosesnya. Begitu kamu tulis baris seperti string nama dan integer harga,',
  },
  {
    startSec: 33.1,
    endSec: 37.7,
    text: 'lalu jalanin satu perintah ajaib di terminal, php artisan migrate,',
  },
  {
    startSec: 37.7,
    endSec: 43.8,
    text: 'semua baris kode tadi otomatis meluncur ke database dan nyusun struktur tabelnya dari atas ke bawah.',
  },
  {
    startSec: 43.8,
    endSec: 48.4,
    text: 'Salah bikin kolom? Santai. Tinggal ketik migrate rollback.',
  },
  {
    startSec: 48.4,
    endSec: 53.0,
    text: 'Struktur tabelnya langsung terlipat rapi kembali seperti tombol undo di database kamu.',
  },
  {
    startSec: 53.0,
    endSec: 59.5,
    text: 'Intinya, migration bikin struktur databasemu rapi, tercatat di Git, dan gampang dibagikan ke tim.',
  },
  {
    startSec: 59.5,
    endSec: 65.0,
    text: 'Cek eksplorasi kode lainnya di GitHub saya. Sampai ketemu di episode berikutnya.',
  },
];

const SOURCE_FILES = [
  { path: 'src/Root.tsx', code: rootCode },
  { path: 'src/Main.tsx', code: mainCode },
  { path: 'src/components/GridBackground.tsx', code: gridCode },
  { path: 'src/scenes/Scene1Hook.tsx', code: scene1Code },
  { path: 'src/scenes/Scene2Blueprint.tsx', code: scene2Code },
  { path: 'src/scenes/Scene3MigrateFlow.tsx', code: scene3Code },
  { path: 'src/scenes/Scene4Rollback.tsx', code: scene4Code },
  { path: 'src/scenes/Scene5Outro.tsx', code: scene5Code },
];

const SETUP_COMMANDS = `npx create-video@latest laravel-migration-video
cd laravel-migration-video
npm install @remotion/google-fonts
# Copy voiceover MP3 ke public/ dan 8 file sumber ke src/, lalu jalankan:
npm run dev`;

function formatTimecode(frame: number): string {
  const totalSec = frame / FPS;
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  const tenths = Math.floor((totalSec % 1) * 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
}

class StudioErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">
              Terjadi kendala saat memuat studio
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {this.state.error.message}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Muat Ulang
              </button>
              <a
                href={MP4_URL}
                download={MP4_FILENAME}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FF2D20] rounded-lg hover:bg-[#E02419]"
              >
                <Download className="w-3.5 h-3.5" />
                Download MP4 Langsung
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function StudioContent() {
  const playerRef = useRef<PlayerRef>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stageMode, setStageMode] = useState<'mp4' | 'remotion'>('mp4');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [activeFilePath, setActiveFilePath] = useState(SOURCE_FILES[0].path);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (stageMode !== 'remotion') return;
    const player = playerRef.current;
    if (!player) return;

    const handleFrame = () => setCurrentFrame(player.getCurrentFrame());
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    player.addEventListener('frameupdate', handleFrame);
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);
    player.addEventListener('ended', handleEnded);

    return () => {
      player.removeEventListener('frameupdate', handleFrame);
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
      player.removeEventListener('ended', handleEnded);
    };
  }, [stageMode]);

  const activeScene = useMemo(() => {
    return (
      SCENES.find(
        (s) =>
          currentFrame >= s.startFrame && currentFrame < s.startFrame + s.duration
      ) ?? SCENES[SCENES.length - 1]
    );
  }, [currentFrame]);

  const activeCue = useMemo(() => {
    const sec = currentFrame / FPS;
    return (
      VO_CUES.find((c) => sec >= c.startSec && sec < c.endSec) ??
      VO_CUES[VO_CUES.length - 1]
    );
  }, [currentFrame]);

  const seekToFrame = (frame: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION - 1, frame));
    setCurrentFrame(clamped);
    if (stageMode === 'remotion') {
      playerRef.current?.seekTo(clamped);
    } else if (videoRef.current) {
      videoRef.current.currentTime = clamped / FPS;
    }
  };

  const togglePlay = () => {
    if (stageMode === 'remotion') {
      const player = playerRef.current;
      if (!player) return;
      if (isPlaying) {
        player.pause();
      } else {
        if (currentFrame >= TOTAL_DURATION - 2) {
          player.seekTo(0);
        }
        player.play();
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.currentTime >= 64.9) {
        video.currentTime = 0;
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    if (stageMode === 'remotion') {
      const player = playerRef.current;
      if (!player) return;
      if (isMuted) {
        player.unmute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleDownloadMp4 = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('Menyiapkan file MP4 (17.1 MB)...');

    try {
      const response = await fetch(MP4_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentLength = Number(
        response.headers.get('content-length') || 17124425
      );
      const reader = response.body?.getReader();
      let blob: Blob;

      if (reader) {
        const chunks: BlobPart[] = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(new Uint8Array(value));
            received += value.length;
            const pct = Math.min(99, Math.round((received / contentLength) * 100));
            setDownloadProgress(pct);
            setDownloadStatus(`Mengunduh MP4... ${pct}%`);
          }
        }
        blob = new Blob(chunks, { type: 'video/mp4' });
      } else {
        const rawBlob = await response.blob();
        blob = new Blob([rawBlob], { type: 'video/mp4' });
      }

      setDownloadProgress(100);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = MP4_FILENAME;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      setDownloadStatus(
        'Berhasil diunduh: laravel-migration-eps02.mp4 (H.264 + AAC, 1080p)'
      );
    } catch {
      setStageMode('mp4');
      setDownloadStatus(
        'Klik ikon ⋮ (Download) di pojok kanan bawah pemutar video atau Klik Kanan -> Save Video As.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
    });
  };

  const selectedSourceFile =
    SOURCE_FILES.find((f) => f.path === activeFilePath) ?? SOURCE_FILES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#stage"
            onClick={(e) => {
              e.preventDefault();
              seekToFrame(0);
            }}
            className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Laravel Migration Studio
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {SCENES.map((scene) => {
              const isCurrent = activeScene.id === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => seekToFrame(scene.startFrame)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isCurrent
                      ? 'text-slate-950 border-[#FF2D20]'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  {scene.shortLabel}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadMp4}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FF2D20] rounded-lg hover:bg-[#E02419] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{downloadProgress}% MP4</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4 (17 MB)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Stage */}
      <main
        id="stage"
        className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8 flex flex-col gap-6"
      >
        {/* Header Metadata & Stage Mode Switcher */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Laravel Database Migration — Kinetic Explainer
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500 flex flex-wrap items-center gap-2">
              <span>MP4 (H.264 + AAC)</span>
              <span aria-hidden="true">·</span>
              <span>1920 × 1080</span>
              <span aria-hidden="true">·</span>
              <span>30 fps</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">1,950 frames (65.0s)</span>
              <span aria-hidden="true">·</span>
              <span>17.1 MB</span>
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setStageMode('mp4');
                setIsPlaying(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                stageMode === 'mp4'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Video MP4 Final
            </button>
            <button
              type="button"
              onClick={() => {
                setStageMode('remotion');
                setIsPlaying(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                stageMode === 'remotion'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Remotion Live Canvas
            </button>
          </div>
        </div>

        {/* Two-Zone Layout: Dominant Video Canvas + Scene Breakdown Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Main 16:9 Stage */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm aspect-video">
              {stageMode === 'mp4' ? (
                <video
                  ref={videoRef}
                  src={`${MP4_URL}#t=2`}
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={(e) => {
                    const sec = e.currentTarget.currentTime;
                    setCurrentFrame(
                      Math.min(TOTAL_DURATION - 1, Math.floor(sec * FPS))
                    );
                  }}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <>
                  <Player
                    ref={playerRef}
                    component={Main}
                    durationInFrames={TOTAL_DURATION}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={FPS}
                    initialFrame={65}
                    acknowledgeRemotionLicense
                    style={{ width: '100%', height: '100%' }}
                    controls={false}
                    clickToPlay
                    spaceKeyToPlayOrPause
                  />
                  {!isPlaying && currentFrame === 0 && (
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute inset-0 bg-slate-950/15 hover:bg-slate-950/25 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
                    >
                      <span className="w-16 h-16 rounded-full bg-[#FF2D20] text-white flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      </span>
                      <span className="text-sm font-bold text-slate-900 bg-white/95 px-4 py-1.5 rounded-lg shadow-xs">
                        Putar Pratinjau Remotion dengan Voiceover
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Tactile Transport & Proportional Scene Scrubber */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
              {/* Scene Timeline Track */}
              <div className="relative flex items-center gap-1 h-9">
                {SCENES.map((scene) => {
                  const widthPct = (scene.duration / TOTAL_DURATION) * 100;
                  const sceneProgress = Math.max(
                    0,
                    Math.min(1, (currentFrame - scene.startFrame) / scene.duration)
                  );
                  const isCurrent = activeScene.id === scene.id;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => seekToFrame(scene.startFrame)}
                      style={{ width: `${widthPct}%` }}
                      className={`relative h-full rounded-md overflow-hidden border text-left px-2.5 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border-slate-400 bg-slate-100'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                      title={`${scene.title} (${formatTimecode(scene.startFrame)})`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 opacity-20 pointer-events-none"
                        style={{
                          width: `${sceneProgress * 100}%`,
                          backgroundColor: scene.accent,
                        }}
                      />
                      <span className="relative z-10 block text-[11px] font-semibold text-slate-700 truncate">
                        {scene.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Fine Frame Range Slider */}
              <input
                type="range"
                min={0}
                max={TOTAL_DURATION - 1}
                value={currentFrame}
                onChange={(e) => seekToFrame(Number(e.target.value))}
                aria-label="Timeline frame scrubber"
                className="w-full accent-[#FF2D20] cursor-pointer h-1.5"
              />

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FF2D20] rounded-lg hover:bg-[#E02419] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Play with VO
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => seekToFrame(currentFrame - 30)}
                    aria-label="Back 1 second"
                    className="p-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => seekToFrame(currentFrame + 30)}
                    aria-label="Forward 1 second"
                    className="p-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => seekToFrame(0)}
                    aria-label="Restart video"
                    className="p-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute voiceover' : 'Mute voiceover'}
                    className="p-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <span className="ml-1 text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {formatTimecode(currentFrame)} / {formatTimecode(TOTAL_DURATION)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Remotion Code
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadMp4}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunduh {downloadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .MP4 (1080p)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {downloadStatus && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-emerald-700">
                    {downloadStatus}
                  </span>
                  <a
                    href={MP4_URL}
                    download={MP4_FILENAME}
                    className="text-slate-600 underline hover:text-slate-900"
                  >
                    Tautan Langsung (.mp4)
                  </a>
                </div>
              )}
            </div>

            {/* Active Voiceover Sync Caption Bar */}
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
                Voiceover Cue
              </div>
              <p className="text-sm font-medium text-slate-900 flex-1 sm:text-right">
                “{activeCue.text}”
              </p>
            </div>
          </div>

          {/* Right Deck: Scene Cue Sheet */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            <div className="p-4">
              <h2 className="text-sm font-bold text-slate-900">Scene Cue Sheet</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Klik scene untuk langsung melompat ke bagian tersebut.
              </p>
            </div>

            {SCENES.map((scene) => {
              const isCurrent = activeScene.id === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => seekToFrame(scene.startFrame)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    isCurrent ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-[#FF2D20]' : 'text-slate-900'
                      }`}
                    >
                      {scene.title}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] font-mono tabular-nums text-slate-500">
                    {formatTimecode(scene.startFrame)} –{' '}
                    {formatTimecode(scene.startFrame + scene.duration)} ·{' '}
                    {scene.duration}f
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {scene.voSummary}
                  </p>
                </button>
              );
            })}
          </aside>
        </div>
      </main>

      {/* Remotion Source Code & CLI Setup Drawer Modal */}
      {showCodeModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Remotion Source Code"
        >
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Remotion Project Source Files
                </h2>
                <p className="text-xs text-slate-500">
                  Zero-config React + TypeScript composition ready for npx
                  create-video@latest.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCodeModal(false)}
                aria-label="Close code viewer"
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
              <pre className="text-xs font-mono text-slate-800 overflow-x-auto">
                {SETUP_COMMANDS}
              </pre>
              <button
                type="button"
                onClick={() => copyText('setup', SETUP_COMMANDS)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedId === 'setup' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy CLI
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto p-3 flex flex-col gap-1 bg-white">
                {SOURCE_FILES.map((file) => {
                  const isActive = file.path === selectedSourceFile.path;
                  return (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => setActiveFilePath(file.path)}
                      className={`text-left px-3 py-2 rounded-lg font-mono text-xs transition-colors cursor-pointer truncate ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {file.path}
                    </button>
                  );
                })}
              </div>

              <div className="md:col-span-8 flex flex-col min-h-0 bg-slate-950 text-slate-100">
                <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-slate-300">
                    {selectedSourceFile.path}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(selectedSourceFile.path, selectedSourceFile.code)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-200 bg-slate-800 rounded-md hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedId === selectedSourceFile.path ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy File
                      </>
                    )}
                  </button>
                </div>
                <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed font-mono text-slate-200">
                  <code>{selectedSourceFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudioErrorBoundary>
      <StudioContent />
    </StudioErrorBoundary>
  );
}
