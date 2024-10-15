import { useXBlock } from "@/entities/XBlock"
import { useQuery } from "@tanstack/react-query";
import { TASK_FETCH_KEY } from "../libs/constants";
import { getTaskFetcher } from "../api/getTaskFetcher";
import { useBaseAxiosApi } from "@/shared/hooks/useBaseAxiosApi";
import { useMemo } from "react";

export const useTask = () => {
  const xBlock = useXBlock();
  const axiosInstance = useBaseAxiosApi()

  const taskFetcher = useMemo(() => getTaskFetcher({ axiosInstance, xBlock }), [axiosInstance, xBlock])

  return useQuery({ queryKey: [TASK_FETCH_KEY], queryFn: taskFetcher, enabled: Boolean(xBlock) })
}