"use client";

import { type ComponentPropsWithoutRef, type MouseEvent, type ReactNode, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = ComponentPropsWithoutRef<"a"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export function MagneticButton({
  children,
  className,
  variant = "primary",
  icon = <ArrowRight aria-hidden="true" className="h-4 w-4" />,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.16, y: y * 0.22 });
  }

  return (
    <a
      ref={ref}
      className={cn(
        "group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan/70",
        variant === "primary" &&
          "bg-white text-ink-950 shadow-[0_0_40px_rgba(86,228,255,.22)] hover:bg-neural-silver",
        variant === "secondary" &&
          "glass text-white hover:border-neural-cyan/40 hover:text-neural-cyan",
        variant === "ghost" && "text-white/80 hover:text-white",
        className
      )}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      </span>
      {variant === "primary" ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-10 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80 transition-transform duration-700 group-hover:translate-x-[18rem]"
        />
      ) : null}
    </a>
  );
}
