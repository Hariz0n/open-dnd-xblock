import type { DropZone } from "./DropZoneType";
import { Variant } from "./Variant";

export type Task = {
  title: string;
  description: string;
  dropzone: DropZone;
  variants: Variant[];
}