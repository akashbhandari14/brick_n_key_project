"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { giveCorrectImage } from "@/app/data";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeaderSection } from "../../redux/slices/headerSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { usePathname, useSearchParams } from "next/navigation";

interface NavLink {
    id: number;
    link: string;
    label: string;
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedNavLink, setSelectedNavLink] = useState("");
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true });
    const searchParams = useSearchParams();


    const pathname = usePathname();
    const newData = searchParams.get('new');
    const isLuxury = searchParams.get('isLuxury');
    console.log("This is the isLuxury value from the Header", isLuxury)


    const data = useSelector((state: RootState) => state.headerSection?.data);
    const dispatch = useDispatch<AppDispatch>();
    

    useEffect(() => {
        dispatch(fetchHeaderSection());
    }, [dispatch, selectedNavLink]);


    useEffect(()=>{
        console.log("This is the pathname", pathname)
        if(pathname === "/"){
            setSelectedNavLink("Home")
        }
        else if(pathname === "/map"){
            setSelectedNavLink("Master Map")
        }
        else if(newData){
            setSelectedNavLink("All Listing")
        }
        else if(isLuxury === 'true'){
            setSelectedNavLink("Luxury")
        }
        else{
            setSelectedNavLink("")
        }
    }, [pathname, isLuxury, newData]) // Added newData to dependency array


    const logoVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };


    const navItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: i * 0.1,
                ease: "easeOut",
            },
        }),
    };


    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
    };



    return (
        <>
            <div className="header_container w-full bg-bgColor py-4">
                <div
                    ref={ref}
                    className="header_inner_container w-[90%] h-[56px] 2xl:w-[80%] max-sm:w-[95%] mx-auto flex justify-between items-center py-6"
                >
                    {/* Logo with slide-in animation */}
                    <motion.div
                        variants={logoVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="nav_logo flex justify-start items-center bg-center"
                        onClick={()=>{setSelectedNavLink("Home")}}
                    >
                        <Link href="/">
                            <Image
                                width={100}
                                height={100}
                                src={giveCorrectImage(data?.data?.header_container?.LogoLink?.image?.url)}
                                onClick={()=>{setSelectedNavLink("HOME")} }
                                className="w-auto h-[56px] max-sm:w-auto max-sm:h-auto object-cover hover:scale-110 transition-transform duration-200"
                                alt="Nav_logo"
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation with staggered fade-in */}
                    <nav className="hidden lg:block">
                        <ul className="h-auto uppercase flex justify-center items-center gap-16 max-xl:gap-12 text-[#110229] text-xl leading-[36px] tracking-widest">
                            {(data?.data?.header_container?.navLinks as NavLink[])?.map(
                                (currElem, index) => (
                                    <motion.li
                                        key={"property" + currElem.id}
                                        custom={index}
                                        variants={navItemVariants}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        onClick={() => setSelectedNavLink(currElem?.label)}
                                        className={`cursor-pointer font-[500] transition-colors ${(selectedNavLink === currElem.label) ? "text-bgRed" : ""}`}
                                    >
                                        <Link href={currElem?.link}>
                                            {currElem.label}
                                        </Link>
                                    </motion.li>
                                )
                            )}
                        </ul>
                    </nav>

                    {/* Mobile Menu Button and Dropdown */}
                    <div className="lg:hidden relative">
                        <button
                            className="p-2 text-black"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu size={24} className={isMenuOpen ? "text-bgRed" : ""} />
                        </button>

                        {/* Mobile Dropdown Menu */}
                        {isMenuOpen && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={dropdownVariants}
                                className="absolute right-0 mt-2 w-max z-50"
                            >
                                <ul className="pt-2 flex flex-col items-end">
                                    {(data?.data?.header_container?.navLinks as NavLink[])?.map(
                                        (item, index) => (
                                            <motion.li
                                                key={"property" + item.id}
                                                variants={navItemVariants}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                className={`px-4 py-1.5`}
                                            >
                                                <div onClick={()=>{setIsMenuOpen(false)}} className="bg-gray-800 rounded-full py-2 px-6 w-fit text-center text-white font-medium tracking-wide hover:bg-gray-700 transition-colors whitespace-nowrap">
                                                    <Link className={`${(selectedNavLink == item?.label) ? "text-bgRed" : ""}`} href={item?.link}>
                                                        {item.label}
                                                    </Link>
                                                </div>
                                            </motion.li>
                                        )
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
