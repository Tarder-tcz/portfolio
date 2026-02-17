"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MagneticButton = ({ children, className, onClick }: MagneticButtonProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const mouseX = useSpring(x, springConfig);
    const mouseY = useSpring(y, springConfig);

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        x.set(middleX * 0.15); // Magnetic pull strength
        y.set(middleY * 0.15);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            className={cn("relative cursor-pointer", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            onMouseEnter={() => setIsHovered(true)}
            style={{ x: mouseX, y: mouseY }}
            onClick={onClick}
        >
            <div
                className={cn(
                    "relative flex items-center justify-center overflow-hidden rounded-full border-2 transition-colors duration-300",
                    "w-32 h-32 md:w-48 md:h-48",
                    // Border colors
                    "border-neutral-900 dark:border-white"
                )}
            >
                {/* Fill Background */}
                <motion.div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        // Fill colors
                        "bg-neutral-900 dark:bg-white"
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                {/* Text/Content */}
                <div className="relative z-10 font-bold uppercase tracking-wider text-sm md:text-base transition-colors duration-300">
                    {/* Text colors handled by parent specific logic or children themselves, 
               but here we enforce contrast against the fill */}
                    <span className={cn(
                        "transition-colors duration-300",
                        isHovered
                            ? "text-white dark:text-black" // Inverted text on hover
                            : "text-neutral-900 dark:text-white" // Standard text
                    )}>
                        {children || "Explore"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
