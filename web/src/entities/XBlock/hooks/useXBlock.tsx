import { useContext } from "react"
import { xBlockContext } from "../libs/xBlockContext"

export const useXBlock = () => {
  const context = useContext(xBlockContext)

  return context
}