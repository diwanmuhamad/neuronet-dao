"use client";
import { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Thumb from "@/public/images/t-thumb-one.png";
import ThumbTwo from "@/public/images/t-thumb-two.png";
import Wheel from "@/public/images/wheel.png";

const TextBrief = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const deviceWidth = window.innerWidth;

      if (deviceWidth >= 768) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".text-brief",
            start: "center center",
            end: "+=40%",
            scrub: 1,
          },
        });

        tl.to(".t-br-one img", {
          scale: 1.2,
          y: 60,
          opacity: 0.5,
          duration: 2,
        });

        tl.to(
          ".t-br-two img",
          {
            y: 60,
            opacity: 0.5,
            duration: 2,
          },
          "<"
        );

        tl.to(
          ".t-br-three img",
          {
            rotate: 45,
            scale: 1.1,
            opacity: 0.7,
            duration: 2,
          },
          "<"
        );
      }
    });

    return () => ctx.revert(); 
  }, []);

  return (
    <section className="text-brief section pb-0" id="scrollPosition">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-brief__inner">
              <div className="t-br-one">
                <Image src={Thumb} alt="Neuronet DAO Thumb One" priority />
                <h2 className="light-title fw-7 text-white title-animation">
                  Building the Future of On-Chain AI
                </h2>
              </div>

              <div className="t-br-two">
                <h3 className="light-title fw-7 text-white title-animation">
                  A DAO-Governed Marketplace
                </h3>
                <Image src={ThumbTwo} alt="Neuronet DAO Thumb Two" priority />
              </div>

              <div className="t-br-three">
                <Image src={Wheel} alt="Neuronet DAO Wheel" priority />
                <h4 className="light-title fw-7 text-white title-animation">
                  For AI Models, Prompts & Datasets
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextBrief;

