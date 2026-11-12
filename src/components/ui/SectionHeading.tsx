import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <p
        className={cn(
          "mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.4em]",
          light ? "text-champagne-300" : "text-champagne-600",
        )}
      >
        <span className="h-px w-8 bg-current" aria-hidden />
        {eyebrow}
        <span className="h-px w-8 bg-current" aria-hidden />
      </p>
      <h2
        className={cn(
          "font-display text-4xl font-medium leading-tight md:text-5xl",
          light ? "text-cream" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed", light ? "text-nude-200" : "text-ink-500")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
