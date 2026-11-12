"use client";

import { MoveHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BeforeAfterProps = {
  before: string;
  after: string;
  alt: string;
  /** Clases de encuadre/zoom para cada foto (ej. "object-right scale-[1.3] origin-[50%_45%]"). */
  beforePosition?: string;
  afterPosition?: string;
};

/** Comparador interactivo antes/después (arrastrar o teclado). */
export function BeforeAfter({
  before,
  after,
  alt,
  beforePosition = "object-center",
  afterPosition = "object-center",
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-md select-none overflow-hidden rounded-[2rem] bg-nude-200 shadow-2xl">
      <Image
        src={after}
        alt={`Después: ${alt}`}
        fill
        sizes="(min-width: 768px) 448px, 100vw"
        className={cn("object-cover", afterPosition)}
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src={before}
          alt={`Antes: ${alt}`}
          fill
          sizes="(min-width: 768px) 448px, 100vw"
          className={cn("object-cover", beforePosition)}
        />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-night/70 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
        Antes
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-champagne-500/90 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-night backdrop-blur">
        Después
      </span>

      {/* Divisor */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden>
        <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90 shadow" />
        <div className="absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-champagne-600 shadow-xl">
          <MoveHorizontal className="size-5" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Deslizar para comparar antes y después"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
