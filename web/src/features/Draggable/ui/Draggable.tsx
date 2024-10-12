import { useDraggable, UseDraggableArguments } from "@dnd-kit/core";
import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";

type DraggableProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "children"
> &
  UseDraggableArguments & {
    renderChild?: (
      draggableProps: Omit<
        ReturnType<typeof useDraggable>,
        "setNodeRef" | "listeners" | "attributes"
      >
    ) => ReactNode;
  };

export const Draggable: FC<DraggableProps> = ({
  id,
  data,
  attributes: attrs,
  disabled,
  renderChild,
  ...props
}) => {
  const { setNodeRef, listeners, attributes, ...rest } = useDraggable({
    id,
    data,
    attributes: attrs,
    disabled,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} {...props}>
      {renderChild?.(rest)}
    </div>
  );
};
