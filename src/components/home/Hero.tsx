"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FloatingFlower, HeroArt, Leaf } from "@/components/brand/Botanicals";
import { siteConfig } from "@/lib/site";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="container-x relative pt-8 sm:pt-12">
      <FloatingFlower className="-right-3 -top-4 z-20 h-28 w-28 sm:-right-6 sm:-top-8 sm:h-44 sm:w-44" rotate={14} />
      <FloatingFlower className="-left-4 bottom-[-2.5rem] z-20 hidden h-28 w-28 sm:block lg:-left-8 lg:h-36 lg:w-36" delay={-4} rotate={-18} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="panel on-dark relative grid items-center gap-6 rounded-[2.25rem] px-6 pb-4 pt-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-14"
      >
        <Leaf tone="emerald" className="pointer-events-none absolute -bottom-4 left-1/3 hidden h-24 w-36 rotate-[8deg] opacity-30 lg:block" />
        <div className="relative z-10">
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/40 bg-ivory/10 px-3.5 py-1.5 text-[13px] font-semibold"
          >
            <GraduationCap className="h-4 w-4 text-mint" aria-hidden />
            Made for BCA students at SGBAU
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-5 font-display text-[2rem] font-bold leading-[1.12] sm:text-5xl lg:text-[3.4rem]"
          >
            <span className="text-silver">Your Learning Journey Starts Here.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-4 font-heading text-lg font-semibold text-mint">
            {siteConfig.tagline}
          </motion.p>
          <motion.p variants={item} className="mt-3 max-w-xl text-[15px] leading-relaxed text-ivory/90 sm:text-base">
            Unit-wise notes, easy understanding videos and previous year question papers, sorted by semester and subject, so you spend your time
            studying instead of searching.
          </motion.p>
          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/courses" variant="light" size="lg">
              Explore Courses
              <ArrowRight className="h-5 w-5" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/courses/bca/sgbau/1" variant="outlineLight" size="lg">
              Jump to Semester 1
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div variants={item} className="relative z-10 mx-auto w-full max-w-[22rem] lg:-mb-8 lg:-mt-16 lg:max-w-none">
          <HeroArt className="h-auto w-full drop-shadow-[0_24px_30px_rgba(10,40,30,0.45)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
