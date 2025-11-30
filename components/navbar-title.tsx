"use client";
import Image from "next/image";
import Link from "next/link";
import { Ref } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function NavbarTitle({
    logoRef,
    pathname,
    isAtTop,
    isHome
}: {
    logoRef: Ref<HTMLDivElement>;
    pathname: string;
    isAtTop: boolean;
    isHome: boolean;
}) {
    useGSAP(() => {
        if (!logoRef || typeof logoRef === 'function') return;

        const mm = gsap.matchMedia();
        const isHomePage = pathname === '/';

        // Define scale values for different breakpoints
        const scaleConfig = {
            mobile: { y: 80, scale: 2.5 },
            tablet: { y: 100, scale: 3.5 },
            desktop: { y: 150, scale: 6 }
        };

        const normalState = { y: 0, scale: 1, duration: 0.5, ease: "power2.out" };

        const animateLogo = (config: { y: number; scale: number }) => {
            const targetState = (isAtTop && isHomePage) ? config : { y: 0, scale: 1 };
            gsap.to(logoRef.current, { ...targetState, duration: 0.5, ease: "power2.out" });
        };

        mm.add("(max-width: 639px)", () => animateLogo(scaleConfig.mobile));
        mm.add("(min-width: 640px) and (max-width: 1023px)", () => animateLogo(scaleConfig.tablet));
        mm.add("(min-width: 1024px)", () => animateLogo(scaleConfig.desktop));

        return () => mm.revert();
    }, [isAtTop, pathname, logoRef]);

    return (
        <Link href="/" className="flex items-center">
            <div ref={logoRef}>
                <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                    className={`w-24 h-16 lg:w-32 object-contain select-none ${!isHome ? 'invert' : ''}`}
                    style={{ userSelect: 'none' }}
                    priority
                    draggable={false}
                />
            </div>
        </Link>
    );
}