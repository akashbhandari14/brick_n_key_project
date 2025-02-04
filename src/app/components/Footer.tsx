"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const panelVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: i * 0.2,
                ease: "easeOut"
            }
        })
    };

    const socialIconVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: (i = 1) => ({
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.3,
                delay: 0.6 + (i * 0.1),
                ease: "easeOut"
            }
        })
    };

    const subscribeVariants = {
        hidden: {
            opacity: 0,
            x: 50
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                delay: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <>
            <div className="footer_container rel w-full bg-bgColor relative -mt-4 z-10">
                <div ref={ref} className="footer_inner_container w-[90%] max-sm:w-[95%] 2xl:w-[80%] mx-auto py-12 max-lg:py-10 px-4 md:px-8  bg-bgBlue rounded-b-[20px] max-lg:flex max-lg:flex-col max-lg:gap-12">
                <motion.div
                            variants={subscribeVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="footer_panel_4 leading-[52px] lg:hidden text-center max-md:leading-[30px] flex flex-col items-start text-white"
                        >
                            <h3 className=" w-full font-[600] text-[20px] max-lg:text-lg">Subscribe</h3>
                            <p className=" w-full text-center text-[14px] max-md:text-sm max-md:font-[400] leading-[23px] text-[#8F90A6]">Subscribe to get latest property, blog news from us</p>
                            <div className="panel_4_search_bar w-full mt-4 flex justify-between items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    className="w-full h-full bg-white p-4 max-md:py-0 max-md:h-[38.93px] rounded-[15px] outline-none text-black text-xs"
                                /> 
                                 <div className="bg-[#ED371C] px-6 max-sm:px-2 max-sm:py-2 max-sm:text-xs rounded-full mr-3 flex justify-center items-center whitespace-nowrap">
                                    Subscribe
                                </div>
                            </div>
                        </motion.div>
                    <div className="grid grid-cols-[4fr_2fr_2fr_3fr] max-lg:grid-cols-[3fr_2fr_2fr] place-items-end items-start gap-2 lg:gap-6 md:gap-2">
                        <motion.div
                            variants={panelVariants}
                            custom={0}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="footer_panel_1 text-[#8F90A6] max-lg:hidden"
                        >
                            <div className="flex flex-col justify-between items-start gap-6">
                                <Image
                                    width={182}
                                    height={63}
                                    src="/images/footer_icon.png"
                                    className="h-[63px] rounded-full bg-white"
                                    alt=""
                                />
                                <div className="panel1_info_and_logo leading-[31px]">
                                    <p className="font-[400] text-[14px] max-md:text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    <div className="footer_panel_1_logo flex gap-6 my-4">
                                        {[
                                            "facebook_logo.png",
                                            "twitter_logo.png",
                                            "instagram_logo.png",
                                            "linkedIn_logo.png"
                                        ].map((icon, index) => (
                                            <motion.div
                                                key={icon}
                                                variants={socialIconVariants}
                                                custom={index}
                                                initial="hidden"
                                                animate={isInView ? "visible" : "hidden"}
                                            >
                                                <Image width={22} height={22} src={`/images/${icon}`} alt="" className="w-[22px] h-[22px]" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <p className="font-[400] text-[13px]">© 2021 . All rights reserved.</p>
                            </div>
                        </motion.div>

                        <motion.div
                        variants={panelVariants}
                        custom={0}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="footer_panel_1 text-[#8F90A6] lg:hidden"
                    >
                        <div className="flex flex-col justify-between items-start gap-6">
                            <Image
                                width={182}
                                height={63}
                                src="/images/footer_icon.png"
                                className="h-[30px] w-auto rounded-full bg-white"
                                alt=""
                            />
                            <div className="panel1_info_and_logo leading-[31px] max-sm:leading-[20px]">
                                <p className="font-[400] text-[14px] max-md:text-[10px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                                <div className="footer_panel_1_logo flex gap-2.5">
                                    {[
                                        "facebook_logo.png",
                                        "twitter_logo.png",
                                        "instagram_logo.png",
                                        "linkedIn_logo.png"
                                    ].map((icon, index) => (
                                        <motion.div
                                            key={icon}
                                            variants={socialIconVariants}
                                            custom={index}
                                            initial="hidden"
                                            animate={isInView ? "visible" : "hidden"}
                                        >
                                            <Image width={22} height={22} src={`/images/${icon}`} alt="" className="w-[22px] h-[22px] max-md:w-[10px] max-md:h-[10px]" />
                                        </motion.div>
                                    ))}
                                </div>
                                <p className="font-[400] text-[13px] max-md:text-[10px]">© 2021 . All rights reserved.</p>
                            </div>
                        </div>
                    </motion.div>

                        <motion.div
                            variants={panelVariants}
                            custom={1}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="footer_panel_2"
                        >
                            <ul className="flex flex-col justify-between items-start max-sm:leading-[45px] sm:leading-[52px] max-md:text-sm max-md:leading-[30px] text-white">
                                <li className="font-[600] max-md:font-medium text-[20px] max-md:text-base mb-2 text-start">Take a tour</li>
                                <li>Features</li>
                                <li>Partners</li>
                                <li>Pricing</li>
                                <li>Product</li>
                                <li>Support</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={panelVariants}
                            custom={2}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="footer_panel_3"
                        >
                            <ul className="flex flex-col justify-between items-start max-sm:leading-[45px] sm:leading-[52px] max-md:text-sm max-md:leading-[30px] text-white">
                                <li className="font-[600] max-md:font-medium text-[20px] max-md:text-base mb-2 text-start">Our Company</li>
                                <li>About Us</li>
                                <li>Agents</li>
                                <li>Blog</li>
                                <li>Media</li>
                                <li>Contact Us</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={subscribeVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            className="footer_panel_4 leading-[52px] max-lg:hidden max-md:leading-[30px] flex flex-col items-start gap-3 text-white"
                        >
                            <h3 className="font-[600] text-[20px] max-md:text-[12px]">Subscribe</h3>
                            <p className="text-[14px] max-md:text-[10px] max-md:font-[400] leading-[23px] text-[#8F90A6]">Subscribe to get latest property, blog news from us</p>
                            <div className="panel_4_search_bar w-full bg-white flex justify-between items-center rounded-[15px]">
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    className="w-full h-full p-4 max-md:py-0 max-md:h-[38.93px] rounded-tl-[15px] outline-none text-black rounded-bl-[15px] text-xs"
                                /> 
                                 <div className="bg-[#ED371C] p-2 max-sm:px-1 max-sm:py-0 rounded-full mr-3 flex justify-center items-center text-xs whitespace-nowrap">
                                    Subscribe
                                </div>
                            </div>
                        </motion.div>
                    </div>
             
                </div>

            </div>
        </>
    );
}