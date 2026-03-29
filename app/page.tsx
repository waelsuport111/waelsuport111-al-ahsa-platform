"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-black text-white">
      <section className="relative flex h-screen items-center justify-center overflow-hidden text-center">
        <img
          src="/bg.jpg"
          alt="Al Ahsa"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-6"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Vision 2030 • Smart City • Tourism • Heritage
          </p>

          <h1 className="mt-4 text-5xl font-semibold md:text-7xl">
            Al Ahsa Platform
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Discover Al Ahsa through immersive digital experiences powered by
            next-generation spatial technology.
          </p>

          <button
            onClick={() => router.push("/map")}
            className="mt-10 rounded-full bg-white px-10 py-4 text-lg font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            Explore Interactive Map
          </button>
        </motion.div>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          Tourism Experiences
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-white/60">
          Explore breathtaking destinations, resorts, and cultural attractions
          across Al Ahsa in a fully immersive digital environment.
        </p>
      </section>

      <section className="bg-gradient-to-b from-black to-[#05070a] px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          Heritage & Culture
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-white/60">
          Walk through historical landmarks and discover the rich heritage of
          Al Ahsa through interactive storytelling.
        </p>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          Smart City Vision
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-white/60">
          Empowering municipalities with digital twins, spatial intelligence,
          and immersive platforms aligned with Saudi Vision 2030.
        </p>
      </section>

      <section className="py-32 text-center">
        <h2 className="text-4xl font-semibold md:text-6xl">
          Experience Al Ahsa Now
        </h2>

        <button
          onClick={() => router.push("/map")}
          className="mt-10 rounded-full bg-white px-12 py-5 text-lg font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
        >
          Open Interactive Map
        </button>
      </section>

      <div className="pb-10 text-center text-xs tracking-[0.3em] text-white/40">
        POWERED BY DARI 966
      </div>
    </main>
  );
}