import { useState, useEffect, RefObject } from 'react';

/**
 * Custom hook to check if an element is in the viewport
 */
export function useIsInView(ref: RefObject<HTMLElement | null>, rootMargin: string = '0px') {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0, rootMargin }
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, rootMargin]);

    return isInView;
}
