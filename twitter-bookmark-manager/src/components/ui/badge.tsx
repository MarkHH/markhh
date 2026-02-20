import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, color, className, onClick }: BadgeProps) {
  const style = color
    ? { backgroundColor: `${color}15`, color, borderColor: `${color}30` }
    : {};

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        !color && "border-surface-200 bg-surface-100 text-surface-600",
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
