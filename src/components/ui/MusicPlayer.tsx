import { useEffect, useRef, useState } from 'react'
import { Music2, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { portfolio } from '../../config/portfolio'
export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(.35)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState(false)
  const available = Boolean(portfolio.audio) && !error
  useEffect(() => { if (audio.current) { audio.current.volume = volume; audio.current.muted = muted } }, [volume, muted])
  async function toggle() {
    if (!audio.current) return
    if (playing) { audio.current.pause(); setPlaying(false) }
    else { try { await audio.current.play(); setPlaying(true) } catch { setError(true); setPlaying(false) } }
  }
  return <div className="music-player">
    {portfolio.audio && <audio ref={audio} src={portfolio.audio} loop preload="none" onError={() => { setError(true); setPlaying(false) }} />}
    <span className="music-art"><Music2 size={17} /></span>
    <div className="music-label"><strong>World ambience</strong><span>{available ? playing ? 'A little sound, a little magic' : 'Press play to unwind' : error ? 'Audio unavailable' : 'Soundtrack coming soon'}</span></div>
    <button aria-label={playing ? 'Pause music' : 'Play music'} disabled={!available} onClick={toggle}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>
    <button aria-label={muted ? 'Unmute music' : 'Mute music'} disabled={!available} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
    <input aria-label="Music volume" type="range" min="0" max="1" step=".01" value={volume} disabled={!available} onChange={e => setVolume(Number(e.target.value))} />
  </div>
}
