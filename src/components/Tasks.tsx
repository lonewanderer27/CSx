import { getDatabase, orderByChild, query, ref } from 'firebase/database';
import firebaseApp from "../firebaseApp";
import { IonCard, IonCardContent, IonList } from '@ionic/react';
import Task from './Task';
import { useDatabaseListData } from 'reactfire';
import { DocType } from '../enums';
import { TransitionGroup } from 'react-transition-group';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { reloadFlagAtom } from '../atoms';

const db = getDatabase(firebaseApp);

export default function Tasks(props: {
  title: string;
  firebaseKey: string;
  spec: string;
}) {
  const tasksRef = ref(db, props.firebaseKey);
  const tasksQuery = query(tasksRef, orderByChild('deadlineDateReal'));

  const [reloadFlag, setReloadFlag] = useAtom(reloadFlagAtom);
  const { status, data: tasks } = useDatabaseListData(tasksQuery, {
    idField: 'id' 
  });

  return (
    <TransitionGroup>
      {status === "loading" && tasks?.length === 0 && (
        <IonCard color="medium">
          <IonCardContent>
            <p>Loading...</p>
          </IonCardContent>
        </IonCard>
      )}
      {status === "success" && tasks && tasks.length > 0 && tasks.map((task, i) => {
        const { deadlineDate, nameOfSubj, specTask, specAssessment, deadlineDateReal } = task;
        if (task.id === undefined) return null;
        return (
          <Task
            id={task.id as string}
            key={task.id as string}
            title={specTask as string ?? specAssessment as string}
            subject={nameOfSubj as string}
            deadline={deadlineDate as string}
            deadlineReal={deadlineDateReal as string}
            type={props.spec.includes('Task') ? DocType.TASK : DocType.ASSESSMENT}
          />
        )
      })}
      {tasks && tasks.length === 0 && (
        <IonCard color="medium">
          <IonCardContent>
            <p>No tasks found.</p>
          </IonCardContent>
        </IonCard>
      )}
    </TransitionGroup>
  )
}
