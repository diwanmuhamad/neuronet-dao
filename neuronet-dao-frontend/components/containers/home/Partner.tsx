"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import One from "@/public/images/partner/one.png";
import Two from "@/public/images/partner/two.png";
import Three from "@/public/images/partner/three.png";
import Four from "@/public/images/partner/four.png";
import Five from "@/public/images/partner/five.png";

const Partner = () => {
  const pathname = usePathname();
  const isHomeTwoRoute = pathname === "/index-two";

  return (
    <div className={"partner section" + (isHomeTwoRoute ? " pb-0" : " ")}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7">
            <div className="section__header text-center">
              <h2 className="title sub-title-two mt-0 title-animation">
                Powering the <span className="text-primary">NeuroNet DAO</span> Ecosystem
              </h2>
              <p className="tertiary-text">
                We are building the world’s first fully on-chain AI marketplace — and we don’t do it alone. 
                Our partners, collaborators, and ecosystem allies strengthen our mission to make 
                artificial intelligence open, fair, and accessible for everyone.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Swiper
              slidesPerView={2}
              spaceBetween={24}
              speed={2000}
              loop={true}
              roundLengths={true}
              centeredSlides={true}
              centeredSlidesBounds={false}
              modules={[Autoplay]}
              autoplay={{
                delay: 3000, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                992: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                425: {
                  slidesPerView: 3,
                },
              }}
              className="partner__slider"
            >
              {[One, Two, Three, Four, Five].map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="partner__slider-single">
                    <Image src={img} alt={`Partner ${index + 1}`} priority />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
