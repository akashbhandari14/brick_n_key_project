"use client"

import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrandSectionSlice } from "../../redux/slices/brandSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { motion, AnimatePresence } from 'framer-motion';
import Property_Card from './Property_Card';
import { giveCorrectImage } from '../data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    [key: `interval_${string}`]: NodeJS.Timeout;
  }
}

interface PropertyImage {
  url: string;
}

interface PropertyFeature {
  id: string | number;
  item: string;
}

interface BrandRelation {
  id: string;
  property_Images: PropertyImage[];
  property_Location: string;
  propertyFeature: PropertyFeature[];
}

interface BrandData {
  id: number;
  brand_ID: string;
  brand_name: string;
  brand_logo: {
    url: string;
  };
  brand_relations: BrandRelation[];
}

const Brand = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [propertyIndex, setPropertyIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(3);
  const [showPropertyCard, setShowPropertyCard] = useState(false);
  const [brand_name, setBrand_name] = useState<string | null>(null);
  const brandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const propertyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});
  const [isImageTransitioning, setIsImageTransitioning] = useState<{ [key: string]: boolean }>({});
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<number | null>(null);

  const router = useRouter();

  const data = useSelector((state: RootState) => state.brandSection?.data);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBrandSectionSlice());
  }, [dispatch]);

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.4,
        duration: 1.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const resetBrandTimeout = () => {
    if (brandTimeoutRef.current) {
      clearTimeout(brandTimeoutRef.current);
    }
  };

  const resetPropertyTimeout = () => {
    if (propertyTimeoutRef.current) {
      clearTimeout(propertyTimeoutRef.current);
    }
  };

  useEffect(() => {
    if ((data?.data || []).length > 5) {
      resetBrandTimeout();
      brandTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === data?.data?.length - 5 ? 0 : prevIndex + 1
        );
      }, 10000);
    }

    return () => {
      resetBrandTimeout();
    };
  }, [currentIndex, data?.data?.length, data]);

  useEffect(() => {
    const brandRelationsLength = data?.data[cardIndex]?.brand_relations?.length || 0;

    if (brandRelationsLength > 1) {
      resetPropertyTimeout();
      propertyTimeoutRef.current = setTimeout(() => {
        setPropertyIndex((prevIndex) =>
          prevIndex === brandRelationsLength - 1 ? 0 : prevIndex + 1
        );
      }, 10000);
    }

    return () => {
      resetPropertyTimeout();
    };
  }, [propertyIndex, cardIndex, data]);

  const nextBrandSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data?.data?.length - 5 ? 0 : prevIndex + 1
    );
  };

  const prevBrandSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data?.data?.length - 5 : prevIndex - 1
    );
  };

  const nextPropertySlide = () => {
    setPropertyIndex((prevIndex) =>
      prevIndex === data?.data[cardIndex]?.brand_relations.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPropertySlide = () => {
    setPropertyIndex((prevIndex) =>
      prevIndex === 0 ? data?.data[cardIndex]?.brand_relations.length - 1 : prevIndex - 1
    );
  };

  const handleBrandClick = (index: number) => {
    setCardIndex(index);
    setSelectedBrandIndex(index);
    setShowPropertyCard(true);
    setBrand_name(data?.data[index]?.brand_name);
  };

  const cycleImage = (propertyId: string, imagesLength: number) => {
    setIsImageTransitioning(prev => ({ ...prev, [propertyId]: true }));

    setTimeout(() => {
      setImageIndices(prev => ({
        ...prev,
        [propertyId]: ((prev[propertyId] || 0) + 1) % imagesLength
      }));

      setTimeout(() => {
        setIsImageTransitioning(prev => ({ ...prev, [propertyId]: false }));
      }, 300);
    }, 200);
  };

  const hasNextSlide = () => {
    return currentIndex < (data?.data?.length || 0) - 5;
  };

  const hasPrevSlide = () => {
    return currentIndex > 0;
  };

  return (
    <div className="brand_container w-full bg-bgColor pt-16">
      <div className="brand_inner_container relative w-[90%] flex flex-col justify-center max-lg:justify-between items-center gap-6 max-sm:w-[95%] 2xl:w-[80%] mx-auto pb-8 bg-bgBlue rounded-[20px] px-16 max-lg:px-4">
        <div className='w-[80%] mx-auto max-lg:mt-10'>
          <Image
            width={600}
            height={400}
            src="/images/brand_main_img.svg"
            className='text-center w-full h-full bg-cover'
            alt="Brand_img"
          />
        </div>

        {/* Brands Slider */}
        <div className="relative mx-auto mb-12 px-4 w-full mt-20 max-xl:mt-10 max-lg:mt-0">
          {hasPrevSlide() && (
            <button
              onClick={prevBrandSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Brand Logos */}
          <div className="overflow-hidden w-full">
            <div
              className="w-full flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 5)}%)`
              }}
            >
              {data?.data?.map((currElem: BrandData, index: number) => (
                <div
                  key={"brand" + currElem.id}
                  className="flex-shrink-0 w-1/5 px-4 cursor-pointer"
                  onClick={() => handleBrandClick(index)}
                >
                  <div className={`flex flex-col items-center justify-center h-20 transition-all duration-300 rounded-full
                  ${selectedBrandIndex === index ? 'bg-bgColor bg-opacity-20 rounded-full' : ''}`}>
                    <Image
                      width={100}
                      height={100}
                      src={giveCorrectImage(currElem.brand_logo.url)}
                      alt={currElem.brand_name}
                      className="h-20 w-20 max-lg:h-16 max-lg:w-16 max-md:h-10 max-md:w-10 max-sm:w-32 max-sm:h-32 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasNextSlide() && (
            <button
              onClick={nextBrandSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        <h3 className={`brand_Heading text-white font-semibold text-4xl max-lg:text-2xl max-md:text-xl ${brand_name ? "" : "hidden"}`}>
          {brand_name}
        </h3>

        {/* Property Cards Section */}
        <AnimatePresence mode="wait">
          {showPropertyCard && (
            <motion.div
              className="hidden lg:grid grid-cols-3 justify-items-center gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {data?.data[cardIndex]?.brand_relations?.map((currElem: BrandRelation, index: number) => (
                <Property_Card
                  key={currElem.id}
                  currElem={currElem}
                  index={index}
                  imageIndex={imageIndices[currElem.id] || 0}
                  isImageTransitioning={isImageTransitioning[currElem.id]}
                  onHoverStart={() => {
                    if (currElem?.property_Images?.length > 1) {
                      const interval = setInterval(() => {
                        cycleImage(currElem.id, currElem.property_Images.length);
                      }, 800);
                      window[`interval_${currElem.id}`] = interval;
                    }
                  }}
                  onHoverEnd={() => {
                    clearInterval(window[`interval_${currElem.id}`]);
                    setImageIndices(prev => ({ ...prev, [currElem.id]: 0 }));
                    setIsImageTransitioning(prev => ({ ...prev, [currElem.id]: false }));
                  }}
                  onClick={() => router.push(`/detail?id=${encodeURIComponent(currElem?.id)}`)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View */}
        <div className="relative lg:hidden w-full">
          {Array.isArray(data?.data[cardIndex]?.brand_relations) &&
            data.data[cardIndex].brand_relations.length > 1 && (
              <>
                <button
                  onClick={prevPropertySlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextPropertySlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

          <div className="overflow-hidden w-full">
            <div
              className="w-full flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${propertyIndex * 100}%)`
              }}
            >
              {data?.data[cardIndex]?.brand_relations?.map((currElem: BrandRelation) => (
                <div
                  key={currElem?.id}
                  className="flex-shrink-0 w-full px-4"
                  onClick={() => router.push(`/detail?id=${encodeURIComponent(currElem?.id)}`)}
                >
                  <div className='flex flex-col justify-start items-start gap-1'>
                    <Image
                      width={100}
                      height={100}
                      src={giveCorrectImage(currElem?.property_Images?.[0]?.url || '')}
                      className='rounded-[20px] w-full'
                      alt="Property"
                    />
                    <div className='w-full h-full flex justify-between'>
                      <div className='text-white'>
                        <h1 className='font-[700] text-[28px]'>{brand_name || ""}</h1>
                        <p className='flex justify-start items-center gap-3 text-[14px]'>
                          <MapPin />{currElem?.property_Location || ""}
                        </p>
                      </div>
                      <div className='text-[#8F90A6] text-[16px]'>
                        {currElem?.propertyFeature?.map((feature: PropertyFeature) => (
                          <p key={feature.id}>{feature.item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;