
import { TaskArea, TaskImage, TaskVariant, useTask } from "@/entities/Task";
import { DndContext } from "@dnd-kit/core";
import { FC } from "react";

export const ActionZone: FC = () => {
  const { data } = useTask()

  return <DndContext>
    <TaskImage>
      {data?.dropzone.areas.map((area) => <TaskArea key={area.id} area={area} />)}
    </TaskImage>
    <ul>
      {data?.variants.map(variant => <TaskVariant key={variant.id} variant={variant} />)}
    </ul>
  </DndContext>
}