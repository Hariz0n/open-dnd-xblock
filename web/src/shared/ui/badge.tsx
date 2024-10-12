import { FC, HTMLAttributes } from "react";
import { cn } from "../libs/cn";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  badgeTitle: string;
};

export const Badge: FC<BadgeProps> = ({
  className,
  children,
  badgeTitle,
  ...props
}) => {
  return (
    <div className={cn("bg-our-light-blue rounded-xl flex items-center p-1 transition-colors text-our-blue", className)} {...props}>
      {children}
      <p className="[&:not(:first-child)]:ml-2 [&:not(:first-child)]:mr-1 text-base font-semibold">{badgeTitle}</p>
    </div>
  );
};
