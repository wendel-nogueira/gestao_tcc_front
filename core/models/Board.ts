import { BoardFile } from "./BoardFile";

export interface Board {
  id?: string;
  date: string;
  time: string;
  place: string;
  members: string[];
  files: BoardFile[];
  workId?: string;
}
