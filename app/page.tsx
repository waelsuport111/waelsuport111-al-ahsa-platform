"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-[#030712] text-white">
      <section className="relative overflow-hidden">
        <img
          src="/bg.jpg"
          alt="Al Ahsa"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,140,60,0.14),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.42),rgba(2,6,23,0.82),rgba(2,6,23,1))]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        <div className="absolute inset-0 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_30%_20%,rgba(214,194,141,0.7),transparent_40%)] opacity-[0.06]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-12 pt-6 md:px-6 md:pt-8">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 rounded-[28px] border border-white/6 bg-white/[0.045] px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-full bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
              <div className="min-w-0">
                <p className="truncate text-[11px] uppercase tracking-[0.35em] text-white/40">
                  Al Ahsa
                </p>
                <p className="truncate text-sm font-medium text-white/85">
                  Immersive Platform
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/map")}
              className="self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90 sm:self-auto"
            >
              Open Platform
            </button>
          </motion.div>

          <div className="flex flex-1 items-center py-10 md:py-14 xl:py-16">
            <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
              >
                <p className="mb-5 text-[11px] uppercase tracking-[0.38em] text-[#d6c28d] md:tracking-[0.45em]">
                  Vision 2030 • Smart City • Tourism • Heritage
                </p>

                <h1 className="max-w-4xl bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-[44px] font-semibold leading-[0.95] tracking-tight text-transparent sm:text-[58px] md:text-[72px] xl:text-[88px] 2xl:text-[96px]">
                  Discover Al Ahsa Through a Premium Digital Experience
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                  A luxury interactive gateway that connects tourism, culture,
                  heritage, and municipal intelligence into one immersive
                  platform designed for the future of Al Ahsa.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => router.push("/map")}
                    className="relative overflow-hidden rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-500 hover:scale-[1.03] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.16)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
                  >
                    <span className="relative z-10">Explore Interactive Map</span>
                  </button>

                  <div className="rounded-full bg-white/[0.045] px-5 py-4 text-sm text-white/60 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    Premium Spatial Platform for Al Ahsa
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.2 }}
                className="grid gap-4 self-start"
              >
                <motion.div
                  variants={fadeUp}
                  className="rounded-[28px] bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-6"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                    Tourism
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    Destination Discovery
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Showcase landmarks, attractions, and experiences with a
                    premium visual interface that invites exploration.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-[28px] bg-[linear-gradient(135deg,rgba(214,194,141,0.10),rgba(255,255,255,0.035))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-6"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-[#d6c28d]">
                    Heritage
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    Cultural Storytelling
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    Bring Al Ahsa’s identity to life through immersive,
                    narrative-driven digital presentation and location-based
                    storytelling.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-[28px] bg-white/[0.05] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-6"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                    Smart City
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    Municipal Intelligence
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    A future-ready framework for municipalities to manage,
                    present, and activate spaces through digital twins and
                    spatial intelligence.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4 pt-2 md:grid-cols-3"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-[22px] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                Experience
              </p>
              <p className="mt-3 text-2xl font-semibold">Immersive Mapping</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[22px] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                Platform
              </p>
              <p className="mt-3 text-2xl font-semibold">
                Tourism + Heritage + City
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[22px] bg-white/[0.04] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                Direction
              </p>
              <p className="mt-3 text-2xl font-semibold">Saudi Vision 2030</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d6c28d]">
              Why This Platform
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Built for Presentation, Planning, and Promotion
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-4"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-[28px] bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <h3 className="text-2xl font-semibold">
                Luxury Destination Experience
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Present Al Ahsa through a modern digital journey that elevates
                perception and creates stronger destination engagement.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[28px] bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <h3 className="text-2xl font-semibold">
                Official-Grade City Interface
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                A premium interface suitable for municipalities, authorities,
                strategic presentations, and institutional deployment.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[28px] bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <h3 className="text-2xl font-semibold">
                Immersive Spatial Storytelling
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Merge location, culture, visuals, and exploration into one
                platform that feels future-facing and memorable.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[linear-gradient(to_bottom,#050b16,#030712)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.p
            {...fadeUp}
            className="text-center text-xs uppercase tracking-[0.35em] text-[#d6c28d]"
          >
            Platform Pillars
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-[30px] bg-white/[0.04] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <h3 className="text-3xl font-semibold tracking-tight">Tourism</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Inspire visitors and stakeholders with high-end digital access
                to attractions, destinations, and experiences.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[30px] bg-[linear-gradient(180deg,rgba(214,194,141,0.10),rgba(255,255,255,0.03))] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <h3 className="text-3xl font-semibold tracking-tight">Heritage</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Preserve and present identity through elegant storytelling and
                immersive heritage-led exploration.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[30px] bg-white/[0.04] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <h3 className="text-3xl font-semibold tracking-tight">Smart City</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Support planning, communication, and urban experience design
                through next-generation spatial platforms.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-28 text-center">
        <motion.p
          {...fadeUp}
          className="text-xs uppercase tracking-[0.35em] text-[#d6c28d]"
        >
          Begin the Experience
        </motion.p>

        <motion.h2
          {...fadeUp}
          className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Enter the Interactive Map of Al Ahsa
        </motion.h2>

        <motion.p
          {...fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65"
        >
          Access the immersive spatial layer of Al Ahsa and explore the future
          of tourism, heritage, and municipality presentation.
        </motion.p>

        <motion.button
          {...fadeUp}
          onClick={() => router.push("/map")}
          className="mt-10 rounded-full bg-white px-12 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]"
        >
          Open Interactive Map
        </motion.button>
      </section>

      <div className="pb-10 text-center text-xs tracking-[0.35em] text-white/35">
        POWERED BY DARI 966
      </div>
    </main>
  );
}