"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";

export const LearnMoreSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    return (
        <section ref={ref} className="w-full max-w-7xl mx-auto min-h-[50vh] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-6 py-20">
            {/* Left Text Section */}
            <div className="flex flex-col items-center md:items-start justify-center space-y-2 md:space-y-4">
                <h2 className={cn(
                    "font-bold text-neutral-900 dark:text-white leading-tight text-center md:text-left flex flex-col items-center md:items-start",
                    "text-[10vw] md:text-[8vw] lg:text-[7vw]",
                    isInView ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-lg",
                    "transition-all duration-[1500ms] ease-out"
                )}>
                    <span>Learn more</span>
                    <span className="text-neutral-500 dark:text-neutral-400">About me</span>
                </h2>
            </div>

            {/* Right Button Section */}
            <div className={cn(
                "flex items-center justify-center mt-10 md:mt-0 opacity-0 transition-opacity duration-1000 delay-500",
                isInView ? "opacity-100" : "opacity-0"
            )}>
                <Link href="/about">
                    <MagneticButton>
                        About Me
                    </MagneticButton>
                </Link>
            </div>
        </section>
    );
};
