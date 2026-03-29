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
        {/* Background */}
        <img
          src="/bg.jpg"
          alt="Al Ahsa"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,140,60,0.14),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.42),rgba(2,6,23,0.82),rgba(2,6,23,1))]" />

        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        {/* Luxury glow animation */}
        <div className="absolute inset-0 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_30%_20%,rgba(214,194,141,0.7),transparent_40%)] opacity-[0.06]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-12 pt-6 md:px-6 md:pt-8">
          
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4 rounded-[28px] border border-white/6 bg-white/[0.045] px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white/[0.07]" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">
                  Al Ahsa
                </p>
                <p className="text-sm font-medium text-white/85">
                  Immersive Platform
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/map")}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Open Platform
            </button>
          </motion.div>

          {/* Hero */}
          <div className="flex flex-1 items-center py-10 md:py-14 xl:py-16">
            <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr]">

              {/* LEFT */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-4xl"
              >
                <p className="mb-5 text-[11px] uppercase tracking-[0.38em] text-[#d6c28d]">
                  Vision 2030 • Smart City • Tourism • Heritage
                </p>

                {/* ✅ UPDATED LUXURY HEADLINE */}
                <h1 className="max-w-3xl bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-[36px] font-semibold leading-[1.05] tracking-tight text-transparent sm:text-[48px] md:text-[60px] xl:text-[72px] 2xl:text-[80px]">
                  Discover Al Ahsa Through a Premium Digital Experience
                </h1>

                {/* Description */}
                <p className="mt-8 max-w-xl text-[15px] leading-7 text-white/60 md:text-base">
                  A luxury interactive gateway that connects tourism, culture,
                  heritage, and municipal intelligence into one immersive
                  platform designed for the future of Al Ahsa.
                </p>

                {/* Buttons */}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => router.push("/map")}
                    className="relative overflow-hidden rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.16)]"
                  >
                    Explore Interactive Map
                  </button>

                  <div className="rounded-full bg-white/[0.045] px-5 py-4 text-sm text-white/60">
                    Premium Spatial Platform for Al Ahsa
                  </div>
                </div>
              </motion.div>

              {/* RIGHT CARDS */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                className="grid gap-4"
              >
                {[
                  {
                    title: "Destination Discovery",
                    label: "Tourism",
                  },
                  {
                    title: "Cultural Storytelling",
                    label: "Heritage",
                  },
                  {
                    title: "Municipal Intelligence",
                    label: "Smart City",
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="rounded-[28px] bg-white/[0.05] p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07]"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                      {card.label}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      {card.title}
                    </h3>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Bottom Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid gap-4 pt-6 md:grid-cols-3"
          >
            {["Immersive Mapping", "Tourism + Heritage + City", "Saudi Vision 2030"].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-[22px] bg-white/[0.04] p-5"
              >
                <p className="mt-2 text-xl font-semibold">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 text-center">
        <motion.h2
          {...fadeUp}
          className="mx-auto max-w-4xl text-4xl font-semibold md:text-6xl"
        >
          Enter the Interactive Map of Al Ahsa
        </motion.h2>

        <motion.button
          {...fadeUp}
          onClick={() => router.push("/map")}
          className="mt-10 rounded-full bg-white px-12 py-5 text-lg font-semibold text-black hover:scale-[1.03]"
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