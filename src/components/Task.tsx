import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react'
import React from 'react'
import { Subject, TaskType } from '../enums';
import { getDatabase, ref, remove } from 'firebase/database';

type TaskProps = {
  id: string;
  type: TaskType;
  title: string;
  subject: Subject | string;
  deadline: string;
  deadlineReal?: string;
}

function Task(props: TaskProps) {
  const db = getDatabase();

  const handleDelete = () => {
    const taskRef = ref(db, props.type === TaskType.TASK ? 'tasks/'+props.id : 'assessments/'+props.id);
    remove(taskRef);
  }

  return (
    <IonCard color="primary">
      <IonCardHeader>
        <span style={{ fontWeight: "bold", fontSize: 20 }}>{props.title}</span>
      </IonCardHeader>
      <IonCardContent style={{ marginBottom: "-20px" }}>
        <p>Subject: {props.subject}</p>
        <p>Deadline: {props.deadline}</p>
      </IonCardContent>
      <IonButton id={"present-delete-alert"+props.id}>
        Delete
      </IonButton>
      <IonAlert 
        header={`Delete ${props.type === TaskType.TASK ? "Task" : "Assessment"}`} 
        trigger={"present-delete-alert"+props.id}
        buttons={[
          {
            text: "Cancel",
            role: "cancel"
          },
          {
            text: "Confirm",
            handler: handleDelete
          }
        ]}>
        
      </IonAlert>
    </IonCard>
  )
}

export default Task