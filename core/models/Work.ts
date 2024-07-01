import { Board } from "./Board";
import { Version } from "./Version";

export interface Work {
  id?: string;
  title: string;
  knowledgeArea: string | number;
  abstract: string;
  keywords: string;
  advisor: string;
  coadvisor: string;
  requestForm: string;
  recordForm: string;
  status: string | number;
  student: string;
  edictId: string;
  firstScore: number;
  secondScore: number;
  finalScore: number;
  versions?: Version[];
  board?: Board;
}
