"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.15 },
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
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,140,60,0.12),transparent_35%),linear-gradient(to_bottom,rgba(2,6,23,0.5),rgba(2,6,23,0.9),rgba(2,6,23,1))]" />

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">

          {/* ================= HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-8 pb-10"
          >
            <div className="flex items-center justify-between rounded-[28px] border border-white/6 bg-white/[0.045] px-6 py-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/[0.07]" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">
                    Al Ahsa
                  </p>
                  <p className="text-sm text-white/80">
                    Immersive Platform
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/map")}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:scale-[1.03]"
              >
                Open Platform
              </button>
            </div>
          </motion.div>

          {/* ================= HERO ================= */}
          <div className="grid items-center gap-16 pb-24 lg:grid-cols-[1.1fr_0.9fr]">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-3xl"
            >
              <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-[#d6c28d]">
                Vision 2030 • Smart City • Tourism • Heritage
              </p>

              {/* FIXED SIZE + SPACING */}
              <h1 className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-[36px] font-semibold leading-[1.1] tracking-tight text-transparent sm:text-[46px] md:text-[58px] xl:text-[68px]">
                Discover Al Ahsa Through a Premium Digital Experience
              </h1>

              {/* MORE SPACE BELOW TITLE */}
              <p className="mt-8 text-[15px] leading-7 text-white/60 md:text-base">
                A luxury interactive gateway that connects tourism, culture,
                heritage, and municipal intelligence into one immersive
                platform designed for the future of Al Ahsa.
              </p>

              {/* BUTTON SPACING FIX */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => router.push("/map")}
                  className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black hover:scale-[1.03]"
                >
                  Explore Interactive Map
                </button>

                <div className="rounded-full bg-white/[0.05] px-5 py-4 text-sm text-white/60">
                  Premium Spatial Platform
                </div>
              </div>
            </motion.div>

            {/* RIGHT CARDS */}
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              className="grid gap-6"
            >
              {[
                "Destination Discovery",
                "Cultural Storytelling",
                "Municipal Intelligence",
              ].map((title, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-[28px] bg-white/[0.05] p-7 backdrop-blur-2xl hover:bg-white/[0.07]"
                >
                  <h3 className="text-xl font-semibold">{title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ================= BOTTOM CARDS ================= */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid gap-5 pb-24 md:grid-cols-3"
          >
            {[
              "Immersive Mapping",
              "Tourism + Heritage + City",
              "Saudi Vision 2030",
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-[24px] bg-white/[0.04] p-6"
              >
                <p className="text-lg font-semibold">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-28 text-center">
        <motion.h2
          {...fadeUp}
          className="mx-auto max-w-3xl text-4xl font-semibold md:text-6xl"
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