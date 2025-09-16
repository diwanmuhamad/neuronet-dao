"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import one from "@/public/images/showcase/one.png";
import two from "@/public/images/showcase/two.png";
import three from "@/public/images/showcase/three.png";
import four from "@/public/images/showcase/four.png";
import five from "@/public/images/showcase/five.png";
import six from "@/public/images/showcase/six.png";

const images = [one, two, three, four, five, six];

const ShowCaseThree = () => {
  return (
    <div className="section showcase">
      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        speed={3000}
        loop={true}
        roundLengths={true}
        centeredSlides={true}
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          1400: {
            slidesPerView: 6,
          },
          992: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          425: {
            slidesPerView: 2,
          },
        }}
        className="showcase__slider"
      >
        {Array.from({ length: 3 }).map((_, i) =>
          images.map((img, idx) => (
            <SwiperSlide key={`${i}-${idx}`}>
              <div className="showcase__single">
                <Link href="product-single">
                  <Image src={img} alt={`Showcase ${idx + 1}`} priority />
                </Link>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default ShowCaseThree;

