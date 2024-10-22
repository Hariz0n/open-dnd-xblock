import { FC, PropsWithChildren } from "react";
import { Variant } from "../types/Variant";
import { Badge, cn } from "@/shared";

type TaskVariantProps = PropsWithChildren & {
  variant: Variant;
  isError?: boolean;
  isGood?: boolean;
};

export const TaskVariant: FC<TaskVariantProps> = ({ variant, children, isError, isGood }) => {
  return (
    <li className="flex flex-col p-8 items-start bg-our-white rounded-2xl shadow-md gap-4">
      <Badge badgeTitle={variant.badgeTitle} className={cn(
        !isError && "[&:has(.bg-our-gray)]:bg-our-light-gray [&:has(.bg-our-gray)]:text-our-gray",
        isError && 'bg-our-light-red text-our-red',
        isGood && 'bg-our-light-green text-our-green'
      )}>
        {children}
      </Badge>
      <p className="text-lg">{variant.text}</p>
    </li>
  );
};
