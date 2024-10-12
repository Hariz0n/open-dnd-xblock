import {
  TaskArea,
  TaskImage,
  TaskVariant,
  useTask,
  useTaskForm,
} from "@/entities/Task";
import { Variant } from "@/entities/Task";
import { taskFormSchemaType } from "@/entities/Task/hooks/useTaskForm";
import { ActionChip } from "@/features/ActionChip";
import { Button, Chip } from "@/shared";
import {
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { FC, useState } from "react";
import { Controller, FormProvider, SubmitHandler } from "react-hook-form";

export const ActionZone: FC = () => {
  const { data } = useTask();
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const form = useTaskForm({
    values: data?.dropzone.areas.reduce((prev, current) => {
      return { ...prev, [current.id]: null };
    }, {}),
  });

  const handleDragStart = (e: DragStartEvent) => {
    setActiveVariant(e.active.data.current?.variant || null);
  };

  const handleDragEnd = () => {
    setActiveVariant(null);
  };

  const onSubmitHandler: SubmitHandler<taskFormSchemaType> = (data) => {
    console.log({ data });
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="flex flex-col gap-8"
        >
          <TaskImage>
            {data?.dropzone.areas.map((area) => (
              <Controller
                key={area.id}
                name={area.id}
                control={form.control}
                render={({ field }) => (
                  <TaskArea key={area.id} area={area}>
                    {field.value && (
                      <ActionChip
                        variant={
                          data.variants.find((v) => v.id === field.value)!
                        }
                      />
                    )}
                  </TaskArea>
                )}
              />
            ))}
          </TaskImage>
          <ul>
            {data?.variants.map((variant) => (
              <TaskVariant key={variant.id} variant={variant} />
            ))}
          </ul>
          <DragOverlay
            modifiers={[restrictToWindowEdges]}
            dropAnimation={{
              ...defaultDropAnimation,
              sideEffects: defaultDropAnimationSideEffects({
                className: {
                  active: "bg-our-gray",
                },
                styles: {
                  active: {},
                },
              }),
            }}
          >
            {activeVariant ? <Chip char={activeVariant.badgeChar} /> : null}
          </DragOverlay>
          <Button className="self-end">Отправить</Button>
        </form>
      </FormProvider>
    </DndContext>
  );
};
