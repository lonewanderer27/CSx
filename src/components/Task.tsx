import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react'
import React from 'react'
import { Subject, TaskType } from '../enums';

type TaskProps = {
  type: TaskType;
  title: string;
  subject: Subject | string;
  deadline: string;
  deadlineReal?: string;
}

function Task(props: TaskProps) {
  return (
    <IonCard color="primary">
      <IonCardHeader>
        <span style={{ fontWeight: "bold", fontSize: 20 }}>{props.title}</span>
      </IonCardHeader>
      <IonCardContent>
        <p>Subject: {props.subject}</p>
        <p>Deadline: {props.deadline}</p>
      </IonCardContent>
      <IonButton>
        Delete
      </IonButton>
    </IonCard>
  )
}

export default Task