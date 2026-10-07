"use client";

import React from "react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import { Layout, ShoppingCart, Smartphone, MessageSquare, CircleAlert, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function ProjectsSection() {
    return (
        <div className="pt-10 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-5xl mx-auto px-8">
            <PixelCard
                title="Portfolio Website (This)"
                icon={<Layout className="w-20 h-20 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]" />}
                colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                activeColor="#0ea5e9"
                href="#"
            />
            <PixelCard
                title="Financial Consultation Website"
                icon={<Smartphone className="w-20 h-20 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]" />}
                colors={["#e0f2fe", "#bae6fd", "#0284c7"]}
                activeColor="#0284c7"
                href="https://accshift.com/"
                target="_blank"
                rel="noopener noreferrer"
            />
            <PixelCard
                title="Forum Website"
                icon={<MessageSquare className="w-20 h-20 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]" />}
                colors={["#e0f2fe", "#fde047", "#eab308"]}
                activeColor="#eab308"
                href="https://gucampusbridge-frontend.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
            />
            <PixelCard
                title="E-commerce Website"
                icon={<ShoppingCart className="w-20 h-20 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]" />}
                colors={["#fce7f3", "#fbcfe8", "#db2777"]}
                activeColor="#db2777"
                href="#"
            />
            <LegendCard />
        </div>
    );
}

interface PixelCardProps {
    title: string;
    icon: React.ReactNode;
    colors: string[];
    activeColor: string;
    href: string;
    target?: string;
    rel?: string;
}

function PixelCard({ title, icon, colors, activeColor, href, target, rel }: PixelCardProps) {
    return (
        <Link
            href={href}
            target={target}
            rel={rel}
            className="block group relative w-[300px] overflow-hidden border border-border rounded-[32px] aspect-square transition-colors duration-200 hover:border-[var(--active-color)] focus:outline-[5px] focus:outline-[Highlight]"
            style={{ "--active-color": activeColor } as React.CSSProperties}
        >
            <PixelCanvas
                gap={10}
                speed={25}
                colors={colors}
                variant="icon"
            />
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-4">
                {icon}
                <span className="text-xl font-bold text-muted-foreground group-hover:text-[var(--active-color)] transition-colors duration-300">
                    {title}
                </span>
            </div>
        </Link>
    );
}

function LegendCard() {
    return (
        <div
            className="group relative w-full max-w-[632px] h-[300px] col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden border border-border rounded-[32px] p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 hover:border-zinc-400 dark:hover:border-zinc-700 bg-background/50 dark:bg-zinc-900/40 backdrop-blur-sm"
        >
            <div className="relative z-10 flex flex-col justify-between h-full w-full select-none">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-foreground">Project Status</span>
                        <span className="text-xs text-muted-foreground font-normal">(On hover)</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest">
                        Legend
                    </span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2.5 my-auto">
                    {/* 1. Red - Not Completed */}
                    <div className="group/item flex items-center justify-between px-4 py-2.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-border/70 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] group-hover/item:scale-125 transition-transform shrink-0" />
                            <span className="text-sm font-semibold text-foreground">1. Red</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">-</span>
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">
                                Not Completed
                            </span>
                        </div>
                    </div>

                    {/* 2. Yellow - In Progress */}
                    <div className="group/item flex items-center justify-between px-4 py-2.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-border/70 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)] group-hover/item:scale-125 transition-transform shrink-0" />
                            <span className="text-sm font-semibold text-foreground">2. Yellow</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">-</span>
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">
                                In Progress
                            </span>
                        </div>
                    </div>

                    {/* 3. Blue - Completed */}
                    <div className="group/item flex items-center justify-between px-4 py-2.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-border/70 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.7)] group-hover/item:scale-125 transition-transform shrink-0" />
                            <span className="text-sm font-semibold text-foreground">3. Blue</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">-</span>
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">
                                Completed
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

