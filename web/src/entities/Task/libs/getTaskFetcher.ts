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

    if (import.meta.env.DEV) {
      return {
        title: "Задание",
        description:
          "На рисунке представлен скрин страницы сайта института фундаментального образования(ИНФО) портала УрФУ. Внимательно рассмотрите представленный рисунок и сопоставьте название элемента сайта его положению на рисунке",
        dropzone: {
          imageUrl:
            "https://i.pinimg.com/originals/76/15/40/761540397bdc735a6ca0d127b321a2ff.jpg",
          areas: [
            {
              id: "top-zone",
              x: "5%",
              y: "5%",
              height: "25%",
              width: "25%",
            },
            {
              id: "bottom-zone",
              x: "35%",
              y: "55%",
              height: "25%",
              width: "25%",
            },
          ],
        },
        variants: [
          {
            id: "header",
            badgeChar: "1",
            badgeTitle: "Header",
            text: "Footer (футер, подвал) — блок в нижней части страницы. Содержит полезную, но не первостепенную информацию. Виден на всех страницах сайта. В футер можно вынести: копирайт, название студии, которая разрабатывала сайт, контакты.",
          },
        ],
      };
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
