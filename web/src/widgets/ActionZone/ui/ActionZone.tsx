import {
  TaskArea,
  TaskImage,
  TaskVariant,
  useCheckTask,
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
import { FC, useEffect, useState } from "react";
import { Controller, FormProvider, SubmitHandler } from "react-hook-form";

export const ActionZone: FC = () => {
  const { data } = useTask();
  const mutation = useCheckTask();
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [isAnimating, setIsAnimating] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    if (data) {
      setVerdict(data.previous_verdict);
    }
  }, [data]);

  const form = useTaskForm({
    values: data?.previous_answers,
  });

  const answers = form.getValues();
  const reversedAnswer = swapKeyAndValue(answers);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveVariant(e.active.data.current?.variant || null);
    setIsAnimating(e.active.id as string);
    setVerdict(null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const values = form.getValues();
    const field = Object.entries(values).find(([, value]) => {
      return value === e.active.id;
    });

    if (!e.over) {
      if (field) {
        form.setValue(field[0], null, { shouldValidate: true });
        form.trigger(field[0]);
      }
    }

    if (e.over) {
      if (field) {
        form.setValue(field[0], null, { shouldValidate: true });
        form.trigger(field[0]);
      }

      form.setValue(e.over.id as string, e.active.id as string, {
        shouldValidate: true,
      });
      form.trigger([e.over.id as string]);
    }

    setActiveVariant(null);
  };

  const onSubmitHandler: SubmitHandler<taskFormSchemaType> = async (data) => {
    const result = await mutation.mutateAsync(data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { score, ...fields } = result;
    setVerdict(fields);
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
                    <TaskArea
                      isError={
                        !!verdict &&
                        typeof verdict[area.id] === "boolean" &&
                        !verdict[area.id]
                      }
                      isGood={
                        !!verdict &&
                        typeof verdict[area.id] === "boolean" &&
                        verdict[area.id]
                      }
                      area={area}
                    >
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
                              isError={
                                !!verdict &&
                                typeof verdict[area.id] === "boolean" &&
                                !verdict[area.id]
                              }
                              isGood={
                                !!verdict &&
                                typeof verdict[area.id] === "boolean" &&
                                verdict[area.id]
                              }
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
              const area = reversedAnswer[variant.id] as string | undefined;
              const isError = Boolean(area && verdict && typeof verdict[area] === 'boolean' && !verdict[area]);
              const isGood = Boolean(area && verdict && typeof verdict[area] === 'boolean' && verdict[area]);

              return (
                <TaskVariant
                  isError={isError}
                  isGood={isGood}
                  key={variant.id}
                  variant={variant}
                >
                  {reversedAnswer[variant.id] ? (
                    <Chip isError={isError} isGood={isGood} disabled char={variant.badgeChar} />
                  ) : (
                    <Draggable
                      id={variant.id}
                      data={{ variant }}
                      className="rounded-lg"
                      renderChild={({ isDragging }) => (
                        <Chip
                          isError={isError}
                          isGood={isGood}
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
          {Boolean(data?.max_attempts) && (
            <div className="flex items-center justify-end font-bold text-sm">
              Попытка {data?.attempts} из {data?.max_attempts}
            </div>
          )}
          <Button
            disabled={
              (data &&
                Number.isFinite(data.attempts) &&
                Number.isFinite(data.max_attempts) &&
                (data.attempts as number) >= (data.max_attempts as number)) ||
              form.formState.isSubmitting ||
              !Object.values(form.getValues()).some((v) => !!v)
            }
            className="self-end"
          >
            Отправить
          </Button>
        </form>
      </FormProvider>
    </DndContext>
  );
};
