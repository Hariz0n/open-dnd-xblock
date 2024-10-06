import { CSSProperties, FC } from "react";
import { Area } from "../types/AreaType";

type TaskAreaProps = {
  area: Area;
}

export const TaskArea: FC<TaskAreaProps> = ({area}) => {
  const { ...position } = area;

  const styles = {
    height: position.width,
    width: position.width,
    top: position.y,
    left: position.x
  } satisfies CSSProperties

  return <div className="p-2 rounded-xl bg-our-blue/20 absolute border border-dashed border-our-blue" style={styles} />
}