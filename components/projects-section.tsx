"use client";

import React from "react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import { Layout, ShoppingCart, Smartphone, Bot } from "lucide-react";
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
                title="AI Chatbot"
                icon={<Bot className="w-20 h-20 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]" />}
                colors={["#fce7f3", "#fbcfe8", "#db2777"]}
                activeColor="#db2777"
                href="#"
            />
            <PixelCard
                title="E-commerce Website"
                icon={<ShoppingCart className="w-20 h-20 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]" />}
                colors={["#fce7f3", "#fbcfe8", "#db2777"]}
                activeColor="#db2777"
                href="#"
            />

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
