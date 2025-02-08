"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import { fetchLuxuryListingItem } from "../../redux/slices/luxuryListingSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { giveCorrectImage } from '../data';
import Link from 'next/link';
import { Metadata } from 'next'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Featured Properties | Brick N Key',
  description: 'Browse through our featured properties with our interactive slider. View luxurious homes and prime locations.',
  keywords: 'property slider, featured properties, luxury homes, property showcase',
  openGraph: {
    title: 'Featured Properties | Brick N Key',
    description: 'Browse through our featured properties',
    type: 'website',
  }
}

interface SliderProps {
  images: string[];
  onLocationChange: (location: string) => void;
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const Slider: React.FC<SliderProps> = ({ images, onLocationChange, activeIndex, onNext, onPrev }) => {
  const data = useSelector((state: RootState) => state.luxuryListingItems?.data);
  console.log("This is the SLider data", data);
  const dispatch = useDispatch<AppDispatch>();
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>('');
  const [property_Location, setPropertyLocation] = useState('');

  // const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchLuxuryListingItem());
  }, [dispatch]);

  const slides = data?.data?.map((currElem: { id: number, property_Location: String, property_Description: String, property_Images: [{ url: String }], brand: { brand_name: string } }) => ({
    id: currElem?.id,
    title: currElem?.brand?.brand_name || "",
    location: currElem?.property_Location || "",
    description: currElem?.property_Description || "",
    url: currElem?.property_Images?.[0]?.url || "/placeholder.jpg",
  })) || [];

  useEffect(() => {
    if (slides.length > 0) {
      onLocationChange?.(getSlide(0).location);
    }
  }, [slides, onLocationChange]);

  const nextSlide = useCallback(() => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setSlideDirection(''), 500);
    onLocationChange?.(getSlide(1).location);
  }, [slides.length, onLocationChange]);

  const prevSlide = useCallback(() => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setSlideDirection(''), 500);
    onLocationChange?.(getSlide(-1).location);
  }, [slides.length, onLocationChange]);

  const getSlideIndex = (offset: number) => {
    return (currentSlide + offset + slides.length) % slides.length;
  };

  const getSlide = (offset: number) => {
    const index = getSlideIndex(offset);
    return slides[index] || {
      id: 0,
      title: "",
      location: "",
      description: "",
      url: "/placeholder.jpg"
    };
  };

  const getAnimationClasses = (position: 'prev' | 'current' | 'next') => {
    const baseClasses = 'transition-all duration-700 ease-out';

    if (!slideDirection) {
      return `${baseClasses} opacity-100 transform translate-y-0`;
    }

    if (position === 'current') {
      return `${baseClasses} animate-slide-up-current`;
    } else if (position === 'prev') {
      return `${baseClasses} animate-slide-up-side`;
    } else if (position === 'next') {
      return `${baseClasses} animate-slide-up-side`;
    }

    return baseClasses;
  };

  if (!isClient || slides.length === 0) {
    return <div className="w-full h-64 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full relative">
      <style jsx>{`
        @keyframes slideUpCurrent {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUpSide {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 0.8;
          }
        }

        .animate-slide-up-current {
          animation: slideUpCurrent 0.7s ease-out forwards;
        }

        .animate-slide-up-side {
          animation: slideUpSide 0.5s ease-out forwards;
        }
      `}</style>

      <div className="relative w-full overflow-hidden">
        <div className="w-full flex items-start justify-start gap-4 max-sm:gap-0">
          {/* Previous Slide */}
          <div className={`relative w-[45%] cursor-pointer max-lg:w-[20%] -translate-x-4 max-sm:-translate-x-4 md:-translate-x-10 h-full ${getAnimationClasses('prev')}`}>
            <Link href={`/detail?id=${encodeURIComponent(getSlide(-1)?.id)}`}>
              <div className="w-full rounded-lg duration-300">
                <div className="relative w-full flex flex-col items-center justify-center min-h-[100px] bg-center group">
                  <Image
                    width={300} // Increase resolution
                    height={200}
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getSlide(-1).url}`}
                    alt={getSlide(-1).title}
                    className="w-full h-[150px] md:h-[200px] object-cover rounded-tr-[20px] rounded-br-[20px]"
                    quality={100} // Improve rendering quality
                  />
                  <div className="detail_icon opacity-0 group-hover:opacity-100 absolute w-12 h-12 md:w-20 md:h-20 rounded-full bg-bgRed text-white flex justify-center items-center transition-opacity duration-300 text-xs md:text-base">
                    Detail
                  </div>
                  <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center mt-2'>
                    <p className='text-sm md:text-lg font-semibold'>{getSlide(-1).title}</p>
                    <p className='text-xs flex justify-start items-center'>
                      <span><MapPin className="w-4 h-4 md:w-6 md:h-6" /></span>
                      {getSlide(-1).location}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Current Slide */}
          <div className={`relative w-[50%] max-lg:w-[70%] ${getAnimationClasses('current')}`}>
            <Link href={`/detail?id=${encodeURIComponent(getSlide(0)?.id)}`}>
              <div className="rounded-lg transition-shadow duration-300">
                <div className="relative flex flex-col items-center justify-center min-h-[200px] group">
                  <Image
                    width={600}
                    height={400}
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getSlide(0).url}`}
                    alt={getSlide(0).title}
                    className="w-full h-[200px] md:h-[296px] object-cover rounded-[20px]"
                    quality={100} // Improve rendering quality
                  />
                  <div className="detail_icon opacity-0 group-hover:opacity-100 absolute w-12 h-12 md:w-20 md:h-20 rounded-full bg-bgRed text-white flex justify-center items-center transition-opacity duration-300 text-xs md:text-base">
                    Detail
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 px-2 md:px-0">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold">{getSlide(0)?.title}</h3>
                      <p className='text-xs flex justify-start items-center'>
                        <span><MapPin className="w-4 h-4 md:w-6 md:h-6" /></span>
                        {getSlide(0)?.location}
                      </p>
                    </div>
                    <p className="text-xs">{getSlide(0)?.description?.slice(0, 100)}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Next Slide */}
          <div className={`relative w-[45%] max-lg:w-[20%] translate-x-4 max-sm:translate-x-4 md:translate-x-10 ${getAnimationClasses('next')}`}>
            <Link href={`/detail?id=${encodeURIComponent(getSlide(1)?.id)}`}>
              <div className="rounded-lg transition-shadow duration-300">
                <div className="relative flex flex-col items-center justify-center min-h-[100px] group">
                  <Image
                    width={300}
                    height={200}
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${getSlide(1).url}`}
                    alt={getSlide(1).title}
                    className="w-full h-[150px] md:h-[200px] object-cover rounded-tl-[20px] rounded-bl-[20px]"
                    quality={100} // Improve rendering quality
                  />
                  <div className="detail_icon opacity-0 z-20 group-hover:opacity-100 absolute w-12 h-12 md:w-20 md:h-20 rounded-full bg-bgRed text-white flex justify-center items-center transition-opacity duration-300 text-xs md:text-base">
                    Detail
                  </div>
                  <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center mt-2'>
                    <p className='text-sm md:text-lg font-semibold'>{getSlide(1).title}</p>
                    <p className='text-xs flex justify-between items-center mr-10'>
                      <span className='flex items-center'><MapPin className="w-4 h-4 md:w-6 md:h-6" /></span>
                      {getSlide(1).location}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute right-4 md:right-24 bottom-0 flex items-center justify-center gap-4 max-sm:gap-1">
        <button
          onClick={prevSlide}
          className="p-1 border-2 border-black rounded-xl bg-white hover:bg-gray-100 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-1 border-2 border-black rounded-xl bg-white hover:bg-gray-100 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default Slider;