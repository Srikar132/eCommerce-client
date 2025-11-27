"use client";
import Link from "next/link";
import { Ref } from "react";

export default function NavbarTitle({
    logoRef
}: {
    logoRef: Ref<HTMLDivElement>
}) {
    return (
        <div className="absolute top-1/2 lg:top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center lg:flex-initial">
            <Link href="/" className="flex items-center">
                <div ref={logoRef}>
                    <span className="text-2xl text-white  font-black text-gray-900">FASHION</span>
                </div>
            </Link>
        </div>
    );
}