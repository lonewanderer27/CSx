import { DocType, Subject } from "./enums"

export type Inputs = {
  subject: Subject | string,
  title: string,
  deadline: string
}

export type TaskType = {
  deadlineDate: string;
  deadlineDateParseable?: string;
  nameOfSubj: string;
  specTask: string;
}

export type UpdateTaskType = {
  deadlineDate: string;
  deadlineDateParseable?: string;
  nameOfSubj: string;
  specTask: string;
  taskType: DocType;
}

export type TaskModalProps = {
  isOpen: boolean
  handleDismiss: () => void
  presentingElement?: HTMLElement | undefined
}