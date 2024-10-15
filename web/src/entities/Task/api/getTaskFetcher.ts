import { QueryFunction } from "@tanstack/react-query";
import type { Task } from "../types/TaskType";
import { Axios } from "axios";
import { XBlockContextType } from "@/entities/XBlock";

type getTaskFetcherParams = {
  axiosInstance: Axios;
  xBlock: XBlockContextType | null;
};

export const getTaskFetcher =
  ({ axiosInstance, xBlock }: getTaskFetcherParams): QueryFunction<Task> =>
  async ({ signal }) => {
    if (!xBlock) {
      throw new Error("Task fetch error");
    }

    const handleUrl = xBlock.runtime.handlerUrl(xBlock.element, "getTask");
    const response = await axiosInstance.post<Task>(handleUrl, "{}", {
      signal,
    });

    if (response.status !== 200) {
      throw new Error("Task fetch error");
    }

    return response.data;
  };
