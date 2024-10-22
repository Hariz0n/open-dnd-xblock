import { CSSProperties, FC, PropsWithChildren } from "react";
import { Area } from "../types/AreaType";
import { cn } from "@/shared";

type TaskAreaProps = PropsWithChildren & {
  area: Area;
  isError?: boolean;
  isGood?: boolean;
};

export const TaskArea: FC<TaskAreaProps> = ({ area, children, isError, isGood }) => {
  const styles = {
    height: area.width,
    width: area.width,
    top: area.y,
    left: area.x,
  } satisfies CSSProperties;

  return (
    <div
      className={cn(
        "p-2 rounded-xl bg-our-blue/20 absolute border border-dashed border-our-blue transition-colors",
        isError && "bg-our-red/20 border-our-red",
        isGood && "bg-our-green/20 border-our-green"
      )}
      style={styles}
    >
      {children}
    </div>
  );
};
