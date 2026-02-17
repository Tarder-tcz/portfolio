"use client";

import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ParallaxElementProps {
    children: ReactNode;
    speed?: number; // 0 = no movement, 1 = normal scroll, >1 faster, <1 slower, negative = reverse
    className?: string;
    offset?: number; // initial offset in pixels
}

export const ParallaxElement = ({
    children,
    speed = 0.5,
    className,
    offset = 0
}: ParallaxElementProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // We map the scroll progress (0 to 1) to a pixel value based on the speed.
    // A speed of 0.5 means it moves at half speed relative to scroll (creating depth).
    // range: [start, end] -> [start_y, end_y]

    // Calculate distance based on typical viewport height to give reasonable movement
    const y = useTransform(scrollYProgress, [0, 1], [offset, offset - (200 * speed)]);

    // Add a spring for smoother catch-up
    const ySpring = useSpring(y, { stiffness: 400, damping: 40 });

    return (
        <div ref={ref} className={cn("relative", className)}>
            <motion.div style={{ y: ySpring }}>
                {children}
            </motion.div>
        </div>
    );
};
