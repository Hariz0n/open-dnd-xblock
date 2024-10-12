import { CSSProperties, FC, PropsWithChildren } from "react";
import { Area } from "../types/AreaType";
import { useDroppable } from "@dnd-kit/core";

type TaskAreaProps = PropsWithChildren & {
  area: Area;
};

export const TaskArea: FC<TaskAreaProps> = ({ area, children }) => {
  const { id, ...position } = area;

  const { setNodeRef } = useDroppable({ id });

  const styles = {
    height: position.width,
    width: position.width,
    top: position.y,
    left: position.x,
  } satisfies CSSProperties;

  return (
    <div
      ref={setNodeRef}
      className="p-2 rounded-xl bg-our-blue/20 absolute border border-dashed border-our-blue"
      style={styles}
    >
      {children}
    </div>
  );
};
