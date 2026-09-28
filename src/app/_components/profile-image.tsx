"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import cn from "classnames";
import { FaUser } from "react-icons/fa6";

type Props = {
  src: string;
  alt: string;
};

export function ProfileImage({ src, alt }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-xl border-4 border-neutral-300 dark:border-slate-600 bg-neutral-200 dark:bg-slate-800 transition-all duration-300 flex items-center justify-center">
      {/* Placeholder */}
      <div
        className={cn(
          "about-pfp-skeleton absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-slate-800 transition-opacity duration-500",
          isLoading ? "opacity-100 animate-pulse" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      >
        <FaUser className="w-1/3 h-1/3 text-neutral-400/50 dark:text-slate-600/50" />
      </div>

      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 288px, 384px"
        priority
        className={cn(
          "about-pfp-img rounded-full object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
      />

      <noscript>
        <style>{`
          .about-pfp-img { opacity: 1 !important; }
          .about-pfp-skeleton { display: none !important; }
        `}</style>
      </noscript>
    </div>
  );
}
