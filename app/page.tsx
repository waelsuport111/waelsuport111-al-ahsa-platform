"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-[#030712] text-white">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <img
          src="/bg.jpg"
          alt="Al Ahsa"
          className="absolute inset-0 h-full w-full object-cover scale-105 opacity-35"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,140,60,0.18),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.45),rgba(2,6,23,0.82),rgba(2,6,23,1))]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-12 pt-8">
          {/* TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-white/10 bg-white/10" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  Al Ahsa
                </p>
                <p className="text-sm font-medium text-white/85">Immersive Platform</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/map")}
              className="rounded-full border border-white/10 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              Open Platform
            </button>
          </motion.div>

          {/* HERO CONTENT */}
          <div className="flex flex-1 items-center">
            <div className="grid w-full items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-4xl"
              >
                <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-[#d6c28d]">
                  Vision 2030 • Smart City • Tourism • Heritage
                </p>

                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl xl:text-[92px]">
                  Discover Al Ahsa Through a Premium Digital Experience
                </h1>

                <p className="mt-8 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                  A luxury interactive gateway that connects tourism, culture,
                  heritage, and municipal intelligence into one immersive
                  platform designed for the future of Al Ahsa.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => router.push("/map")}
                    className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]"
                  >
                    Explore Interactive Map
                  </button>

                  <div className="rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/60 backdrop-blur-xl">
                    Premium Spatial Platform for Al Ahsa
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.05 }}
                className="grid gap-4"
              >
                <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                    Tourism
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    Destination Discovery
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    Showcase landmarks, attractions, and experiences with a
                    premium visual interface that invites exploration.
                  </p>
                </div>

                <div className="rounded-[30px] border border-[#d6c28d]/20 bg-[linear-gradient(135deg,rgba(214,194,141,0.12),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#d6c28d]">
                    Heritage
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    Cultural Storytelling
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    Bring Al Ahsa’s identity to life through immersive,
                    narrative-driven digital presentation and location-based
                    storytelling.
                  </p>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                    Smart City
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    Municipal Intelligence
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    A future-ready framework for municipalities to manage,
                    present, and activate spaces through digital twins and
                    spatial intelligence.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* BOTTOM METRICS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="grid gap-4 md:grid-cols-3"
          >
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                Experience
              </p>
              <p className="mt-3 text-2xl font-semibold">Immersive Mapping</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                Platform
              </p>
              <p className="mt-3 text-2xl font-semibold">Tourism + Heritage + City</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                Direction
              </p>
              <p className="mt-3 text-2xl font-semibold">Saudi Vision 2030</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d6c28d]">
              Why This Platform
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Built for Presentation, Planning, and Promotion
            </h2>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-semibold">Luxury Destination Experience</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Present Al Ahsa through a modern digital journey that elevates
                perception and creates stronger destination engagement.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-semibold">Official-Grade City Interface</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                A premium interface suitable for municipalities, authorities,
                strategic presentations, and institutional deployment.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-semibold">Immersive Spatial Storytelling</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Merge location, culture, visuals, and exploration into one
                platform that feels future-facing and memorable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="border-y border-white/6 bg-[linear-gradient(to_bottom,#050b16,#030712)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs uppercase tracking-[0.35em] text-[#d6c28d]">
            Platform Pillars
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8">
              <h3 className="text-3xl font-semibold tracking-tight">Tourism</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Inspire visitors and stakeholders with high-end digital access
                to attractions, destinations, and experiences.
              </p>
            </div>

            <div className="rounded-[30px] border border-[#d6c28d]/20 bg-[linear-gradient(180deg,rgba(214,194,141,0.10),rgba(255,255,255,0.03))] p-8">
              <h3 className="text-3xl font-semibold tracking-tight">Heritage</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Preserve and present identity through elegant storytelling and
                immersive heritage-led exploration.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8">
              <h3 className="text-3xl font-semibold tracking-tight">Smart City</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Support planning, communication, and urban experience design
                through next-generation spatial platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#d6c28d]">
          Begin the Experience
        </p>

        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Enter the Interactive Map of Al Ahsa
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
          Access the immersive spatial layer of Al Ahsa and explore the future
          of tourism, heritage, and municipality presentation.
        </p>

        <button
          onClick={() => router.push("/map")}
          className="mt-10 rounded-full bg-white px-12 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]"
        >
          Open Interactive Map
        </button>
      </section>

      <div className="pb-10 text-center text-xs tracking-[0.35em] text-white/35">
        POWERED BY DARI 966
      </div>
    </main>
  );
}