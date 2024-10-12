import { FC, PropsWithChildren, useEffect, useState } from "react";
import { xBlockContext } from "../libs/xBlockContext";
import { XBlockContextType } from "../types/XBlockContextType";
import { UrlMock } from "../libs/constants";

export const XBlockProvider: FC<PropsWithChildren> = ({ children }) => {
  const [context, setContext] = useState<XBlockContextType | null>(null);

  useEffect(() => {
    window.initApp = (runtime, element) => {
      setContext({ runtime, element })
      window.initApp = () => {}
    }
  }, [])

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      setContext({
        element: document.createElement('div'),
        runtime: {
          handlerUrl: (_e, key) => UrlMock[key as keyof typeof UrlMock]
        }
      })
      window.initApp = () => {}
    }
  }, [])

  return <xBlockContext.Provider value={context}>{children}</xBlockContext.Provider>
}