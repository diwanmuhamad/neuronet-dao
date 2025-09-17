"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

const ParallaxBg = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctaTwo = document.querySelector(".cta-two");
    const deviceWidth = window.innerWidth;

    if (ctaTwo && deviceWidth >= 768) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaTwo,
          start: "top center",
          end: "+=100%",
          scrub: 1,
          pin: false,
        },
      });

      tl.to(".cta-two__inner", {
        y: "-190px",
        duration: 1,
      });
    }
  }, []);

  return (
    <section className="section cta-two bg-img parallax-bg pb-i">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6">
            <div className="cta-two__inner text-center">
              <h2 className="title-animation fw-7 text-white">
                Powering the Future of Decentralized AI
              </h2>
              <p className="text-white mt-3">
                Join the NeuroNet DAO — stake $NND, trade AI assets, and shape the 
                future of on-chain intelligence.
              </p>
              <div className="section__content-cta mt-4">
                <Link href="sign-in" className="btn btn--primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxBg;

