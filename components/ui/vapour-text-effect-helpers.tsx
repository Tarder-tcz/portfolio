
import { Particle } from "./vapour-text-effect";

export const scrambleParticles = (particles: Particle[], spread: number) => {
    particles.forEach(p => {
        const angle = Math.random() * Math.PI * 2;
        const dist = (Math.random() * 50 + 50) * spread; // Push them out
        p.x = p.originalX + Math.cos(angle) * dist;
        p.y = p.originalY + Math.sin(angle) * dist;
        p.opacity = 0; // Start invisible
        p.velocityX = 0;
        p.velocityY = 0;
    });
};

export const updateParticlesAssemble = (
    particles: Particle[],
    deltaTime: number,
    spread: number,
    duration: number
) => {
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
};
