"use client"

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import { fetchPeopleTrustUs_Slice } from "../../redux/slices/peopleTrust_usSlice";
import { AppDispatch, RootState } from "../../redux/store";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

interface TrustUsItem {
    id: number;
    title: string;
    designation: string;
    video: string;
}

export default function Trust_Us() {
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);
    const [trustUsArray, setTrustUsArray] = useState<TrustUsItem[]>([]);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true });
    const [swiper, setSwiper] = useState<any>(null);

    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.peopleTrustUsSection?.data);

    useEffect(() => {
        dispatch(fetchPeopleTrustUs_Slice());
    }, [dispatch]);

    useEffect(() => {
        if (data?.data) {
            const newArr = data.data.map((item: any) => ({
                id: item.id,
                title: item.People_Trust_Us_title,
                designation: item.People_Trust_Us_designation,
                video: item.People_Trust_Us_video.url
            }));
            setTrustUsArray(newArr);
        }
    }, [data]);

    const handleVideoClick = async (id: number) => {
        // Only allow playback if this video is in the active (center) slide
        if (swiper?.realIndex !== trustUsArray.findIndex(item => item.id === id)) {
            return;
        }

        const video = videoRefs.current[id];
        if (!video) return;

        if (playingVideo === id) {
            video.pause();
            setPlayingVideo(null);
        } else {
            if (playingVideo !== null && videoRefs.current[playingVideo]) {
                videoRefs.current[playingVideo]?.pause();
            }
            try {
                await video.play();
                setPlayingVideo(id);
            } catch (error) {
                console.error('Video playback failed:', error);
            }
        }
    };

    return (
        <div className="w-full py-16 bg-bgColor">
            <motion.div
                ref={containerRef}
                className="w-[95%] md:w-[90%] 2xl:w-[80%] mx-auto bg-bgBlue rounded-[20px] p-6 md:p-10 lg:p-14 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <motion.div
                    className="text-center mb-8 md:mb-12 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex flex-col items-center">
                        <h2 className="text-white font-semibold text-2xl md:text-4xl lg:text-[54px] leading-tight max-w-[800px]">
                            Over 1000+ People Trust Us
                        </h2>
                        {/* Decorative line */}
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent my-4"></div>
                        <p className="text-[#f6f6f6] opacity-60 mt-2 text-sm md:text-base lg:text-xl max-w-[600px]">
                            Brick N Key supports a variety of the most popular properties.
                        </p>
                    </div>
                </motion.div>

                {/* New Swiper Implementation */}
                <div className="relative px-4 md:px-12">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        slidesPerView={3}
                        initialSlide={1}
                        speed={800} // Slower transition for better visual
                        pagination={{
                            clickable: true,
                            el: '.trust-us-pagination',
                        }}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 200,
                            modifier: 2,
                            slideShadows: false,
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 20
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30
                            }
                        }}
                        onSlideChange={() => {
                            if (playingVideo !== null && videoRefs.current[playingVideo]) {
                                videoRefs.current[playingVideo]?.pause();
                                setPlayingVideo(null);
                            }
                        }}
                        modules={[EffectCoverflow, Pagination, Navigation]}
                        className="trust-us-swiper !overflow-visible"
                        onSwiper={setSwiper}
                        navigation={{
                            enabled: true,
                            prevEl: '.trust-us-prev',
                            nextEl: '.trust-us-next',
                        }}
                    >
                        {trustUsArray.map((item, index) => (
                            <SwiperSlide 
                                key={item.id} 
                                className="trust-us-slide"
                            >
                                <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/14]">
                                    <video
                                        id={`video-${item.id}`}
                                        ref={el => { videoRefs.current[item.id] = el }}
                                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.video}`}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        loop
                                    />
                                    <div className={`absolute inset-0 flex items-center justify-center
                                        transition-opacity duration-300`}
                                    >
                                        <button
                                            onClick={() => handleVideoClick(item.id)}
                                            className={`transform transition-all duration-300
                                                ${playingVideo === item.id ? 'scale-90' : 'scale-100'}
                                                hover:scale-110`}
                                        >
                                            <Image
                                                src={playingVideo === item.id ? '/images/pause_btn.png' : '/images/play_btn.png'}
                                                alt={playingVideo === item.id ? "Pause" : "Play"}
                                                width={60}
                                                height={60}
                                                className="w-12 h-12 md:w-16 md:h-16"
                                            />
                                        </button>
                                    </div>
                                    {/* Bottom Info Gradient */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-white font-medium text-sm md:text-base">
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/80 text-xs md:text-sm">
                                                    {item.designation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Pagination */}
                    <div className="trust-us-pagination flex justify-center mt-6"></div>

                    {/* Navigation Buttons */}
                    <div className="trust-us-navigation prev">
                        <button className="nav-button trust-us-prev">
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </button>
                    </div>
                    <div className="trust-us-navigation next">
                        <button className="nav-button trust-us-next">
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}