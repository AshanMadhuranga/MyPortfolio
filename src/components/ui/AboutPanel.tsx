import { motion } from 'motion/react'
import { BookOpen, Code2, Gem, ArrowUpRight } from 'lucide-react'
import { portfolio, type AboutObject } from '../../config/portfolio'

const icons = [Code2, BookOpen, Gem]
export function AboutPanel({ visible, onExplore, onHome }: { visible: boolean; onExplore: (object: AboutObject) => void; onHome: () => void }) {
  return <motion.section className="about-panel" aria-labelledby="about-heading" aria-hidden={!visible} inert={!visible}
    initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }} transition={{ duration: .55 }}>
    <div className="chapter-label"><span /> CHAPTER TWO · {portfolio.about.location.toUpperCase()}</div>
    <h1 id="about-heading">{portfolio.about.heading}</h1>
    <p className="about-subtitle">{portfolio.about.subtitle}</p>
    <p className="about-introduction">{portfolio.about.introduction}</p>
    <div className="about-areas">{portfolio.about.areas.map((area, index) => {
      const Icon = icons[index]
      return <button className="about-area" id={`explore-${area.id}`} key={area.id} onClick={() => onExplore(area.id as AboutObject)} aria-label={`${area.title}. ${area.object}`} aria-haspopup="dialog">
        <span className="about-area-icon"><Icon size={18} /></span><span><strong>{area.title}</strong><span className="about-area-text">{area.text}</span><small>{area.object} <ArrowUpRight size={11} /></small></span>
      </button>
    })}</div>
    <button className="about-home" onClick={onHome}>← Back to the beginning</button>
  </motion.section>
}
