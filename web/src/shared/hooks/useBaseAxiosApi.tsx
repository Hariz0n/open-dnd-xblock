import axios from "axios"
import Cookie from 'js-cookie'
import { useMemo } from "react";

export const useBaseAxiosApi = () => {
  const csrfToken = Cookie.get('csrftoken');

  const axiosInstance = useMemo(() => axios.create({
    headers: {
      'X-Csrftoken': csrfToken
    }
  }), [csrfToken])

  return axiosInstance
}