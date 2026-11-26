import Nav from './Nav'
import { useReveal, useScrollProgress } from './hooks'
import Hero from './sections/Hero'
import Ticker from './sections/Ticker'
import Problem from './sections/Problem'
import Workflow from './sections/Workflow'
import Pillars from './sections/Pillars'
import Features from './sections/Features'
import Booth from './sections/Booth'
import Footer from './sections/Footer'

export default function App() {
  useReveal()
  useScrollProgress()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-forest-900 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-cream"
      >
        Lewati ke konten
      </a>

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-gold"
        style={{ transform: 'scaleX(var(--scroll, 0))' }}
      />

      <Nav />

      <main id="main">
        <Hero />
        <Ticker />
        <Problem />
        <Workflow />
        <Pillars />
        <Features />
        <Booth />
      </main>

      <Footer />
    </>
  )
}
