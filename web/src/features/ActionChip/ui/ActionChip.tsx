import { Variant } from "@/entities/Task/types/Variant";
import { Chip } from "@/shared";
import { useDraggable } from "@dnd-kit/core";
import { FC } from "react";

type ActionChip = {
  variant: Variant;
};

export const ActionChip: FC<ActionChip> = ({ variant }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: variant.id,
    data: {
      variant,
    },
  });

  return (
    <Chip
      disabled={isDragging}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      char={variant.badgeChar}
    />
  );
};
