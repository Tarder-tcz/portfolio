"use client";

import React, { useRef, useEffect, useState, createElement, useMemo, useCallback, memo } from "react";
import { useIsInView } from "@/hooks/use-is-in-view";

export const Component = () => {
    return (
        <div className='bg-black h-screen w-screen flex justify-center items-center'>
            <VaporizeTextCycle
                texts={["21st.dev", "Is", "Cool"]}
                font={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "70px",
                    fontWeight: 600
                }}
                color="rgb(255,255, 255)"
                spread={5}
                density={5}
                animation={{
                    vaporizeDuration: 2,
                    fadeInDuration: 1,
                    waitDuration: 0.5
                }}
                direction="left-to-right"
                alignment="center"
                tag={Tag.H1}
            />
        </div>
    )
}

export enum Tag {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    P = "p",
}

type VaporizeTextCycleProps = {
    texts: string[];
    font?: {
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: number;
    };
    color?: string;
    spread?: number;
    density?: number;
    animation?: {
        vaporizeDuration?: number;
        fadeInDuration?: number;
        waitDuration?: number;
    };
    direction?: "left-to-right" | "right-to-left";
    alignment?: "left" | "center" | "right";
    tag?: Tag;
};

export type Particle = {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    color: string;
    opacity: number;
    originalAlpha: number;
    velocityX: number;
    velocityY: number;
    angle: number;
    speed: number;
    shouldFadeQuickly?: boolean;
};

type TextBoundaries = {
    left: number;
    right: number;
    width: number;
};

declare global {
    interface HTMLCanvasElement {
        textBoundaries?: TextBoundaries;
    }
}

export default function VaporizeTextCycle({
    texts = ["Next.js", "React"],
    font = {
        fontFamily: "sans-serif",
        fontSize: "50px",
        fontWeight: 400,
    },
    color = "rgb(255, 255, 255)",
    spread = 5,
    density = 5,
    animation = {
        vaporizeDuration: 2,
        fadeInDuration: 1,
        waitDuration: 0.5,
    },
    direction = "left-to-right",
    alignment = "center",
    tag = Tag.P,
    loop = true,
    triggerVaporize = false,
}: VaporizeTextCycleProps & { loop?: boolean; triggerVaporize?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    // @ts-ignore
    const isInView = useIsInView(wrapperRef);
    const lastFontRef = useRef<string | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [animationState, setAnimationState] = useState<"static" | "vaporizing" | "fadingIn" | "waiting" | "revealing">("static");
    const vaporizeProgressRef = useRef(0);
    const fadeOpacityRef = useRef(0);
    const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
    const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true);
    const isFirstRender = useRef(true);

    // Calculate device pixel ratio
    const globalDpr = useMemo(() => {
        if (typeof window !== "undefined") {
            const isMobile = window.innerWidth < 768;
            return isMobile ? 1 : (Math.min(window.devicePixelRatio, 2) || 1);
        }
        return 1;
    }, []);

    // Memoize static styles
    const wrapperStyle = useMemo(() => ({
        width: "100%",
        height: "100%",
        pointerEvents: "none" as const,
    }), []);

    const canvasStyle = useMemo(() => ({
        minWidth: "30px",
        minHeight: "20px",
        pointerEvents: "none" as const,
    }), []);

    // Memoize animation durations
    const animationDurations = useMemo(() => ({
        VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2) * 1000,
        FADE_IN_DURATION: (animation.fadeInDuration ?? 1) * 1000,
        WAIT_DURATION: (animation.waitDuration ?? 0.5) * 1000,
    }), [animation.vaporizeDuration, animation.fadeInDuration, animation.waitDuration]);

    // Memoize font and spread calculations
    const fontConfig = useMemo(() => {
        const fontSize = parseInt(font.fontSize?.replace("px", "") || "50");
        const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize);
        const MULTIPLIED_VAPORIZE_SPREAD = VAPORIZE_SPREAD * spread;
        return {
            fontSize,
            VAPORIZE_SPREAD,
            MULTIPLIED_VAPORIZE_SPREAD,
            font: `${font.fontWeight ?? 400} ${fontSize * globalDpr}px ${font.fontFamily}`,
        };
    }, [font.fontSize, font.fontWeight, font.fontFamily, spread, globalDpr]);

    // Memoize particle update function
    const memoizedUpdateParticles = useCallback((particles: Particle[], vaporizeX: number, deltaTime: number) => {
        return updateParticles(
            particles,
            vaporizeX,
            deltaTime,
            fontConfig.MULTIPLIED_VAPORIZE_SPREAD,
            animationDurations.VAPORIZE_DURATION,
            direction,
            transformedDensity
        );
    }, [fontConfig.MULTIPLIED_VAPORIZE_SPREAD, animationDurations.VAPORIZE_DURATION, direction, transformedDensity]);

    // Memoize render function
    const memoizedRenderParticles = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
        renderParticles(ctx, particles, globalDpr);
    }, [globalDpr]);

    // Start animation cycle when in view
    useEffect(() => {
        if (isInView) {
            if (isFirstRender.current) {
                // Do NOT set isFirstRender to false immediately.
                // Leave it true so renderCanvas sees it.
                // It will be set to false in the timeout or subsequent logic.

                // Initialize particles for reveal
                const initTimeout = setTimeout(() => {
                    isFirstRender.current = false; // Now we can say we are done with first render phase
                    setAnimationState("revealing");

                    // Scramble again just in case renderCanvas missed it (rare/redundant but safe)
                    if (particlesRef.current.length > 0) {
                        // Actually, if we are in 'revealing', the loop will start updating them.
                        // We rely on renderCanvas to have scrambled them initially.
                    }
                }, 100);
                return () => clearTimeout(initTimeout);
            } else if (animationState === "static") {
                if (triggerVaporize) {
                    const startAnimationTimeout = setTimeout(() => {
                        setAnimationState("vaporizing");
                    }, 0);
                    return () => clearTimeout(startAnimationTimeout);
                } else if (loop) {
                    const startAnimationTimeout = setTimeout(() => {
                        setAnimationState("vaporizing");
                    }, 0);
                    return () => clearTimeout(startAnimationTimeout);
                }
            }
        } else {
            // Optional: Reset if out of view? For now let's just pause.
        }
    }, [isInView, loop, spread, triggerVaporize, animationState]);

    // Animation loop - only run when in view
    useEffect(() => {
        if (!isInView) return;

        let lastTime = performance.now();
        let frameId: number;

        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d", { willReadFrequently: true }); // optimize for readback

            if (!canvas || !ctx || !particlesRef.current.length) {
                frameId = requestAnimationFrame(animate);
                return;
            }

            // Clear canvas only if we're going to draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update based on animation state
            switch (animationState) {
                case "static": {
                    // Even in static, if we just mounted, we might be scrambled? 
                    // No, static means fully assembled usually. 
                    // Unless we are waiting for 'revealing' to start.
                    // But 'revealing' state handles the assembly animation.
                    memoizedRenderParticles(ctx, particlesRef.current);
                    break;
                }
                case "vaporizing": {
                    // Calculate progress based on duration
                    vaporizeProgressRef.current += deltaTime * 100 / (animationDurations.VAPORIZE_DURATION / 1000);

                    // Get text boundaries
                    const textBoundaries = canvas.textBoundaries;
                    if (!textBoundaries) break;

                    // Calculate vaporize position based on text boundaries and direction
                    const progress = Math.min(100, vaporizeProgressRef.current);
                    const vaporizeX = direction === "left-to-right"
                        ? textBoundaries.left + textBoundaries.width * progress / 100
                        : textBoundaries.right - textBoundaries.width * progress / 100;

                    const allVaporized = memoizedUpdateParticles(particlesRef.current, vaporizeX, deltaTime);
                    memoizedRenderParticles(ctx, particlesRef.current);

                    // Check if vaporization is complete
                    if (vaporizeProgressRef.current >= 100 && allVaporized) {
                        setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
                        setAnimationState("fadingIn");
                        fadeOpacityRef.current = 0;
                    }
                    break;
                }
                case "fadingIn": {
                    fadeOpacityRef.current += deltaTime * 1000 / animationDurations.FADE_IN_DURATION;

                    // Use particles for fade-in
                    ctx.save();
                    ctx.scale(globalDpr, globalDpr);
                    particlesRef.current.forEach(particle => {
                        particle.x = particle.originalX;
                        particle.y = particle.originalY;
                        const opacity = Math.min(fadeOpacityRef.current, 1) * particle.originalAlpha;
                        const color = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
                        ctx.fillStyle = color;
                        ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
                    });
                    ctx.restore();

                    if (fadeOpacityRef.current >= 1) {
                        setAnimationState("waiting");
                        setTimeout(() => {
                            if (loop) {
                                setAnimationState("vaporizing");
                                vaporizeProgressRef.current = 0;
                                resetParticles(particlesRef.current);
                            } else {
                                setAnimationState("static");
                            }
                        }, animationDurations.WAIT_DURATION);
                    }
                    break;
                }
                case "revealing": {
                    // Move particles towards original position
                    const allAssembled = updateParticlesAssemble(
                        particlesRef.current,
                        deltaTime,
                        fontConfig.MULTIPLIED_VAPORIZE_SPREAD, // Use spread for speed/chaos reference
                        animationDurations.VAPORIZE_DURATION / 2 // Reveal might need custom duration, using half vaporize for speed
                    );

                    memoizedRenderParticles(ctx, particlesRef.current);

                    if (allAssembled) {
                        setAnimationState("static");
                        // Ensure perfectly snapped
                        resetParticles(particlesRef.current);
                        memoizedRenderParticles(ctx, particlesRef.current);
                    }
                    break;
                }
                case "waiting": {
                    memoizedRenderParticles(ctx, particlesRef.current);
                    if (loop) {
                        // Only transition if looping
                        // Logic handled by useEffect or here? 
                        // Current logic sets timeout in 'fadingIn' to go to 'vaporizing'.
                        // 'waiting' is just a passive state here? 
                        // Check fadingIn transition logic.
                    }
                    break;
                }
            }

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [
        animationState,
        isInView,
        texts.length,
        direction,
        globalDpr,
        memoizedUpdateParticles,
        memoizedRenderParticles,
        animationDurations.FADE_IN_DURATION,
        animationDurations.WAIT_DURATION,
        animationDurations.VAPORIZE_DURATION
    ]);

    useEffect(() => {
        renderCanvas({
            framerProps: {
                texts,
                font,
                color,
                alignment,
            },
            canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
            wrapperSize,
            particlesRef,
            globalDpr,
            currentTextIndex,
            transformedDensity,
            isFirstRender,
        });

        const currentFont = font.fontFamily || "sans-serif";
        return handleFontChange({
            currentFont,
            lastFontRef,
            canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
            wrapperSize,
            particlesRef,
            globalDpr,
            currentTextIndex,
            transformedDensity,
            isFirstRender,
            framerProps: {
                texts,
                font,
                color,
                alignment,
            },
        });
    }, [texts, font, color, alignment, wrapperSize, currentTextIndex, globalDpr, transformedDensity]);

    // Handle resize
    useEffect(() => {
        const container = wrapperRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setWrapperSize({ width, height });
            }

            renderCanvas({
                framerProps: {
                    texts,
                    font,
                    color,
                    alignment,
                },
                canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
                wrapperSize: { width: container.clientWidth, height: container.clientHeight },
                particlesRef,
                globalDpr,
                currentTextIndex,
                transformedDensity,
                isFirstRender,
            });
        });

        resizeObserver.observe(container);
        return () => {
            resizeObserver.disconnect();
        };
    }, [wrapperRef.current]);

    // Initial size detection
    useEffect(() => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setWrapperSize({
                width: rect.width,
                height: rect.height,
            });
        }
    }, []);

    return (
        <div ref={wrapperRef} style={wrapperStyle}>
            <canvas ref={canvasRef} style={canvasStyle} />
            <SeoElement tag={tag} texts={texts} />
        </div>
    );
}

// ------------------------------------------------------------ //
// SEO ELEMENT
// ------------------------------------------------------------ //
const SeoElement = memo(({ tag = Tag.P, texts }: { tag: Tag, texts: string[] }) => {
    const style = useMemo(() => ({
        position: "absolute" as const,
        width: "0",
        height: "0",
        overflow: "hidden",
        userSelect: "none" as const,
        pointerEvents: "none" as const,
    }), []);

    // Ensure tag is a valid HTML element string
    const safeTag = Object.values(Tag).includes(tag) ? tag : "p";

    return createElement(safeTag, { style }, texts?.join(" ") ?? "");
});

// ------------------------------------------------------------ //
// FONT HANDLING
// ------------------------------------------------------------ //
const handleFontChange = ({
    currentFont,
    lastFontRef,
    canvasRef,
    wrapperSize,
    particlesRef,
    globalDpr,
    currentTextIndex,
    transformedDensity,
    framerProps,
    isFirstRender,
}: {
    currentFont: string;
    lastFontRef: React.MutableRefObject<string | null>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    wrapperSize: { width: number; height: number };
    particlesRef: React.MutableRefObject<Particle[]>;
    globalDpr: number;
    currentTextIndex: number;
    transformedDensity: number;
    framerProps: VaporizeTextCycleProps;
    isFirstRender: React.MutableRefObject<boolean>;
}) => {
    if (currentFont !== lastFontRef.current) {
        lastFontRef.current = currentFont;

        // Re-render after 1 second to catch the loaded font
        const timeoutId = setTimeout(() => {
            cleanup({ canvasRef, particlesRef }); // Clean up before re-rendering
            renderCanvas({
                framerProps,
                canvasRef,
                wrapperSize,
                particlesRef,
                globalDpr,
                currentTextIndex,
                transformedDensity,
                isFirstRender,
            });
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            cleanup({ canvasRef, particlesRef });
        };
    }

    return undefined;
};

// ------------------------------------------------------------ //
// CLEANUP
// ------------------------------------------------------------ //
const cleanup = ({ canvasRef, particlesRef }: { canvasRef: React.RefObject<HTMLCanvasElement>; particlesRef: React.MutableRefObject<Particle[]> }) => {
    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Clear particles
    if (particlesRef.current) {
        particlesRef.current = [];
    }
};

// ------------------------------------------------------------ //
// RENDER CANVAS
// ------------------------------------------------------------ //
const renderCanvas = ({
    framerProps,
    canvasRef,
    wrapperSize,
    particlesRef,
    globalDpr,
    currentTextIndex,
    transformedDensity,
    isFirstRender,
}: {
    framerProps: VaporizeTextCycleProps;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    wrapperSize: { width: number; height: number };
    particlesRef: React.MutableRefObject<Particle[]>;
    globalDpr: number;
    currentTextIndex: number;
    transformedDensity: number;
    isFirstRender: React.MutableRefObject<boolean>;
}) => {
    const canvas = canvasRef.current;
    if (!canvas || !wrapperSize.width || !wrapperSize.height) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = wrapperSize;

    // Scale for retina/high DPI displays
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * globalDpr);
    canvas.height = Math.floor(height * globalDpr);

    // Parse font size
    // Parse initial font size
    let fontSize = parseInt(framerProps.font?.fontSize?.replace("px", "") || "50");
    let font = `${framerProps.font?.fontWeight ?? 400} ${fontSize * globalDpr}px ${framerProps.font?.fontFamily ?? "sans-serif"}`;
    const color = parseColor(framerProps.color ?? "rgb(153, 153, 153)");

    const currentText = framerProps.texts[currentTextIndex] || "Next.js";

    // Auto-scale font if text is wider than canvas
    ctx.font = font;
    const textMetrics = ctx.measureText(currentText);
    const maxTextWidth = canvas.width * 0.9; // 90% of canvas width to leave some padding

    if (textMetrics.width > maxTextWidth) {
        const scaleFactor = maxTextWidth / textMetrics.width;
        fontSize = Math.floor(fontSize * scaleFactor);
        font = `${framerProps.font?.fontWeight ?? 400} ${fontSize * globalDpr}px ${framerProps.font?.fontFamily ?? "sans-serif"}`;
    }

    // Calculate text position
    let textX;
    const textY = canvas.height / 2;

    // Dynamic Density for Performance
    // If font size is large, we need higher density (fewer particles) to prevent lag.
    let effectiveDensity = transformedDensity;
    if (fontSize > 100) {
        // Linearly increase density: at 100px -> density, at 200px -> density * 2, etc.
        // Or specific tiers.
        effectiveDensity = transformedDensity * (fontSize / 60);
    }

    // Ensure density isn't too low (causing too many particles)
    effectiveDensity = Math.max(effectiveDensity, 1);

    if (framerProps.alignment === "center") {
        textX = canvas.width / 2;
    } else if (framerProps.alignment === "left") {
        textX = 0;
    } else {
        textX = canvas.width;
    }

    // Create particles from the rendered text and get text boundaries
    // Note: We use effectiveDensity here instead of framerProps.element which would be wrong place to inject.
    // We need to modify createParticles to accept density or use the one in scope if it was inside the hook?
    // createParticles is outside. We should pass effectiveDensity to it. 
    // Wait, createParticles calls getImageData, it doesn't take density.
    // Ah, createParticles scans proper pixels. 
    // Let's check createParticles signature.
    // It is: const createParticles = (..., text, textX, textY, font, color, alignment)
    // It doesn't take density. It iterates pixels. 
    // We need to pass density to createParticles to skip pixels!

    const { particles, textBoundaries } = createParticles(ctx, canvas, currentText, textX, textY, font, color, framerProps.alignment || "left", effectiveDensity * globalDpr);

    // If first render, scramble immediately/hide
    // We access the ref passed from parent scope (which isn't passed here directly, need to update args)
    // Actually, renderCanvas is called from useEffect which has access to isFirstRender.

    // Store particles and text boundaries for animation
    particlesRef.current = particles;
    canvas.textBoundaries = textBoundaries;

    if (isFirstRender.current) {
        scrambleParticles(particles, 1); // Spread 1 default
        renderParticles(ctx, particles, globalDpr); // Render scrambled state
    }
};

// ------------------------------------------------------------ //
// PARTICLE SYSTEM
// ------------------------------------------------------------ //
const createParticles = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    text: string,
    textX: number,
    textY: number,
    font: string,
    color: string,
    alignment: "left" | "center" | "right",
    step: number = 3
) => {
    // Clear any previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text properties for sampling
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = alignment;
    ctx.textBaseline = "middle";
    ctx.imageSmoothingQuality = "high";
    ctx.imageSmoothingEnabled = true;

    if ('fontKerning' in ctx) {
        (ctx as any).fontKerning = "normal";
    }

    if ('textRendering' in ctx) {
        (ctx as any).textRendering = "geometricPrecision";
    }

    // Calculate text boundaries
    const metrics = ctx.measureText(text);
    let textLeft;
    const textWidth = metrics.width;

    if (alignment === "center") {
        textLeft = textX - textWidth / 2;
    } else if (alignment === "left") {
        textLeft = textX;
    } else {
        textLeft = textX - textWidth;
    }

    const textBoundaries = {
        left: textLeft,
        right: textLeft + textWidth,
        width: textWidth,
    };

    // Render the text for sampling
    ctx.fillText(text, textX, textY);

    // Clear before measuring/drawing for particle creation
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.fillText(text, textX, textY);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { width, height, data } = imageData;
    const particles: Particle[] = [];

    // Clear canvas again so we don't return with text drawn
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let minX = width;
    let maxX = 0;

    // Iterate with step (density)
    for (let py = 0; py < height; py += Math.floor(step)) {
        for (let px = 0; px < width; px += Math.floor(step)) {
            const index = (py * width + px) * 4;
            const alpha = data[index + 3];

            if (alpha > 0) {
                if (px < minX) minX = px;
                if (px > maxX) maxX = px;

                particles.push({
                    x: px,
                    y: py,
                    originalX: px,
                    originalY: py,
                    color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${alpha / 255})`,
                    opacity: alpha / 255,
                    originalAlpha: alpha / 255,
                    velocityX: 0,
                    velocityY: 0,
                    angle: 0,
                    speed: 0,
                });
            }
        }
    }

    // Clear the canvas after sampling
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    return { particles, textBoundaries };
};

// Helper functions for particle animation
const updateParticles = (
    particles: Particle[],
    vaporizeX: number,
    deltaTime: number,
    MULTIPLIED_VAPORIZE_SPREAD: number,
    VAPORIZE_DURATION: number,
    direction: string,
    density: number
) => {
    let allParticlesVaporized = true;

    particles.forEach(particle => {
        // Only animate particles that have been "vaporized"
        const shouldVaporize = direction === "left-to-right"
            ? particle.originalX <= vaporizeX
            : particle.originalX >= vaporizeX;

        if (shouldVaporize) {
            // When a particle is first vaporized, determine if it should fade quickly based on density
            if (particle.speed === 0) {
                // Initialize particle motion when first vaporized
                particle.angle = Math.random() * Math.PI * 2;
                particle.speed = (Math.random() * 1 + 0.5) * MULTIPLIED_VAPORIZE_SPREAD;
                particle.velocityX = Math.cos(particle.angle) * particle.speed;
                particle.velocityY = Math.sin(particle.angle) * particle.speed;

                // Determine if particle should fade quickly based on density
                // density of 1 means all particles animate normally
                // density of 0.5 means 50% of particles fade quickly
                particle.shouldFadeQuickly = Math.random() > density;
            }

            if (particle.shouldFadeQuickly) {
                // Quick fade out for particles marked to fade quickly
                particle.opacity = Math.max(0, particle.opacity - deltaTime);
            } else {
                // Apply normal particle physics and animation
                // Apply damping based on distance from original position
                const dx = particle.originalX - particle.x;
                const dy = particle.originalY - particle.y;
                const distanceFromOrigin = Math.sqrt(dx * dx + dy * dy);

                // Damping factor increases with distance, creating a more natural motion
                const dampingFactor = Math.max(0.95, 1 - distanceFromOrigin / (100 * MULTIPLIED_VAPORIZE_SPREAD));

                // Add slight random motion to create a more organic feel
                const randomSpread = MULTIPLIED_VAPORIZE_SPREAD * 3;
                const spreadX = (Math.random() - 0.5) * randomSpread;
                const spreadY = (Math.random() - 0.5) * randomSpread;

                // Update velocities with damping and random motion
                particle.velocityX = (particle.velocityX + spreadX + dx * 0.002) * dampingFactor;
                particle.velocityY = (particle.velocityY + spreadY + dy * 0.002) * dampingFactor;

                // Limit maximum velocity
                const maxVelocity = MULTIPLIED_VAPORIZE_SPREAD * 2;
                const currentVelocity = Math.sqrt(particle.velocityX * particle.velocityX + particle.velocityY * particle.velocityY);

                if (currentVelocity > maxVelocity) {
                    const scale = maxVelocity / currentVelocity;
                    particle.velocityX *= scale;
                    particle.velocityY *= scale;
                }

                // Update position
                particle.x += particle.velocityX * deltaTime * 20;
                particle.y += particle.velocityY * deltaTime * 10;

                // Calculate fade rate based on vaporize duration
                const baseFadeRate = 0.25;
                const durationBasedFadeRate = baseFadeRate * (2000 / VAPORIZE_DURATION);

                // Slower fade out for more persistence, scaled by duration
                particle.opacity = Math.max(0, particle.opacity - deltaTime * durationBasedFadeRate);
            }

            // Check if this particle is still visible
            if (particle.opacity > 0.01) {
                allParticlesVaporized = false;
            }
        } else {
            // If there are any particles not yet reached by the vaporize wave
            allParticlesVaporized = false;
        }
    });

    return allParticlesVaporized;
};

const renderParticles = (ctx: CanvasRenderingContext2D, particles: Particle[], globalDpr: number) => {
    ctx.save();
    ctx.scale(globalDpr, globalDpr);

    particles.forEach(particle => {
        if (particle.opacity > 0) {
            const color = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`);
            ctx.fillStyle = color;
            ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
        }
    });

    ctx.restore();
};

const resetParticles = (particles: Particle[]) => {
    particles.forEach(particle => {
        particle.x = particle.originalX;
        particle.y = particle.originalY;
        particle.opacity = particle.originalAlpha;
        particle.speed = 0;
        particle.velocityX = 0;
        particle.velocityY = 0;
    });
};

// ------------------------------------------------------------ //
// CALCULATE VAPORIZE SPREAD
// ------------------------------------------------------------ //
const calculateVaporizeSpread = (fontSize: number) => {
    // Convert font size string to number if needed
    const size = typeof fontSize === "string" ? parseInt(fontSize) : fontSize;

    // Define our known points for interpolation
    const points = [
        { size: 20, spread: 0.2 },
        { size: 50, spread: 0.5 },
        { size: 100, spread: 1.5 }
    ];

    // Handle edge cases
    if (size <= points[0].size) return points[0].spread;
    if (size >= points[points.length - 1].size) return points[points.length - 1].spread;

    // Find the two points to interpolate between
    let i = 0;
    while (i < points.length - 1 && points[i + 1].size < size) i++;

    // Linear interpolation between the two closest points
    const p1 = points[i];
    const p2 = points[i + 1];

    return p1.spread + (size - p1.size) * (p2.spread - p1.spread) / (p2.size - p1.size);
};

// ------------------------------------------------------------ //
// PARSE COLOR
// ------------------------------------------------------------ //
/**
 * Extracts RGB/RGBA values from a color string format
 * @param color - Color string (e.g. "rgb(12, 250, 163)")
 * @returns Valid RGBA color string
 */
const parseColor = (color: string) => {
    // Handle Hex values
    if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        if (hex.length === 3) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return `rgba(${r}, ${g}, ${b}, 1)`;
        } else if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, 1)`;
        }
    }

    // Try to match rgb/rgba pattern
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);

    if (rgbaMatch) {
        // If RGBA format
        const [_, r, g, b, a] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (rgbMatch) {
        // If RGB format
        const [_, r, g, b] = rgbMatch;
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    // Fallback to black if parsing fails
    console.warn("Could not parse color:", color);
    return "rgba(0, 0, 0, 1)";
};

/**
 * Maps a value from one range to another, optionally clamping the result.
 */
function transformValue(input: number, inputRange: number[], outputRange: number[], clamp = false): number {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;

    const progress = (input - inputMin) / (inputMax - inputMin);
    let result = outputMin + progress * (outputMax - outputMin);

    if (clamp) {
        if (outputMax > outputMin) {
            result = Math.min(Math.max(result, outputMin), outputMax);
        } else {
            result = Math.min(Math.max(result, outputMax), outputMin);
        }
    }

    return result;
}



function scrambleParticles(particles: Particle[], spread: number) {
    particles.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.random() * 50 + 50) * spread; // Push them out
        p.x = p.originalX + Math.cos(angle) * dist;
        p.y = p.originalY + Math.sin(angle) * dist;
        p.opacity = 0; // Start invisible
        p.velocityX = 0;
        p.velocityY = 0;
    });
}

function updateParticlesAssemble(
    particles: Particle[],
    deltaTime: number,
    spread: number,
    duration: number
) {
    let allAssembled = true;
    const speedMultiplier = 5000 / duration; // Tuned constant

    particles.forEach(p => {
        const dx = p.originalX - p.x;
        const dy = p.originalY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.5) {
            allAssembled = false;
            // Simple ease-out
            const vx = dx * 5 * deltaTime;
            const vy = dy * 5 * deltaTime;

            p.x += vx + (Math.random() - 0.5) * spread * 0.1; // Add jitter
            p.y += vy + (Math.random() - 0.5) * spread * 0.1;

            // Fade in
            if (p.opacity < p.originalAlpha) {
                p.opacity += deltaTime * 2;
            }
        } else {
            p.x = p.originalX;
            p.y = p.originalY;
            p.opacity = p.originalAlpha;
        }
    });

    return allAssembled;
}
