"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

const SmoothScroll = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    gsap.ticker.add((time) => {
      lenis.raf(time * 350);
    });
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.update();
  }, []);
  return null;
};

export default SmoothScroll;
