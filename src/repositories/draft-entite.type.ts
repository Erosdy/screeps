import {EntiteInterface} from "./entite.interface";

export type DraftEntite<T extends EntiteInterface> = Omit<T, 'id'>;