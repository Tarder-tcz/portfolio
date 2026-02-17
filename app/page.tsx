"use client";
import React from "react";
import { flushSync } from "react-dom";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { ProjectsSection } from "@/components/projects-section";
import { MenuItem, MenuContainer } from "@/components/ui/fluid-menu";
import { Menu as MenuIcon, X, Home, Mail, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import DockMorph from "@/components/ui/dock-morph";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { HeroNavbar } from "@/components/ui/hero-navbar";
import { LearnMoreSection } from "@/components/ui/learn-more-section";

export default function CombinedDemo() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const ThemeIcon = ({ className }: { className?: string }) => {
    return (
      <div className={cn("relative h-6 w-6", className)}>
        <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    )
  }

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
          pseudoElement: theme === "dark"
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };


  return (
    <main className="h-auto min-h-screen relative">
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

      <DockMorph
        position="bottom"
        className="block md:hidden"
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

      <HeroNavbar />

      <div className="flex flex-col pt-[100vh]">

        <div className="pt-20 pb-0 flex flex-col items-center justify-center min-h-[150px]">
          <GooeyText
            texts={["My", "Current", "And", "Planned", "Projects"]}
            morphTime={1}
            cooldownTime={0.25}
            className="font-bold h-40"
            textClassName="text-black dark:text-white"
          />
        </div>
        <ProjectsSection />
        <LearnMoreSection />
      </div>
    </main>
  );
}
