"use client";

import React, { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu as MenuIcon, X, Home, Mail, User, Moon, Sun, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { MenuItem, MenuContainer } from "@/components/ui/fluid-menu";
import DockMorph from "@/components/ui/dock-morph";
import { cn } from "@/lib/utils";
import emailjs from '@emailjs/browser';
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function ContactPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Magnetic Logic
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const mouseX = useSpring(mx, springConfig);
    const mouseY = useSpring(my, springConfig);
    const [isHovered, setIsHovered] = useState(false);
    const [isReady, setIsReady] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        mx.set(middleX * 0.15);
        my.set(middleY * 0.15);
    };

    const resetMagnetic = () => {
        mx.set(0);
        my.set(0);
        setIsHovered(false);
    };

    const { snakePath, textContent } = React.useMemo(() => {
        const path = "M -170,1200 " + Array.from({ length: 40 }).map((_, i) => {
            const x1 = -170 + i * 180;
            const x2 = x1 + 180;
            const r = 90; // Half of the 180 spacing
            return i % 2 === 0
                ? `L ${x1},-200 A ${r} ${r} 0 0 1 ${x2},-200`
                : `L ${x1},1200 A ${r} ${r} 0 0 0 ${x2},1200`;
        }).join(" ");
        const text = Array(150).fill("CONTACT ME ").join("");
        return { snakePath: path, textContent: text };
    }, []);


    const ThemeIcon = ({ className }: { className?: string }) => {
        return (
            <div className={cn("relative h-6 w-6", className)}>
                <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
        );
    };

    const toggleTheme = (e: React.MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        // @ts-ignore
        if (!document.startViewTransition) {
            setTheme(theme === "dark" ? "light" : "dark");
            return;
        }

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(theme === "dark" ? "light" : "dark");
            });
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];
            document.documentElement.animate(
                {
                    clipPath: theme === "dark" ? [...clipPath].reverse() : clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-in",
                    fill: "forwards",
                    pseudoElement: theme === "dark"
                        ? "::view-transition-old(root)"
                        : "::view-transition-new(root)",
                }
            );
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            // Placeholder keys from env
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "default_service";
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "default_template";
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "default_public_key";

            if (formRef.current) {
                // To actually send emails, you need valid EmailJS credentials. 
                // This will fail with a 400 error if placeholders are used, but we catch it.
                await emailjs.sendForm(serviceId, templateId, formRef.current, {
                    publicKey: publicKey,
                });
                setSubmitStatus("success");
                formRef.current.reset();
            }
        } catch (error) {
            console.error("EmailJS Error:", error);
            // Even if it fails due to placeholders, we show error for realism
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setSubmitStatus("idle");
                if (submitStatus === "success") {
                    setIsDialogOpen(false);
                }
            }, 3000);
        }
    };

    return (
        <main className="h-auto min-h-screen w-full relative overflow-hidden">
            <style>{`
                @keyframes custom-ping {
                    0% { transform: scale(1); opacity: 0.4; }
                    85% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .animate-custom-ping {
                    animation: custom-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    will-change: transform, opacity;
                }
                .animation-delay-1250 {
                    animation-delay: 1.25s;
                }
            `}</style>
            
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none -z-20">
                <div
                    className={cn(
                        "absolute inset-0",
                        "bg-zinc-50 dark:bg-zinc-900",
                        "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]",
                        "from-indigo-200 via-zinc-50 to-zinc-50",
                        "dark:from-indigo-950 dark:via-zinc-900 dark:to-zinc-900"
                    )}
                />
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[100px]" />
                <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[60%] rounded-full bg-purple-400/20 blur-[100px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px]" />
            </div>

            {/* Background Animated S-Curve Text Carousel */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
                <svg
                    className="w-full h-full opacity-50"
                    viewBox="0 0 2000 1000"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <path
                        id="snakePath"
                        d={snakePath}
                        fill="none"
                        stroke="none"
                    />
                    <text className="text-[120px] font-black tracking-widest fill-zinc-800/20 dark:fill-zinc-200/20 uppercase">
                        <motion.textPath 
                            href="#snakePath"
                            initial={{ startOffset: "0%" }}
                            animate={{ startOffset: "-50%" }}
                            transition={{ duration: 240, ease: "linear", repeat: Infinity }}
                        >
                            {textContent}
                        </motion.textPath>
                    </text>
                </svg>
            </div>

            {/* Navigation Menus */}
            <div className="fixed top-6 right-6 z-50 hidden md:block">
                <MenuContainer>
                    <MenuItem
                        icon={
                            <div className="relative w-6 h-6">
                                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
                                    <MenuIcon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
                                    <X size={24} strokeWidth={1.5} />
                                </div>
                            </div>
                        }
                    />
                    <MenuItem href="/" icon={<Home size={24} strokeWidth={1.5} />} />
                    <MenuItem href="/about" icon={<User size={24} strokeWidth={1.5} />} />
                    <MenuItem href="/contact" icon={<Mail size={24} strokeWidth={1.5} />} />
                    <MenuItem
                        onClick={toggleTheme}
                        icon={
                            <div className="relative w-6 h-6">
                                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 dark:opacity-0 dark:scale-0 dark:rotate-180">
                                    <Sun size={24} strokeWidth={1.5} />
                                </div>
                                <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 dark:opacity-100 dark:scale-100 dark:rotate-0">
                                    <Moon size={24} strokeWidth={1.5} />
                                </div>
                            </div>
                        }
                    />
                </MenuContainer>
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 block md:hidden w-auto">
                <DockMorph
                    position="bottom"
                    items={[
                        { icon: Home, label: "Home", onClick: () => router.push("/") },
                        { icon: User, label: "About", onClick: () => router.push("/about") },
                        { icon: Mail, label: "Contact", onClick: () => router.push("/contact") },
                        {
                            icon: ThemeIcon,
                            label: "Theme",
                            onClick: (e: any) => toggleTheme(e),
                        },
                    ]}
                />
            </div>

            {/* Centered Content Area */}
            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                <AnimatePresence mode="wait">
                    {!isDialogOpen ? (
                        <motion.button
                            ref={buttonRef}
                            onClick={() => setIsDialogOpen(true)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={resetMagnetic}
                            onMouseEnter={() => setIsHovered(true)}
                            style={{ x: mouseX, y: mouseY }}
                            className="relative inline-flex items-center justify-center cursor-pointer w-40 h-40 md:w-64 md:h-64"
                        >
                            {/* SVG Circle Drawing Animation */}
                            {!isReady && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90">
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="calc(50% - 1px)"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-neutral-900 dark:text-white"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                                    />
                                </svg>
                            )}

                            {/* Pulsating Rings - Render only after animations finish */}
                            {isReady && (
                                <>
                                    <div className="absolute inset-0 rounded-full border-2 border-neutral-900 dark:border-white pointer-events-none animate-custom-ping" />
                                    <div className="absolute inset-0 rounded-full border-2 border-neutral-900 dark:border-white pointer-events-none animate-custom-ping animation-delay-1250" />
                                </>
                            )}

                            {/* Layout Morph Element - The actual button visuals */}
                            <motion.div
                                key="contact-button"
                                layoutId="contact-modal"
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border-2 transition-colors duration-300",
                                    isReady ? "border-neutral-900 dark:border-white" : "border-transparent"
                                )}
                            >
                                {/* Fill Background */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isHovered ? 1 : 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                                {/* Text - Fades in */}
                                <motion.div 
                                    className="relative z-10 font-bold uppercase tracking-wider text-sm md:text-base transition-colors duration-300"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className={cn(
                                        "transition-colors duration-300",
                                        isHovered ? "text-white dark:text-black" : "text-neutral-900 dark:text-white"
                                    )}>
                                        Get In Touch
                                    </span>
                                </motion.div>
                            </motion.div>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="contact-dialog"
                            layoutId="contact-modal"
                            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Dialog Close Button */}
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-20"
                            >
                                <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                            </button>

                            <div className="p-8">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                        Send a Message
                                    </h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                                        I'll get back to you as soon as possible.
                                    </p>
                                </div>

                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="user_name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="user_name"
                                            name="user_name"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-900 dark:text-zinc-100"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="user_email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="user_email"
                                            name="user_email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-900 dark:text-zinc-100"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-900 dark:text-zinc-100 resize-none"
                                            placeholder="What's on your mind?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full relative flex items-center justify-center py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                                    >
                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />

                                        <span className="relative flex items-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : submitStatus === "success" ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                                                    Sent Successfully!
                                                </>
                                            ) : submitStatus === "error" ? (
                                                "Error Sending (Check Keys)"
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
