import { forwardRef, HTMLAttributes } from "react";
import { cn } from "../libs/cn";

type ChipProps = HTMLAttributes<HTMLDivElement> & {
  char: string;
  disabled?: boolean;
  isError?: boolean;
};

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ char, disabled, className, isError, ...props }, ref) => {
    return (
      <div
        className={cn(
          "h-8 w-8 text-lg font-semibold rounded-lg flex items-center justify-center bg-our-blue text-our-white",
          disabled && "bg-our-gray",
          isError && 'bg-our-red',
          className
        )}
        {...props}
        ref={ref}
      >
        {char}
      </div>
    );
  }
);
