import { getDatabase, query, ref } from 'firebase/database';
import firebaseApp from "../firebaseApp";
import { IonCard, IonCardContent, IonList } from '@ionic/react';
import Task from './Task';
import { useDatabaseListData } from 'reactfire';

const db = getDatabase(firebaseApp);

export default function Tasks(props: {
  title: string;
  firebaseKey: string;
  spec: string;
}) {
  // const [tasks, loading, error] = useList(ref(db, props.firebaseKey));
  const tasksRef = ref(db, props.firebaseKey);
  const tasksQuery = query(tasksRef);

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
      <IonList>
        {/* {tasks.map((task: DataSnapshot, i) => {
          const { deadlineDate, nameOfSubj, specTask, specAssessment, deadlineDateReal } = task.val();
          return (
            <Task
              key={task.key!+i}
              title={specTask ?? specAssessment}
              subject={nameOfSubj}
              deadline={deadlineDate}
            />
          )
        })} */}
        {tasks.map((task, i) => {
          const { deadlineDate, nameOfSubj, specTask, specAssessment, deadlineDateReal } = task;
          return (
            <Task
              key={task.id as string}
              title={specTask as string ?? specAssessment as string}
              subject={nameOfSubj as string}
              deadline={deadlineDate as string}
            />
          )
        })}
      </IonList>
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
