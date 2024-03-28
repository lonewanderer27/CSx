import { getDatabase, orderByChild, query, ref } from 'firebase/database';
import firebaseApp from "../firebaseApp";
import { IonCard, IonCardContent, IonList } from '@ionic/react';
import Task from './Task';
import { useDatabaseListData } from 'reactfire';
import { TaskType } from '../enums';

const db = getDatabase(firebaseApp);

export default function Tasks(props: {
  title: string;
  firebaseKey: string;
  spec: string;
}) {
  // const [tasks, loading, error] = useList(ref(db, props.firebaseKey));
  const tasksRef = ref(db, props.firebaseKey);
  const tasksQuery = query(tasksRef, orderByChild('deadlineDateReal'));

  const { status, data: tasks } = useDatabaseListData(tasksQuery, {
    idField: 'id'
  });

  if (status === "loading") {
    return (
      <IonCard color="medium">
        <IonCardContent>
          <p>Loading...</p>
        </IonCardContent>
      </IonCard>
    )
  }

  if (status === "success" && tasks && tasks.length > 0) {
    return (
      <>
        {tasks.map((task, i) => {
          const { deadlineDate, nameOfSubj, specTask, specAssessment, deadlineDateReal } = task;
          return (
            <Task
              id={task.id as string}
              key={task.id as string}
              title={specTask as string ?? specAssessment as string}
              subject={nameOfSubj as string}
              deadline={deadlineDate as string}
              type={props.spec.includes('Task') ? TaskType.TASK : TaskType.ASSESSMENT}
            />
          )
        })}
      </>
    )
  }

  return (
    <IonCard color="medium">
      <IonCardContent>
        <p>No {props.title} available</p>
      </IonCardContent>
    </IonCard>
  )
}
