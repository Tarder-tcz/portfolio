
"use client";

import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Server, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem, MenuContainer } from "@/components/ui/fluid-menu";
import { Menu as MenuIcon, X, Home, Mail, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import DockMorph from "@/components/ui/dock-morph";
import { useRouter } from "next/navigation";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";
import { MagicTextReveal } from "@/components/ui/magic-text-reveal";
import { FocusCards } from "@/components/ui/focus-cards";
import { ParallaxElement } from "@/components/ui/parallax-element";
import StickyTabs from "@/components/ui/sticky-section-tabs";
import TiltedCard from "@/components/ui/tilted-card";

const skills = [
    { text: "HTML", Icon: Code, color: (theme: string) => theme === "dark" ? "#f97316" : "#ea580c", iconClass: "text-orange-500" },
    { text: "CSS", Icon: Palette, color: (theme: string) => theme === "dark" ? "#3b82f6" : "#2563eb", iconClass: "text-blue-500" },
    { text: "JavaScript", Icon: Code, color: (theme: string) => theme === "dark" ? "#facc15" : "#eab308", iconClass: "text-yellow-500" },
    { text: "React", Icon: Code, color: (theme: string) => theme === "dark" ? "#60a5fa" : "#2563eb", iconClass: "text-blue-400" },
    { text: "Java", Icon: Code, color: (theme: string) => theme === "dark" ? "#ef4444" : "#dc2626", iconClass: "text-red-500" },
    { text: "Python", Icon: Code, color: (theme: string) => theme === "dark" ? "#3b82f6" : "#2563eb", iconClass: "text-blue-500" },
    { text: "MySQL", Icon: Server, color: (theme: string) => theme === "dark" ? "#f97316" : "#ea580c", iconClass: "text-orange-500" },
];

export default function AboutPage() {
    const [phase, setPhase] = useState<"intro" | "split">("intro");
    const [triggerDisintegrate, setTriggerDisintegrate] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [activeCardId, setActiveCardId] = useState<string | undefined>(undefined);
    const { setTheme, theme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        // Set initial width
        setWindowWidth(window.innerWidth);

        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 150);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeoutId);
        }
    }, []);

    useEffect(() => {
        if (phase === "intro") {
            window.scrollTo(0, 0);
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [phase]);

    useEffect(() => {
        // 1. Reveal completes approx 1s + hold time.
        // 2. We want to hold for 2.5s AFTER reveal.
        // Reveal duration is hard to know exactly unless we track it, but let's assume ~1.5s total for reveal.
        // So 1.5s + 2.5s = 4s.

        // We'll effectively wait 3.5s then trigger disintegration
        const holdTimer = setTimeout(() => {
            setTriggerDisintegrate(true);
        }, 3500);

        // After disintegration triggers (takes ~1s), switch to split phase
        const splitTimer = setTimeout(() => {
            setPhase("split");
        }, 3500 + 1000); // Wait for vaporize duration

        return () => {
            clearTimeout(holdTimer);
            clearTimeout(splitTimer);
        };
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

    const cards = [
        {
            title: "My anime interests",
            src: "https://images.unsplash.com/photo-1764649841485-82d7bd92760a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            href: "#",
            content: (
                <div className="space-y-4">
                    <p>You could say i'm a big anime fan, but to me anime is like a comfort food that you can just keep eating for a while and not get bored. That sentence seemed like I LOVE anime, but its more of like a chill session. I did get invested into some titles like: </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Attack on Titan</li>
                        <li>My Hero Academia</li>
                        <li>Demon Slayer</li>
                        <li>Jujutsu Kaisen, etc.</li>
                    </ul>
                    <p>These are just some popular titles, but I do like the more niche/underrated animes. Some genres include: </p>
                    <ul className="list-disc list-inside spacy-y-1">
                        <li>Fantasy</li>
                        <li>Isekai</li>
                        <li>Rom-Com</li>
                        <li>Action/Adventure</li>
                        <li>Slice of Life</li>
                        <li>Sci-Fi, etc.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Passion for Design",
            src: "https://images.unsplash.com/photo-1766955181247-d3d5b09b9b8a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            href: "#",
            content: (
                <div className="space-y-4">
                    <p>Design is a controversial topic for me. Even though I am a CS Student with zero to negligible background in design, which would mean my primary focus should be logical problem solving, I just can't help but see the design philosphy in each and every creation whether its hardware or software.</p>
                    <p>Ever since I was a kid i was fascinated by infrastructure, how things were built, how they were connected, how they functioned, etc. My love for architecture bloomed when i got my hands on the game called Minecraft (I'm sure you've heard of it). I would always dream big, building massive cities with realistic infrastructure to the best of my abilities.</p>
                </div>
            )
        },
        {
            id: "music",
            title: "Passion for Music",
            src: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            href: "#",
            content: (
                <div className="space-y-4">
                    <p>For me, music is like an escape. It helps me relax and find out about new things. It's also a hype machine that really helps me lock in on my work or whatever it is I am doing. Some of the music genres i like/listen to daily:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Hip-Hop</li>
                        <li>R&B</li>
                        <li>Pop</li>
                        <li>Dark Trap</li>
                        <li>EDM</li>
                        <li>Aesthetic Rap</li>
                        <li>Alternative</li>
                    </ul>
                    <p>Some artists that I like:</p>
                    <ul className="list-disc list-inside space-y-1 mb-6">
                        <li>1nonly</li>
                        <li>Chris Grey</li>
                        <li>Darci</li>
                        <li>bbno$</li>
                        <li>Ari Abdul</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Passion for Coding",
            src: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            href: "#",
            content: (
                <div className="space-y-4">
                    <p>Coding is just a part of my design philosophy. It helps me bring my ideas to life. I like solving logical problems and I like tinkering with computers all day. Hell its also one of the most important part of my life as I want to be a web or game developer.</p>
                    <p>I think you have already scrolled past the languages I am proficient in up above. And obviously I keep myself busy trying to learn/research more and newer languages everyday.</p>
                </div>
            )
        },
        {
            title: "Interest in games",
            src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=647&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            href: "#",
            content: (
                <div className="space-y-4">
                    <p>Gaming helps me unwind. I currently enjoy:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Open World RPGs</li>
                        <li>Strategy Games</li>
                        <li>Indie Gems like Hollow Knight</li>
                    </ul>
                </div>
            )
        },
    ];

    return (
        <main className="h-auto min-h-screen w-full relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div
                    className={cn(
                        "absolute inset-0",
                        // Base Gradient
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

            <AnimatePresence>
                {phase === "split" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="fixed top-6 right-6 z-50 hidden md:block"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {phase === "split" && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 block md:hidden w-auto"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full h-full flex flex-col md:flex-row min-h-screen relative z-10">
                {/* Left Content Area - Scrollable */}
                <motion.div
                    className={cn(
                        "w-full md:w-1/2 flex flex-col justify-center p-8 md:p-20 order-2 md:order-1",
                        phase === "intro" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                    )}
                    initial={{ opacity: 0, x: -50 }}
                    animate={phase === "split" ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    <div className="max-w-xl mx-auto space-y-8 mt-20 md:mt-0">
                        <ParallaxElement speed={0.2}>
                            <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
                                Who am I?
                            </h2>
                            <div className="prose dark:prose-invert text-lg md:text-xl text-neutral-600 dark:text-neutral-300 space-y-6 mt-8">
                                <p>
                                    My name is Eshaan Saha. I am a
                                    passionate developer and creator from India, dedicated to building immersive
                                    digital experiences. My journey involves a deep dive into modern web
                                    technologies, constantly exploring the boundaries of what's possible in
                                    the browser.
                                </p>
                                <p>
                                    I am in constant search for new technologies and frameworks to
                                    improve my skills and knowledge. I am always looking for new ways to
                                    improve my code and make it more efficient.
                                </p>
                                <p>
                                    As this is an about me page, I also need to tell you a bit, well about me.
                                    Continue on to see what I am capable of.
                                </p>
                            </div>
                        </ParallaxElement>

                        {/* DESKTOP: Skills Section (Hidden on Mobile) */}
                        <div className="hidden md:block">
                            <ParallaxElement speed={0.4} className="pt-10">
                                <h3 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">My Skills</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    {skills.map((skill) => (
                                        <MagicTextReveal
                                            key={skill.text}
                                            text={skill.text}
                                            fontSize={32}
                                            color={skill.color(theme || "light")} // Fallback for safety
                                            className="w-full h-[200px]"
                                        >
                                            <skill.Icon className={cn("w-8 h-8 ml-2", skill.iconClass)} />
                                        </MagicTextReveal>
                                    ))}
                                </div>
                            </ParallaxElement>
                        </div>

                        {/* MOBILE: Sticky Tabs for Skills & Interests */}
                        <div className="block md:hidden mt-10">
                            <StickyTabs
                                mainNavHeight="14px"
                                rootClassName="bg-transparent text-foreground"
                                navSpacerClassName="hidden"
                                sectionClassName="bg-transparent mb-20"
                                stickyHeaderContainerClassName="mx-auto w-[90%] rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg px-6 py-2 top-4 z-30"
                                headerContentWrapperClassName="bg-transparent border-none"
                                headerContentLayoutClassName="p-0 flex justify-center"
                                titleClassName="text-sm font-medium"
                                contentLayoutClassName="py-8"
                            >
                                <StickyTabs.Item title="My Skills" id="skills">
                                    <div className="grid grid-cols-1 gap-4 w-full">
                                        {skills.map((skill) => (
                                            <MagicTextReveal
                                                key={skill.text}
                                                text={skill.text}
                                                fontSize={32}
                                                color={skill.color(theme || "light")}
                                                className="w-full h-[150px]"
                                            >
                                                <skill.Icon className={cn("w-8 h-8 ml-2", skill.iconClass)} />
                                            </MagicTextReveal>
                                        ))}
                                    </div>
                                </StickyTabs.Item>

                                <StickyTabs.Item title="Interests" id="interests">
                                    <div className="w-full">
                                        <h2 className="text-2xl font-semibold text-black dark:text-white text-center mb-6">
                                            Personal <br />
                                            <span className="text-4xl font-bold mt-1 leading-none">
                                                Interests
                                            </span>
                                        </h2>
                                        <FocusCards cards={cards} onCardOpenChange={(id, isOpen) => setActiveCardId(isOpen ? id : undefined)} />
                                    </div>
                                </StickyTabs.Item>
                            </StickyTabs>
                        </div>

                    </div>
                </motion.div>

                {/* Right Sticky Area - Intro Text */}
                <div className={cn(
                    "w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 order-1 md:order-2",
                    "md:h-screen md:sticky md:top-0"
                )}>

                    {/* RIGHT SIDE TEXT (Re-forms here) */}
                    <AnimatePresence>
                        {phase === 'split' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1 }}
                                className="w-full"
                            >
                                <div className="w-full flex flex-col items-start justify-center gap-0">
                                    <div className="w-full h-[60px]">
                                        <VaporizeTextCycle
                                            texts={["About"]}
                                            tag={Tag.H2}
                                            font={{
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: "60px",
                                                fontWeight: 800
                                            }}
                                            animation={{
                                                vaporizeDuration: 1,
                                                fadeInDuration: 0.5,
                                                waitDuration: 2.5
                                            }}
                                            spread={1}
                                            density={2}
                                            color={theme === "dark" ? "#ffffff" : "#000000"}
                                            loop={false}
                                            alignment="left"
                                        />
                                    </div>
                                    <div className="w-full h-[100px]">
                                        <VaporizeTextCycle
                                            texts={["Eshaan Saha"]}
                                            tag={Tag.H1}
                                            font={{
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: "90px",
                                                fontWeight: 900
                                            }}
                                            animation={{
                                                vaporizeDuration: 1,
                                                fadeInDuration: 0.5,
                                                waitDuration: 2.5
                                            }}
                                            spread={1}
                                            density={2}
                                            color={theme === "dark" ? "#ffffff" : "#000000"}
                                            loop={false}
                                            alignment="left"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div >

            {/* DESKTOP: Personal Interests Section (Hidden on Mobile) */}
            < div className="relative z-10 w-full py-20 px-6 hidden md:block" >
                <ParallaxElement speed={0.6}>
                    <h2 className="text-2xl md:text-4xl font-semibold text-black dark:text-white text-center mb-10">
                        Personal <br />
                        <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                            Interests
                        </span>
                    </h2>
                    <div className="max-w-7xl mx-auto">
                        <FocusCards cards={cards} onCardOpenChange={(id, isOpen) => setActiveCardId(isOpen ? id : undefined)} />
                    </div>
                </ParallaxElement>
            </div >

            {/* FLOATING MUSIC CARDS */}
            <AnimatePresence>
                {activeCardId === "music" && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[
                            {
                                src: "https://a1.mzstatic.com/r40/Music211/v4/36/ed/58/36ed58dc-ca09-c54d-de2c-620bed1d62cd/196874039847.jpg",
                                alt: "A$AP Rocky - Don't Be Dumb",
                                className: "top-[10%] left-[5%] md:left-[10%] -rotate-6",
                                amplitude: 4
                            },
                            {
                                src: "https://a1.mzstatic.com/r40/Music211/v4/c8/d1/6f/c8d16ff5-a087-19a8-aaf2-cc8bd6a5c3ca/810129987614.jpg",
                                alt: "LET THE WORLD BURN - Chris Grey",
                                className: "bottom-[10%] left-[5%] md:left-[15%] rotate-12",
                                amplitude: 5
                            },
                            {
                                src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=640&auto=format&fit=crop",
                                alt: "Electronic Vibes",
                                className: "top-[15%] right-[5%] md:right-[15%] rotate-6",
                                amplitude: 3
                            },
                            {
                                src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=640&auto=format&fit=crop",
                                alt: "Neon Nights",
                                className: "bottom-[15%] right-[5%] md:right-[10%] -rotate-12",
                                amplitude: 5
                            }
                        ].map((album, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                className={cn("absolute pointer-events-auto w-[120px] md:w-[220px] aspect-square", album.className)}
                            >
                                <TiltedCard
                                    imageSrc={album.src}
                                    altText={album.alt}
                                    containerHeight="100%"
                                    containerWidth="100%"
                                    imageHeight="100%"
                                    imageWidth="100%"
                                    rotateAmplitude={album.amplitude}
                                    scaleOnHover={1.1}
                                    showMobileWarning={false}
                                    showTooltip={true}
                                    displayOverlayContent={true}
                                    overlayContent={
                                        <p className="tilted-card-demo-text text-white font-bold text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-xl">
                                            {album.alt}
                                        </p>
                                    }
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Intro Overlay - CENTERED BIG TEXT */}
            <AnimatePresence>
                {
                    phase === 'intro' && (
                        <motion.div
                            className="fixed inset-0 z-40 flex items-center justify-center bg-transparent pointer-events-none px-4"
                            exit={{ opacity: 0, transition: { duration: 0.5 } }} // Fade out the container AFTER component finishes vaporizing
                        >
                            {/* Added min-h to prevent canvas collapse and cutoff */}
                            <div className="w-full max-w-[90vw] text-center min-h-[50vh] py-20 flex items-center justify-center">
                                <VaporizeTextCycle
                                    texts={["About Eshaan Saha"]}
                                    tag={Tag.H1}
                                    font={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: `${Math.max(40, windowWidth * 0.08)} px`, // Dynamic large size in px
                                        fontWeight: 900
                                    }}
                                    animation={{
                                        vaporizeDuration: 1.2, // Slightly slower vaporize for effect
                                        fadeInDuration: 0.5,
                                        waitDuration: 0 // Controlled externally
                                    }}
                                    spread={2} // More spread for the big explosion
                                    density={4} // Higher density for big text
                                    color={theme === "dark" ? "#ffffff" : "#000000"}
                                    loop={false}
                                    triggerVaporize={triggerDisintegrate}
                                    alignment="center"
                                />
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >

        </main >
    );
}
