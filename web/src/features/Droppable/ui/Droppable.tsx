import { useDroppable, UseDroppableArguments } from "@dnd-kit/core";
import { Slot } from "@radix-ui/react-slot";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

type DroppableProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  UseDroppableArguments & {
    asChild?: boolean;
  };

export const Droppable: FC<DroppableProps> = ({
  asChild,
  id,
  data,
  ...props
}) => {
  const { setNodeRef } = useDroppable({ id, data });

  const Comp = asChild ? Slot : "div";
  return <Comp ref={setNodeRef} {...props} />;
};
