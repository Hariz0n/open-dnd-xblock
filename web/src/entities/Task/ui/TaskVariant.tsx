import { FC, PropsWithChildren } from "react";
import { Variant } from "../types/Variant";
import { Badge } from "@/shared";

type TaskVariantProps = PropsWithChildren & {
  variant: Variant;
};

export const TaskVariant: FC<TaskVariantProps> = ({ variant, children }) => {
  return (
    <li className="flex flex-col p-8 items-start bg-our-white rounded-2xl shadow-md gap-4">
      <Badge badgeTitle={variant.badgeTitle} className="[&:has(.bg-our-gray)]:bg-our-light-gray [&:has(.bg-our-gray)]:text-our-gray">
        {children}
      </Badge>
      <p className="text-lg">{variant.text}</p>
    </li>
  );
};
