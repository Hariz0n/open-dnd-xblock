import { useXBlock } from "@/entities/XBlock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseAxiosApi } from "@/shared/hooks/useBaseAxiosApi";
import { useMemo } from "react";
import { checkTaskFetcher } from "../api/getTaskCheckFetcher";
import { TASK_FETCH_KEY } from "../libs/constants";
import { Task } from "../types/TaskType";

export const useCheckTask = () => {
  const xBlock = useXBlock();
  const axiosInstance = useBaseAxiosApi();
  const queryClient = useQueryClient();

  const taskFetcher = useMemo(
    () => checkTaskFetcher({ axiosInstance, xBlock }),
    [axiosInstance, xBlock]
  );

  return useMutation({
    mutationFn: taskFetcher,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [TASK_FETCH_KEY] });

      const prevTask = queryClient.getQueryData<Task>([TASK_FETCH_KEY]) as Task;

      queryClient.setQueryData<Task>([TASK_FETCH_KEY], {
        ...prevTask,
        attempts: (prevTask.attempts || 0) + 1,
      });

      return { prevTask };
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData([TASK_FETCH_KEY], context?.prevTask);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_FETCH_KEY] });
    },
  });
};
