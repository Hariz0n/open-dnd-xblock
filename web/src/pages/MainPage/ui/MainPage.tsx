import { TaskInfo } from "@/entities/Task";
import { ActionZone } from "@/widgets/ActionZone";
import { FC } from "react";

export const MainPage: FC = () => {
  return <main className="w-full h-full p-5 flex flex-col gap-8">
    <TaskInfo />
    <ActionZone />
  </main>
}