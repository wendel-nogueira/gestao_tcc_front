import { Schedule } from "./Schedule";
import { Work } from "./Work";

export interface Edict {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  courseId: string;
  schedule?: Schedule[];
  works?: Work[];
}
