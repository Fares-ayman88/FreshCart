"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  title: string;
  images: string[];
}

export function ProductGallery({ title, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="surface-card relative aspect-square overflow-hidden rounded-[2rem] bg-white p-6">
        <Image
          alt={title}
          className="h-full w-full object-contain"
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          src={activeImage}
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            className={cn(
              "surface-card relative aspect-square overflow-hidden rounded-[1.25rem] border p-2 transition",
              activeIndex === index ? "border-[var(--brand)]" : "border-transparent",
            )}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              alt={`${title} ${index + 1}`}
              className="h-full w-full object-contain"
              fill
              sizes="120px"
              src={image}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
