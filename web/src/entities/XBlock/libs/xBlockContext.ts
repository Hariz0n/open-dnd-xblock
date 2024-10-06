import { createContext } from "react";
import { XBlockContextType } from "../types/XBlockContextType";

export const xBlockContext = createContext<XBlockContextType | null>(null)