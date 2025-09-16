"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

const TextSliderLargeTwo = () => {
  const slides = [
    { main: "Decentralized", stroke: "Governance" },
    { main: "Transparent", stroke: "AI Marketplace" },
    { main: "On-Chain", stroke: "Trust" },
    { main: "Rewarding", stroke: "Contributions" },
    { main: "Collaborative", stroke: "Intelligence" },
    { main: "Open", stroke: "Innovation" },
  ];

  return (
    <section className="text-slider-large-wrapper section pb-0">
      <Swiper
        slidesPerView="auto"
        spaceBetween={24}
        speed={10000}
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
        {slides.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="text-slider__single">
              <h2 className="large-title">
                <Link href="/services">
                  {item.main}{" "}
                  <span className="text-stroke" data-text={item.stroke}>
                    {item.stroke}
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

export default TextSliderLargeTwo;

