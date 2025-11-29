"use client";
import Image from "next/image";
import Link from "next/link";
import { Ref, useEffect } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import path from "path";

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

        if(pathname !== '/') {
            gsap.to(logoRef.current, {
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
            return;
        }   

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

        // do this even resize is happening
    }, [isAtTop, pathname, logoRef ]);

    useEffect(() => {

        const fixedLogoOnNavigate = () => {
            if (logoRef && !(typeof logoRef === 'function')) {
                gsap.to(logoRef.current, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        };

        window.addEventListener('resize', fixedLogoOnNavigate);

        return () => window.removeEventListener('resize', fixedLogoOnNavigate);

        // do this even resize is happening
    }, [logoRef]);



    return (
        <Link href="/" className="flex items-center">
            <div ref={logoRef}>
                <Image
                    src={"/images/logo.svg"}
                    alt="Logo"
                    width={100}
                    height={100}
                    className={`w-24 h-16 lg:w-32  object-contain select-none ${!isHome ? 'invert' : ''}`}    
                    style={{ userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                    priority={true}
                    draggable={false}
                />
            </div>
        </Link>
    );
}