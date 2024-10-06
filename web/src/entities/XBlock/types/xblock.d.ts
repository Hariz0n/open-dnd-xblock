export declare global {
  export interface Window {
    initApp: InitAppType;
  }
}

type InitAppType = (runtime: XBlockRuntime, element: HTMLElement) => void
type XBlockRuntime = {
  handlerUrl: (element: HTMLElement, key: string) => string
}