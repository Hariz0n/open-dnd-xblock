import { useForm } from "react-hook-form"

export type taskFormSchemaType = {
  [areaKey: string]: string | null
}

type useTaskFormProps = {
  values?: taskFormSchemaType,
  defaultValues?: taskFormSchemaType,
}

export const useTaskForm = (props: useTaskFormProps = {}) => {
  const { values, defaultValues } = props;

  return useForm<taskFormSchemaType>({
    values,
    defaultValues,
  })
}