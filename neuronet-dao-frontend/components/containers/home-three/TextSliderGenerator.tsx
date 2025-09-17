"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

const TextSliderGenerator = () => {
  return (
    <section className="text-slider-large-wrapper section pb-0">
      <Swiper
        slidesPerView="auto"
        spaceBetween={24}
        speed={8000}
        loop={true}
        centeredSlides={false}
        modules={[Autoplay]}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="text-slider-large"
      >
        {[
          { main: "Neuronet DAO", sub: "Decentralized AI Marketplace", href: "/services" },
          { main: "On-Chain", sub: "AI Model Registry", href: "/services" },
          { main: "DAO-Governed", sub: "Prompt Sharing", href: "/services" },
          { main: "Community-Powered", sub: "AI Innovation", href: "/services" },
          { main: "Secure", sub: "Dataset Exchange", href: "/services" },
          { main: "Trustless", sub: "AI Collaboration", href: "/services" },
        ].map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="text-slider__single">
              <h2 className="large-title">
                <Link href={item.href}>
                  {item.main}{" "}
                  <span className="text-stroke" data-text={item.sub}>
                    {item.sub}
                  </span>
                </Link>
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TextSliderGenerator;

