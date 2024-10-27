import React from "react";

// Simple utility function to combine classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

const Alert = React.forwardRef(
  ({ className = "", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === "destructive"
          ? "border-red-500 bg-red-50 text-red-700"
          : "bg-white border-gray-200",
        className
      )}
      {...props}
    />
  )
);

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));

const AlertDescription = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={cn("text-sm", className)} {...props} />
  )
);

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
