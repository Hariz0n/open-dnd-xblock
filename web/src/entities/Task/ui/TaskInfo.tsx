import { useTask } from "@/entities/Task";
import { cn } from "@/shared";
import { FC, HTMLAttributes } from "react";

type TaskInfoProps = HTMLAttributes<HTMLElement>

export const TaskInfo: FC<TaskInfoProps> = ({ className, ...props }) => {
  const { data } = useTask()

  return <section className={cn("flex flex-col gap-4", className)} {...props}>
    <h1 className="font-bold text-3xl">{data?.title}</h1>
    <p className="font-medium text-lg">{data?.description}</p>
  </section>
}