import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react'
import React, { useRef } from 'react'
import { Subject, DocType } from '../enums';
import { getDatabase, ref, remove } from 'firebase/database';
import { useAtom } from 'jotai';
import { documentIdAtom, isOptionsActiveAtom, isUpdateModalOpenAtom, reloadFlagAtom, toBeUpdatedDocAtom } from '../atoms';
import { CSSTransition } from "react-transition-group";
import AnimateHeight from 'react-animate-height';

type TaskProps = {
  id: string;
  type: DocType;
  title: string;
  subject: Subject | string;
  deadline: string;
  deadlineReal?: string;
}

function Task(props: TaskProps) {
  const db = getDatabase();

  const [reloadFlag, setReloadFlag] = useAtom(reloadFlagAtom);

  const handleDelete = () => {
    const taskRef = ref(db, props.type === DocType.TASK ? 'tasks/' + props.id : 'assessments/' + props.id);
    remove(taskRef).then(() => {
      console.log("Document removed successfully!");

      // reload the tasks
      setReloadFlag(!reloadFlag);
    });
  }

  const [documentId, setDocumentId] = useAtom(documentIdAtom);
  const [toBeUpdatedDoc, setToBeUpdatedDoc] = useAtom(toBeUpdatedDocAtom);
  const [isUpdateModalOpen, toggleUpdateModal] = useAtom(isUpdateModalOpenAtom);

  const handleUpdate = () => {
    // set the document id atom
    setDocumentId(props.id);

    // set the to be updated document atom
    const doc = {
      deadlineDate: props.deadline,
      deadlineDateParseable: props.deadlineReal,
      nameOfSubj: props.subject,
      specTask: props.title,
      taskType: props.type
    }
    console.log("To be updated doc: ", doc);
    setToBeUpdatedDoc(doc)

    // set the isUpdateModalOpenAtom to true 
    toggleUpdateModal(true);
  }

  const [isActive] = useAtom(isOptionsActiveAtom);
  const nodeRef = useRef(null);

  return (
    <CSSTransition in={true} timeout={500} key={props.id} nodeRef={nodeRef} unmountOnExit>
      <IonCard color="primary" className='pb-5'>
        <IonCardHeader>
          <span style={{ fontWeight: "bold", fontSize: 20, color: "#FFFFFF" }}>{props.title}</span>
        </IonCardHeader>
        <IonCardContent style={{ marginBottom: "-20px" }}>
          <p>Subject: {props.subject}</p>
          <p>Deadline: {props.deadline}</p>
        </IonCardContent>
        <AnimateHeight duration={500} height={isActive ? 'auto' : 0}>
          <div>
            <IonButton color="light" id={"present-delete-alert" + props.id} size="small" className='pl-5 pt-3'>
              <span style={{ padding: "5px 10px" }}>
                Delete
              </span>
            </IonButton>
            <IonButton onClick={handleUpdate} color="light" id={"present-update-alert" + props.id} size="small" className='pl-5 pt-3'>
              <span style={{ padding: "5px 10px" }}>
                Edit
              </span>
            </IonButton>
          </div>
        </AnimateHeight>
        <IonAlert
          header={`Delete ${props.type === DocType.TASK ? "Task" : "Assessment"}`}
          message={`Remove ${props.title} permanently?`}
          trigger={"present-delete-alert" + props.id}
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
    </CSSTransition>
  )
}

export default Task