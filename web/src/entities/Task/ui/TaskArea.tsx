import { CSSProperties, FC, PropsWithChildren } from "react";
import { Area } from "../types/AreaType";

type TaskAreaProps = PropsWithChildren & {
  area: Area;
};

export const TaskArea: FC<TaskAreaProps> = ({ area, children }) => {
  const styles = {
    height: area.width,
    width: area.width,
    top: area.y,
    left: area.x,
  } satisfies CSSProperties;

  return (
    <div
      className="p-2 rounded-xl bg-our-blue/20 absolute border border-dashed border-our-blue"
      style={styles}
    >
      {children}
    </div>
  );
};
