import { Board } from "./Board";
import { Version } from "./Version";

export interface Work {
  id?: string;
  title: string;
  knowledgeArea: string;
  abstract: string;
  keywords: string;
  advisor: string;
  coadvisor: string;
  requestForm: string;
  recordForm: string;
  status: string;
  student: string;
  edictId: string;
  firstScore: number;
  secondScore: number;
  finalScore: number;
  versions?: Version[];
  board?: Board;
}
