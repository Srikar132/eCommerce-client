"use client";
import Image from "next/image";
import Link from "next/link";
import { Ref } from "react";

export default function NavbarTitle({
    logoRef
}: {
    logoRef: Ref<HTMLDivElement>
}) {
    return (
        <div className="max-lg:hidden absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center lg:flex-initial">
            <Link href="/" className="flex items-center">
                <div ref={logoRef}>
                    <Image
                        src={"/images/logo.svg"}
                        alt="Logo"
                        width={100}
                        height={100}
                        className="w-24 h-24 lg:w-32 lg:h-32 object-contain select-none draggable=[false]"
                        quality={100}
                        priority={true}
                    />
                </div>
            </Link>
        </div>
    );
}