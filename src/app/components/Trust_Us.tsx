"use client"

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPeopleTrustUs_Slice } from "../../redux/slices/peopleTrust_usSlice";
import { AppDispatch, RootState } from "../../redux/store";


export default function Trust_Us() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);
    const [trustUsArray, setTrustUsArray] = useState([]);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const data = useSelector((state: RootState) => state.peopleTrustUsSection?.data);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if(data){
            const newArr = data?.data.map((currElem: {id: number, People_Trust_Us_video: {url: string}, People_Trust_Us_title: string, People_Trust_Us_designation: string}) => {
                return {
                    id : currElem.id,
                    title: currElem.People_Trust_Us_title,
                    designation: currElem.People_Trust_Us_designation,  
                    video: currElem.People_Trust_Us_video.url
                }
            })

            if(newArr.length > 0){
                setTrustUsArray(newArr);
            }
        }
    }, [data]);

    console.log("This is the trust us array", trustUsArray);

    useEffect(() => {
        dispatch(fetchPeopleTrustUs_Slice());
    }, [dispatch]);

    if (data) console.log(data?.data);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = trustUsArray.length - 3;
            return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = trustUsArray.length - 3;
            return prevIndex <= 0 ? maxIndex : prevIndex - 1;
        });
    };

    const handleVideoClick = (testimonialId: number) => {
        const video = videoRefs.current[testimonialId];
        if (!video) return;

        if (playingVideo === testimonialId) {
            video.pause();
            setPlayingVideo(null);
        } else {
            if (playingVideo !== null && videoRefs.current[playingVideo]) {
                videoRefs.current[playingVideo]?.pause();
            }
            video.play();
            setPlayingVideo(testimonialId);
        }
    };

    const headerVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const sliderVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                delay: 0.3,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.5,
                ease: "backOut"
            }
        }
    };

    return (
        <div className="w-full pt-16 bg-bgColor">
            <motion.div
                ref={ref}
                className='w-[95%] md:w-[90%] 2xl:w-[80%] mx-auto bg-bgBlue rounded-[20px] max-lg:py-10 lg:p-14'
            >
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-4"
                >
                    <h2 className="text-white font-[600] max-lg:text-3xl max-sm:text-xl lg:text-[54px] leading-tight lg:leading-[65px]">
                        Over 1000+ People Trust Us
                    </h2>
                    <p className="font-[250] max-lg:text-sm max-[480px]:text-[10px] lg:text-[24px] leading-normal lg:leading-[29px] text-[#FFFFFF] opacity-20">
                        Brick N Key supports a variety of the most popular properties.
                    </p>
                </motion.div>

                <div className="relative w-full mx-auto mt-8 md:mt-12 lg:mt-20 mb-8">
                    <motion.button
                        variants={buttonVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 lg:-translate-x-12 bg-white/10 hover:bg-white/20 p-1 rounded-lg border-2 border-white z-10"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </motion.button>
                    <motion.button
                        variants={buttonVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 lg:translate-x-12 bg-white/10 hover:bg-white/20 p-1 rounded-lg border-2 border-white z-10"
                    >
                        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </motion.button>

                    <motion.div
                        variants={sliderVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="overflow-hidden"
                    >
                        <div
                            className="w-full flex gap-8 max-xl:gap-4 max-sm:gap-2 transition-all duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * 33.333}%)`,
                            }}
                        >
                            {trustUsArray?.map((currElem:{id:number,title: string, designation: string, video: string }, index:number) => {
                                const isVisible = index >= currentIndex && index < currentIndex + 3;
                                const isCenterSlide = index === currentIndex + 1;
                                
                                return (
                                    <div
                                        key={currElem?.id}
                                        className={`
                                            transition-all duration-500 
                                            lg:min-w-[31.333%]
                                            ${isVisible ? 'opacity-100' : 'opacity-0'}
                                            ${isCenterSlide ? 
                                                'max-lg:min-w-[54%] max-sm:min-w-[60%] max-lg:z-20 max-[470px]:min-w-[50%]' : 
                                                'max-lg:min-w-[27.5%] max-sm:min-w-[27.5%] max-lg:opacity-75 max-[470px]:w-[7.5%]'
                                            }
                                        `}
                                    >
                                        <div className="mx-2 rounded-lg overflow-hidden">
                                            <div className="relative w-full h-full flex justify-center items-center bg-center max-lg:gap-12 max-sm:gap-6">
                                                <video
                                                    className={`
                                                        w-full object-cover
                                                        max-sm:h-[300px]
                                                        sm:h-[350px]
                                                        lg:h-[400px] 
                                                        2xl:h-[450px]
                                                    `}
                                                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${currElem?.video}`}
                                                    ref={el => { videoRefs.current[currElem?.id] = el; }}
                                                ></video>
                                                <div className={`
                                                    video_info absolute bottom-2 md:bottom-5 w-full 
                                                    flex justify-between items-center text-white px-2 md:px-3
                                                    ${isCenterSlide ? 'max-lg:bottom-8' : ''}
                                                `}>
                                                    <div className='h-full flex flex-col justify-center items-start'>
                                                        <h3 className={`
                                                            text-sm md:text-base
                                                            ${isCenterSlide ? 'max-lg:text-lg' : ''}
                                                        `}>
                                                            {currElem?.title}
                                                        </h3>
                                                        <p className={`
                                                            text-xs
                                                            ${isCenterSlide ? 'max-lg:text-sm' : ''}
                                                        `}>
                                                            {currElem?.designation}
                                                        </p>
                                                    </div>
                                                    <Image
                                                        width={46}
                                                        height={46}
                                                        src={playingVideo === currElem?.id ?  '/images/pause_btn.png' : '/images/play_btn.png'}
                                                        alt="testimonial img"
                                                        className={`
                                                            cursor-pointer w-8 h-8 md:w-12 md:h-12
                                                            ${isCenterSlide ? 
                                                                'max-lg:w-14 max-lg:h-14 max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-16' : 
                                                                ''
                                                            }
                                                        `}
                                                        onClick={() => handleVideoClick(currElem?.id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}