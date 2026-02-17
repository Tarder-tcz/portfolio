"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";

export const HeroNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        let rafId: number;

        const handleScroll = () => {
            // Basic throttling using requestAnimationFrame
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    setIsScrolled(true);
                } else {
                    setIsScrolled(false);
                }
            });
        };

        handleScroll(); // Check initial scroll position
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    if (!hasMounted) return null;

    return (
        <>
            {/* HERO STATE TEXT (Centered, 3 Lines) */}
            {/* HERO STATE TEXT (Left aligned, Right scroll) */}
            {/* HERO STATE TEXT (Centered on mobile, Left aligned on md, Right scroll) */}
            <div
                className={cn(
                    "fixed inset-0 z-40 flex flex-col md:flex-row items-center md:justify-between px-6 md:px-20 pointer-events-none transition-all duration-600 ease-in-out",
                    isScrolled ? "opacity-0 scale-95 blur-md" : "opacity-100 scale-100 blur-0"
                )}
            >
                <div className="flex flex-col items-center md:items-start justify-center space-y-2 md:space-y-4 pt-20 md:pt-0">
                    <div className={cn(
                        "font-bold text-neutral-900 dark:text-white leading-tight text-center md:text-left flex flex-col items-center md:items-start",
                        "text-[10vw] md:text-[8vw] lg:text-[7vw]",
                        hasMounted ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-lg",
                        "transition-all duration-[2000ms] ease-out"
                    )}>
                        <span>Hello! I am, </span>
                        <AnimatedText
                            text="Eshaan Saha"
                            textClassName="text-[10vw] md:text-[8vw] lg:text-[7vw] font-bold text-neutral-500 dark:text-neutral-400 p-0 m-0 leading-tight"
                            className="items-center md:items-start justify-center md:justify-start gap-0"
                            underlineClassName="text-neutral-500 dark:text-neutral-400"
                        />
                    </div>
                </div>

                {/* Scroll Prompt */}
                <div
                    className={cn(
                        "text-neutral-500 dark:text-neutral-400 text-sm md:text-base transition-all duration-1000",
                        "mt-8 md:mt-0 relative md:static", // Flow naturally on mobile (centered by parent flex-col), static on desktop
                        hasMounted ? "opacity-100 translate-y-0 md:translate-x-0 delay-[2000ms]" : "opacity-0 translate-y-10 md:translate-x-10"
                    )}
                >
                    Scroll to Explore ↓
                </div>
            </div>

            {/* NAVBAR STATE TEXT (Top Left, 1 Line) */}
            <div
                className={cn(
                    "fixed top-0 left-0 w-full md:w-auto md:top-6 md:left-6 lg:left-10 z-50 transition-all duration-600 ease-in-out pointer-events-none", // Remove mix-blend-difference to ensure bg visibility
                    isScrolled
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4"
                )}
            >
                <div className="bg-black/90 md:bg-transparent px-6 py-4 md:p-0 w-full md:w-auto shadow-sm md:shadow-none border-b border-white/10 md:border-none backdrop-blur-md md:backdrop-blur-none rounded-b-lg">
                    <h1 className="text-xl md:text-2xl font-bold text-white md:text-neutral-900 md:dark:text-white whitespace-nowrap">
                        Portfolio of Eshaan Saha
                    </h1>
                </div>
            </div>
        </>
    );
};
