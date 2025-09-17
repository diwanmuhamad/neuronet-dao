"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Star from "@/public/images/star.png";

const keywords = [
  { text: "AI Models", link: "services" },
  { text: "Prompts", link: "services" },
  { text: "Datasets", link: "services" },
  { text: "Licensing", link: "services" },
  { text: "Governance", link: "services" },
  { text: "Staking", link: "services" },
  { text: "Powered by ICP", link: "services" },
  { text: "Royalties", link: "services" },
];

const TextSlider = () => {
  return (
    <section className="text-slider-wrapper">
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
        className="text-slider"
      >
        {keywords.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="text-slider__single">
              <h2 className="light-title">
                <Link href={item.link}>NeuroNet DAO</Link>
              </h2>
              <Image src={Star} alt="star icon" priority />
              <h2 className="light-title">
                <Link
                  href={item.link}
                  className="text-stroke"
                  data-text={item.text}
                >
                  {item.text}
                </Link>
              </h2>
              <Image src={Star} alt="star icon" priority />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TextSlider;

