import { Edict } from "./Edict";
import { Organ } from "./Organ";

export interface Course {
  id?: string;
  name: string;
  acronym: string;
  coordinator: string;
  tccCoordinator: string;
  organs?: Organ[];
  edicts?: Edict[];
}
