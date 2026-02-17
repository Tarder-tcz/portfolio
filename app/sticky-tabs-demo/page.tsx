"use client";

import React from 'react';
import StickyTabs from '@/components/ui/sticky-section-tabs';
import { Layers } from 'lucide-react'; // Using lucide-react as substitute for svg

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center text-center py-16">
        <Layers size={48} className="text-neutral-700 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-neutral-200">
            Content Area: {title}
        </h3>
        <p className="text-neutral-500 max-w-xl">
            This is where the detailed content for the '{title}' section would normally appear. For this demo, we're using this placeholder.
        </p>
    </div>
);

export default function StickyTabsDemoPage() {
    return (
        <div className="min-h-screen bg-black">
            <nav
                className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-white/15 bg-black"
                style={{ height: "4rem" }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-semibold text-lg">YourBrand</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <a href="/" className="hover:text-gray-300">Home</a>
                        <a href="#" className="hover:text-gray-300">Work</a>
                        <a href="#" className="hover:text-gray-300">About</a>
                        <a href="#" className="hover:text-gray-300">Contact</a>
                    </div>
                </div>
            </nav>
            <main style={{ paddingTop: "4rem" }}>
                <div className="bg-black text-white">
                    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                            Sticky Section Tabs
                        </h1>
                    </div>
                </div>
                <StickyTabs
                    mainNavHeight="4rem"
                    rootClassName="bg-black text-white"
                    navSpacerClassName="border-b border-white/15 bg-black"
                    sectionClassName="bg-[#131313]"
                    stickyHeaderContainerClassName="shadow-lg"
                    headerContentWrapperClassName="border-b border-t border-white/15 bg-black"
                    headerContentLayoutClassName="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"
                    titleClassName="my-0 text-2xl font-medium leading-none md:text-3xl lg:text-4xl"
                    contentLayoutClassName="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
                >
                    <StickyTabs.Item title="Step 1: Concept" id="concept">
                        <PlaceholderContent title="Concept" />
                    </StickyTabs.Item>
                    <StickyTabs.Item title="Step 2: Design" id="design">
                        <PlaceholderContent title="Design" />
                    </StickyTabs.Item>
                    <StickyTabs.Item title="Step 3: Development" id="development">
                        <PlaceholderContent title="Development" />
                    </StickyTabs.Item>
                    <StickyTabs.Item title="Step 4: Launch" id="launch">
                        <PlaceholderContent title="Launch" />
                    </StickyTabs.Item>
                </StickyTabs>
                <footer className="bg-black py-8 h-screen text-center text-gray-600 text-xl">
                    Thank you for checking out this demo!
                </footer>
            </main>
        </div>
    );
}
