import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export const stepTransition = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.25 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// ============================================================================
// STEP HEADER COMPONENT
// ============================================================================
interface StepHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step: number;
  totalSteps: number;
}

export function StepHeader({
  icon: Icon,
  title,
  description,
  step,
  totalSteps,
}: StepHeaderProps) {
  return (
    <motion.div variants={itemVariants} className="relative mb-8">
      {/* Background gradient decoration */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-2xl -z-10" />

      <div className="flex items-start gap-4">
        {/* Icon container with gradient */}
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
          <div className="relative p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {step}/{totalSteps}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// FORM SECTION COMPONENT
// ============================================================================
interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function FormSection({
  children,
  className,
  title,
  description,
}: FormSectionProps) {
  return (
    <motion.div variants={itemVariants} className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}

// ============================================================================
// FORM GRID COMPONENT
// ============================================================================
interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "grid gap-4",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// GLASSMORPHISM CARD COMPONENT
// ============================================================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
}: GlassCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "relative p-6 rounded-2xl",
        "bg-gradient-to-br from-background/80 to-background/40",
        "backdrop-blur-xl border border-border/50",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        hover &&
          "hover:border-primary/30 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// PREMIUM INPUT WRAPPER
// ============================================================================
interface InputWrapperProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function InputWrapper({
  icon: Icon,
  children,
  className,
}: InputWrapperProps) {
  return (
    <div className={cn("relative", className)}>
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
      )}
      {children}
    </div>
  );
}

// ============================================================================
// ANIMATED BADGE
// ============================================================================
interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function AnimatedBadge({
  children,
  variant = "default",
  className,
}: AnimatedBadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20",
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
}

// ============================================================================
// PRICE DISPLAY
// ============================================================================
interface PriceDisplayProps {
  amount: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  amount,
  label,
  size = "md",
  className,
}: PriceDisplayProps) {
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <span className={cn("font-bold text-primary", sizes[size])}>
        ₦{amount.toLocaleString()}
      </span>
    </div>
  );
}
