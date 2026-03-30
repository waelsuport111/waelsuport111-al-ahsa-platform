import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden luxury-grid">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,179,106,0.08),transparent_30%),linear-gradient(180deg,rgba(4,7,15,0.2),rgba(4,7,15,0.85))]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="glass rounded-full px-5 py-2 text-sm tracking-[0.28em] text-white/80 uppercase">
          Al Ahsa
        </div>

        <nav className="hidden items-center gap-3 md:flex">
          <span className="glass rounded-full px-4 py-2 text-sm text-white/70">
            Premium Destination Platform
          </span>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl items-center px-6 pb-10 pt-4 md:px-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.25em] text-white/60 uppercase">
              Interactive Saudi Experience
            </div>

            <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-white md:text-7xl">
              A refined digital gateway to
              <span className="gold-text"> Al Ahsa</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              Explore landmarks, culture, hospitality, and immersive spatial
              experiences through a premium map-based destination platform built
              for elegance, clarity, and Saudi-level presentation.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/map"
                className="gold-ring rounded-full bg-[#d6b36a] px-7 py-3 text-sm font-medium tracking-[0.18em] text-black uppercase transition hover:scale-[1.02]"
              >
                Enter Platform
              </Link>

              <div className="glass rounded-full px-5 py-3 text-sm text-white/70">
                Luxury UI • Private CMS Later • Google Maps Ready
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-[32px] p-5 md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.24em] text-white/45 uppercase">
                  Experience Preview
                </p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-white">
                  Premium spatial destination view
                </h2>
              </div>
              <div className="rounded-full border border-[#d6b36a]/25 px-3 py-1 text-xs text-[#d6b36a]">
                Vision 2030 Feel
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#0b1324_0%,#111c31_100%)] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,179,106,0.18),transparent_28%)]" />

              <div className="relative space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-xs tracking-[0.2em] text-white/45 uppercase">
                    Destinations
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">Curated</p>
                  <p className="mt-2 text-sm text-white/60">
                    Landmarks, hospitality, heritage, culture, and immersive locations.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-white/55">Map-first luxury UI</p>
                    <p className="mt-2 text-xl font-medium text-white">
                      Floating panels
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-white/55">Content management</p>
                    <p className="mt-2 text-xl font-medium text-white">
                      Private dashboard
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-[#d6b36a]/30 bg-[#d6b36a]/7 p-4 text-sm leading-7 text-white/75">
                  This is only the luxury landing shell. Next step will build the
                  full-screen interactive map page on a separate route.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}