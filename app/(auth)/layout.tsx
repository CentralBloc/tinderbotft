import Logo from "@/components/logo";
import Image from "next/image";
import React from "react";

export default function AuthLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="grid h-screen lg:grid-cols-2">
            <div
                className="container relative flex h-full max-w-md flex-col justify-between overflow-y-auto py-8 md:mx-auto md:max-w-xl">
                <Logo/>
                <div className="flex-1">
                    {children}
                </div>
                <p className="w-full text-center text-[10px] text-gray-400 md:text-xs">
                    © {new Date().getFullYear()} AutoDateSwiper. All rights reserved.
                </p>
            </div>
            <div className="hidden h-screen overflow-hidden lg:block">
                <Image
                    src="/images/image-layout.webp"
                    alt="auth-layout"
                    height={1920}
                    width={1690}
                    priority
                    className="size-full object-cover"
                />
            </div>
        </div>
    );
}