import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/images/logo-airam.png";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
};

const sizes = {
  sm: { className: "size-12 md:size-14", sizes: "56px" },
  md: { className: "size-24", sizes: "96px" },
  lg: { className: "size-40 md:size-52", sizes: "(min-width: 768px) 208px, 160px" },
};

/** Logotipo oficial de Estética Airam (emblema circular). */
export function Logo({ size = "md", priority = false, className }: LogoProps) {
  const s = sizes[size];
  return (
    <Image
      src={LOGO_SRC}
      alt="Airam – Ericka Reyes · Makeup, Haircare, Nails"
      width={1024}
      height={1024}
      sizes={s.sizes}
      priority={priority}
      className={cn(
        "rounded-full shadow-[0_0_40px_-8px_rgba(63,224,232,0.55)] ring-1 ring-champagne-300/60",
        s.className,
        className,
      )}
    />
  );
}
