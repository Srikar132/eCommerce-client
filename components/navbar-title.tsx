"use client";
import Image from "next/image";
import Link from "next/link";
import { Ref } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function NavbarTitle({
    logoRef,
    pathname,
    isAtTop
}: {
    logoRef: Ref<HTMLDivElement>;
    pathname: string;
    isAtTop: boolean;
}) {
    
    useGSAP(() => {
        if (pathname !== '/' || !logoRef || typeof logoRef === 'function') return;

        const mm = gsap.matchMedia();

        // Mobile (< 640px)
        mm.add("(max-width: 639px)", () => {
            if (isAtTop) {
                gsap.to(logoRef.current, {
                    y: 80,
                    scale: 2.5,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(logoRef.current, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        mm.add("(min-width: 640px) and (max-width: 1023px)", () => {
            if (isAtTop) {
                gsap.to(logoRef.current, {
                    y: 100,
                    scale: 3.5,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(logoRef.current, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        mm.add("(min-width: 1024px)", () => {
            if (isAtTop) {
                gsap.to(logoRef.current, {
                    y: 150,
                    scale: 6,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(logoRef.current, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        return () => mm.revert();
    }, [isAtTop, pathname, logoRef]);

    return (
        <Link href="/" className="flex items-center">
            <div ref={logoRef}>
                <Image
                    src={"/images/logo.svg"}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="w-24 h-16 lg:w-32  object-contain select-none"
                    style={{ userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                    priority={true}
                    draggable={false}
                />
            </div>
        </Link>
    );
}