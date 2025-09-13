"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import "swiper/swiper-bundle.css";
import SecureImage from "../SecureImage";

interface ProductImageSliderProps {
  images: string[];
  title: string;
}

const ProductImageSlider = ({ images, title }: ProductImageSliderProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );

  const handleImageError = (originalIndex: number) => {
    setImageErrors((prev) => ({ ...prev, [originalIndex]: true }));
  };

  // If no images provided, use placeholder
  const displayImages = images && images.length > 0 ? images : ["/placeholder_default.svg"];

  return (
    <div className="product__thumb">
      {/* Main image slider */}
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        modules={[FreeMode, Thumbs]}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="large-product-img"
      >
        {displayImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="single-lg-img">
              <div style={{ 
                width: '100%', 
                height: '500px', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SecureImage
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  width={636}
                  height={500}
                  className="w-100 h-100"
                  onError={() => handleImageError(index)}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Thumbnail slider */}
      {displayImages.length > 1 && (
        <Swiper
          slidesPerView={2}
          spaceBetween={24}
          slidesPerGroup={1}
          modules={[FreeMode, Thumbs]}
          breakpoints={{
            576: {
              slidesPerView: 3,
            },
          }}
          className="small-product-img"
          onSwiper={setThumbsSwiper}
          observer={true}
          observeParents={true}
          watchSlidesProgress={true}
          freeMode={true}
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="single-sm-img">
              <div style={{ 
                width: '100%', 
                height: '120px', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <SecureImage
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                width={196}
                height={120}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
              />
              </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductImageSlider;
