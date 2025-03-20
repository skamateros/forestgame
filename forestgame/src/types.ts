import { /*Hypothesis,*/ SpeechStateExternalEvent } from "speechstate";
import { AnyActorRef } from "xstate";

export interface DMContext {
  spstRef: AnyActorRef;
  lastResult: nluResponse | null;
  berries?: boolean | null;
  dreamMedeina?: boolean | null;
  dreamLeshy?: boolean | null;
  eaten?: boolean | null;
  fire?: boolean | null;
}

export interface nluResponse {
  topIntent: string;
  projectKind: string;
  intents: intents[]
  entities: entities[]
}

export type entities = {
  category: string;
  confidenceScore: number;
  length: number;
  offset: number;
  text: string;
}

export type intents = {
  category: string;
  confidenceScore: number;
  length: number;
}

export type DMEvents = SpeechStateExternalEvent | { type: "CLICK" };
