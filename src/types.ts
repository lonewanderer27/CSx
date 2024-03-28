import { Subject } from "./enums"

export type Inputs = {
  subject: Subject,
  title: string,
  deadline: string
}

export type TaskType = {
  deadlineDate: string;
  deadlineDateParseable?: string;
  nameOfSubj: string;
  specTask: string;
}