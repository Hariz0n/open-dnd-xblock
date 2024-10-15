import { cn } from "@/shared";
import { FC, HTMLAttributes } from "react";
import { useTask } from "../hooks/useTask";

type TaskImageProps = HTMLAttributes<HTMLDivElement>

export const TaskImage: FC<TaskImageProps> = ({ children, className, ...props }) => {
  const { data } = useTask()

  return <div className={cn("w-full rounded-2xl overflow-hidden relative", !data && 'aspect-video', className)} {...props}>
    {data && <>
      <img src={data.dropzone.imageUrl} className="w-full" alt="" />
      {children}
    </>}
  </div>
}