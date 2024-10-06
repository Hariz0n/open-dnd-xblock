import { FC } from "react";
import { Variant } from "../types/Variant";

type TaskVariantProps = {
  variant: Variant;
}

export const TaskVariant: FC<TaskVariantProps> = ({variant}) => {
  return <li className="flex flex-col p-8 items-start bg-our-white rounded-2xl shadow-md gap-4">
    <p className="text-lg">{variant.text}</p>
  </li>
}