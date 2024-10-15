import { MutationFunction } from "@tanstack/react-query";
import { Axios } from "axios";
import { XBlockContextType } from "@/entities/XBlock";

type getTaskFetcherParams = {
  axiosInstance: Axios;
  xBlock: XBlockContextType | null;
};

type CheckResponseType = Record<string, boolean> & {
  score: string;
};

type BodyType = Record<string, string | null>

export const checkTaskFetcher =
  ({
    axiosInstance,
    xBlock,
  }: getTaskFetcherParams): MutationFunction<CheckResponseType, BodyType> =>
  async (data) => {
    if (!xBlock) {
      throw new Error("Task fetch error");
    }

    const handleUrl = xBlock.runtime.handlerUrl(xBlock.element, "checkTask");
    const response = await axiosInstance.post<CheckResponseType>(handleUrl, JSON.stringify(data), );

    if (response.status !== 200) {
      throw new Error("Task fetch error");
    }

    return response.data;
  };
