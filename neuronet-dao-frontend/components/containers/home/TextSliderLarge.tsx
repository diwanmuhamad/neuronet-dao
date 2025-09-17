"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";


const features = [
  { title: "AI", highlight: "Models" },
  { title: "AI", highlight: "Prompts" },
  { title: "Data", highlight: "Sets" },
  { title: "On-Chain", highlight: "Licensing" },
  { title: "DAO", highlight: "Governance" },
  { title: "Token", highlight: "Staking" },
  { title: "Royalty", highlight: "Rewards" },
  { title: "ICP", highlight: "Marketplace" },
];

const TextSliderLarge = () => {
  const pathname = usePathname();
  const isHomeSeven = pathname === "/index-seven";

  return (
    <section
      className={`text-slider-large-wrapper ${
        isHomeSeven ? " section pb-0" : ""
      }`}
    >
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
        {features.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="text-slider__single">
              <h2 className="large-title">
                <Link href="services">
                  {item.title}
                  <span
                    className="text-stroke"
                    data-text={item.highlight}
                  >
                    {" "}
                    {item.highlight}
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

export default TextSliderLarge;

