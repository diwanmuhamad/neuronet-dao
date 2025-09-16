"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import One from "@/public/images/t-one.png";
import Two from "@/public/images/t-two.png";
import Three from "@/public/images/t-three.png";

const Review = () => {
  const pathname = usePathname();
  const isAbout = pathname === "/about-us" || pathname === "/services";

  return (
    <section className={`section review ${isAbout ? " lilu-review" : ""}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-5">
            <div className="section__header text-center">
              <span className="sub-title-two">Community Voices</span>
              <h2 className="title title-animation">What Our Members Say</h2>
              <p>
                Hear from builders, researchers, and creators who are shaping the future of AI
                through the Neuronet DAO.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Swiper
              slidesPerView={1}
              spaceBetween={24}
              slidesPerGroup={1}
              speed={1200}
              loop={true}
              roundLengths={true}
              centeredSlides={false}
              centeredSlidesBounds={false}
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                el: ".review-pagination",
                clickable: true,
              }}
              breakpoints={{
                992: {
                  slidesPerView: 3,
                },
                576: {
                  slidesPerView: 2,
                },
              }}
              className="review__slider"
            >
              <SwiperSlide>
                <div className="review__slider-single">
                  <p>
                    Being part of Neuronet DAO means I can monetize my AI models
                    transparently while retaining ownership. The governance
                    process makes me feel like my voice matters.
                  </p>
                  <div className="review__meta">
                    <div className="thumb">
                      <Image src={One} alt="Image" priority />
                    </div>
                    <div className="content">
                      <h5>Devon Lane</h5>
                      <p className="tertiary-text">AI Researcher</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="review__slider-single">
                  <p>
                    I’ve licensed datasets through the marketplace and the
                    on-chain verification process gave me full trust in the
                    transaction. This is the future of AI collaboration.
                  </p>
                  <div className="review__meta">
                    <div className="thumb">
                      <Image src={Two} alt="Image" priority />
                    </div>
                    <div className="content">
                      <h5>Kathryn Murphy</h5>
                      <p className="tertiary-text">Data Scientist</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="review__slider-single">
                  <p>
                    The DAO rewards system is fair and transparent. Every
                    contribution, whether a prompt, dataset, or model, is
                    recognized and rewarded automatically.
                  </p>
                  <div className="review__meta">
                    <div className="thumb">
                      <Image src={Three} alt="Image" priority />
                    </div>
                    <div className="content">
                      <h5>Ralph Edwards</h5>
                      <p className="tertiary-text">Web3 Builder</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="section__cta">
              <div className="slider-pagination-group slider-dots review-pagination d-flex justify-content-center"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;

