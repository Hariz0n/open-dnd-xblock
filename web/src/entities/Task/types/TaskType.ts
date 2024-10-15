import type { DropZone } from "./DropZoneType";
import { Variant } from "./Variant";

export type Task = {
  title: string;
  description: string;
  dropzone: DropZone;
  variants: Variant[];
  attempts: number | null;
  max_attempts: number | null;
  previous_answers: Record<string, string | null>
}