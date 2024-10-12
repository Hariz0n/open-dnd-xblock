import {
  TaskArea,
  TaskImage,
  TaskVariant,
  useTask,
  useTaskForm,
} from "@/entities/Task";
import { Variant } from "@/entities/Task";
import { taskFormSchemaType } from "@/entities/Task/hooks/useTaskForm";
import { Draggable } from "@/features/Draggable";
import { Droppable } from "@/features/Droppable";
import { Button, Chip, swapKeyAndValue } from "@/shared";
import {
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { FC, useState } from "react";
import { Controller, FormProvider, SubmitHandler } from "react-hook-form";

export const ActionZone: FC = () => {
  const { data } = useTask();
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  const form = useTaskForm({
    values: data?.dropzone.areas.reduce((prev, current) => {
      return { ...prev, [current.id]: null };
    }, {}),
  });

  const answers = form.getValues();
  const reversedAnswer = swapKeyAndValue(answers);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveVariant(e.active.data.current?.variant || null);
    setIsAnimating(e.active.id as string);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const values = form.getValues();
    const field = Object.entries(values).find(([, value]) => {
      return value === e.active.id;
    });

    if (!e.over) {
      if (field) {
        form.setValue(field[0], null);
      }
    }

    if (e.over) {
      if (field) {
        form.setValue(field[0], null);
      }

      form.setValue(e.over.id as string, e.active.id as string);
    }

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
                render={({ field }) => {
                  const variant = data.variants.find(
                    (v) => v.id === field.value
                  );
                  return (
                    <TaskArea area={area}>
                      <Droppable
                        className="absolute inset-0 rounded-xl -z-10"
                        id={area.id}
                      />
                      {variant && (
                        <Draggable
                          id={variant.id}
                          data={{ variant }}
                          className="rounded-lg"
                          renderChild={({ isDragging }) => (
                            <Chip
                              disabled={
                                (activeVariant?.id === variant.id &&
                                  isDragging) ||
                                isAnimating === variant.id
                              }
                              char={variant.badgeChar}
                            />
                          )}
                        />
                      )}
                    </TaskArea>
                  );
                }}
              />
            ))}
          </TaskImage>
          <ul className="flex flex-col gap-4">
            {data?.variants.map((variant) => {
              return (
                <TaskVariant key={variant.id} variant={variant}>
                  {reversedAnswer[variant.id] ? (
                    <Chip disabled char={variant.badgeChar} />
                  ) : (
                    <Draggable
                      id={variant.id}
                      data={{ variant }}
                      className="rounded-lg"
                      renderChild={({ isDragging }) => (
                        <Chip
                          disabled={
                            (activeVariant?.id === variant.id && isDragging) ||
                            isAnimating === variant.id
                          }
                          char={variant.badgeChar}
                        />
                      )}
                    />
                  )}
                </TaskVariant>
              );
            })}
          </ul>
          <DragOverlay
            modifiers={[restrictToWindowEdges]}
            dropAnimation={{
              ...defaultDropAnimation,
              duration: 350,
              sideEffects: () => {
                return () => setIsAnimating(null);
              },
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
