'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, SkipForward, Volume2 } from 'lucide-react';
import { revealConfig, type TimelineItem } from '@/reveal.config';
import { useRevealTimeline } from '@/hooks/use-reveal-timeline';

const sceneMotion = {
  initial: { opacity: 0, y: 14, filter: 'blur(5px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
  transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] as const },
};
function IntroScreen({ onStart, error }: { onStart: () => void; error: boolean }) {
  return <motion.section className="intro-card" {...sceneMotion}><p className="eyebrow">Uma história para guardar</p><h1>Luan <span>&amp;</span> Sarah</h1><p className="intro-copy">Uma história de amor está prestes a ganhar um novo capítulo.</p><p className="instruction">Quando estiverem juntos, apertem o botão abaixo.</p><button type="button" className="start-button" onClick={onStart}>Começar</button>{error && <p className="audio-error" role="alert">Não foi possível iniciar o som. Toque novamente.</p>}</motion.section>;
}
function StoryScene({ stage }: { stage: TimelineItem }) {
  return <motion.section className="scene story-scene" {...sceneMotion}><span className="ornament" /><p>{stage.text}</p></motion.section>;
}
function PreparationScene({ stage }: { stage: TimelineItem }) {
  return <motion.section className="scene preparation-scene" {...sceneMotion}><p>{stage.text}</p><span className="breath-line" /></motion.section>;
}
function CountdownScene({ stage }: { stage: TimelineItem }) {
  return <motion.section className="scene countdown-scene" {...sceneMotion}><p aria-label={`Contagem: ${stage.text}`}>{stage.text}</p></motion.section>;
}
function RevealScene({ stage, ended }: { stage: TimelineItem; ended: boolean }) {
  if (ended) return <motion.section className="scene final-scene" {...sceneMotion}><p className="final-title">Esther Lima está chegando.</p><span /><p>Uma bênção de Deus.<br />Um novo capítulo na história de Luan e Sarah.</p><small>Esse momento agora é de vocês.</small></motion.section>;
  if (stage.kind === 'reveal') return <motion.section className="scene reveal-scene" {...sceneMotion}><p>{stage.text}</p></motion.section>;
  if (stage.kind === 'nameIntro') return <motion.section className="scene name-intro-scene" {...sceneMotion}><p>{stage.text}</p></motion.section>;
  if (stage.kind === 'name') return <motion.section className="scene name-scene" {...sceneMotion}><p>{stage.text}</p></motion.section>;
  return <motion.section className="scene final-scene" {...sceneMotion}><p className="final-title">{stage.text}</p><span /><p>Uma bênção de Deus.<br />Um novo capítulo na história de Luan e Sarah.</p></motion.section>;
}
function Scene({ stage, ended }: { stage: TimelineItem; ended: boolean }) {
  if (ended || ['reveal', 'nameIntro', 'name', 'final'].includes(stage.kind)) return <RevealScene stage={stage} ended={ended} />;
  if (stage.kind === 'countdown') return <CountdownScene stage={stage} />;
  if (stage.kind === 'preparation') return <PreparationScene stage={stage} />;
  return <StoryScene stage={stage} />;
}
function AudioController({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return <button className="audio-control" type="button" onClick={onToggle} aria-label={paused ? 'Continuar música' : 'Pausar música'}>{paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}</button>;
}
function ProgressBar({ progress }: { progress: number }) {
  return <div className="progress-track" role="progressbar" aria-label="Progresso da experiência" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><motion.span animate={{ width: `${progress}%` }} transition={{ duration: .2 }} /></div>;
}
export function RevealExperience() {
  const timeline = useRevealTimeline();
  const isRevealed = timeline.ended || ['reveal', 'nameIntro', 'name', 'final'].includes(timeline.stage.kind);
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true';
  return <main className={`experience-shell ${isRevealed ? 'is-revealed' : ''}`}>
    <audio ref={timeline.audioRef} src={revealConfig.audioSrc} preload="metadata" onEnded={timeline.onEnded} />
    <div className="ambient-light" aria-hidden="true" /><div className="grain" aria-hidden="true" />
    <div className="floating-specks" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
    <AnimatePresence mode="wait">{!timeline.started ? <IntroScreen key="intro" onStart={timeline.start} error={timeline.audioError} /> : <Scene key={timeline.ended ? 'ended' : timeline.stage.id} stage={timeline.stage} ended={timeline.ended} />}</AnimatePresence>
    {!timeline.started && <p className="sound-note"><Volume2 size={11} /> Uma experiência com som</p>}
    {timeline.started && <><ProgressBar progress={timeline.progress} /><AudioController paused={timeline.paused} onToggle={timeline.togglePlayback} /></>}
    {debug && timeline.started && <aside className="debug-panel"><strong>Modo de ajuste</strong><span>{timeline.currentTime.toFixed(1)}s · {timeline.stage.id}</span><div><button type="button" onClick={() => timeline.seek(timeline.currentTime - 5)}><RotateCcw size={14} /> 5s</button><button type="button" onClick={timeline.previousStage}>Anterior</button><button type="button" onClick={timeline.nextStage}>Próxima <SkipForward size={14} /></button></div></aside>}
  </main>;
}
