import { getDatabase, ref } from 'firebase/database';
import { useEffect, useState } from 'react'
import { Controller, SubmitErrorHandler, SubmitHandler, set, useForm } from 'react-hook-form';
import { Subject, DocType } from '../enums';
import { Inputs, TaskModalProps } from '../types';
import { useIonAlert, IonButton, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';
import firebaseApp from '../firebaseApp';
import { useAtom } from 'jotai';
import { documentIdAtom, reloadFlagAtom, toBeUpdatedDocAtom } from '../atoms';
import { set as firebaseSet } from 'firebase/database';
import { update as firebaseUpdate } from 'firebase/database';

const db = getDatabase(firebaseApp);

export default function UpdateTaskModal(props: TaskModalProps) {
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);

  const handleOpenSubjectsModal = () => {
    setIsSubjectsModalOpen(true);
  }

  const handleCloseSubjectsModal = () => {
    setIsSubjectsModalOpen(false);
  }

  const [toBeUpdatedDoc, setToBeUpdatedDoc] = useAtom(toBeUpdatedDocAtom);
  const [taskType, setTaskType] = useState<DocType>(toBeUpdatedDoc?.taskType ?? DocType.TASK);
  const [documentId] = useAtom(documentIdAtom);

  const { getValues, control, handleSubmit, reset, setValue } = useForm<Inputs>({
    defaultValues: {
      title: toBeUpdatedDoc?.specTask ?? "",
      subject: toBeUpdatedDoc?.nameOfSubj ?? "",
      deadline: toBeUpdatedDoc?.deadlineDateParseable ?? ""
    }
  });

  console.log(toBeUpdatedDoc?.deadlineDateParseable);

  useEffect(() => {
    if (toBeUpdatedDoc) {
      setValue("subject", toBeUpdatedDoc!.nameOfSubj);
      setValue("title", toBeUpdatedDoc!.specTask);
      setValue("deadline", toBeUpdatedDoc.deadlineDateParseable as string);
    }
  }, [toBeUpdatedDoc])

  const [searchText, setSearchText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [presentAlert] = useIonAlert();

  const verifyInputs = (data: Inputs) => {
    console.log("Data: ", data);
    const { deadline, title, subject } = data;

    // check if data is complete
    if (!title) {
      presentAlert("Title is required", [{ text: "Ok" }]);
      return false;
    }

    if (!subject) {
      presentAlert("Please select a subject", [{ text: "Ok" }]);
      return false;
    }

    return true;
  }

  const [reloadFlag, setReloadFlag] = useAtom(reloadFlagAtom);

  const onEditSubmit: SubmitHandler<Inputs> = (data) => {
    if (!verifyInputs(data)) return;
    const { deadline, title, subject } = data;

    setSubmitting(true);

    // get formatted data
    const deadlineDateReal = deadline
    const deadlineDate = new Date(deadline).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }); // Format as "Month Day Year Hour:Minute AM/PM"

    // create task object
    let newData: any = {
      deadlineDate: deadlineDate,
      deadlineDateReal: deadlineDateReal,
      nameOfSubj: subject,
      specTask: title
    }

    // Determine specTask or specAssessment based on taskType
    if (taskType === DocType.TASK) {
      newData.specTask = title;
    } else {
      newData.specAssessment = title;
    }

    // log the documentID
    console.log("Document ID: ", documentId);

    // build the reference to the document
    // for the love of god, please backtick (``) to build the path using documentId
    // as using + will not work!!!
    const updatedRef = ref(db, `${taskType === DocType.TASK ? 'tasks' : 'assessments'}/${documentId}`);
    console.log("updatedRef: ", updatedRef.toString());

     // save to database the updated data
    firebaseUpdate(updatedRef, newData)
      .then(() => {
        // trigger reload flag
        setReloadFlag(f => !f);

        setSubmitting(false);

        // reset form
        reset();

        // hide this modal
        props.handleDismiss();
      }).catch((error: any) => {
        console.error("Error updating document: ", error);
      });
  }

  const onError: SubmitErrorHandler<Inputs> = (errors) => {
    console.log("Errors: ", errors);
  }

  return (
    <IonModal
      isOpen={props.isOpen}
      onDidDismiss={props.handleDismiss}
      breakpoints={[0, 0.82]}
      initialBreakpoint={0.82}
      keepContentsMounted
    >
      <IonHeader>
        <IonToolbar>
          <IonSegment value={toBeUpdatedDoc?.taskType} className="mt-2">
            <IonSegmentButton value={DocType.TASK} onClick={() => setTaskType(DocType.TASK)}>
              <IonLabel>Task</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={DocType.ASSESSMENT} onClick={() => setTaskType(DocType.ASSESSMENT)}>
              <IonLabel>
                Assessment
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        <form className="ion-padding" onSubmit={handleSubmit(onEditSubmit, onError)}>
          <IonGrid>
            <IonRow className="items-center py-1">
              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <IonLabel className="font-bold">
                      {taskType === DocType.TASK ? "Task Title" : "Assessment Title"}
                    </IonLabel>
                    <IonInput
                      fill="outline"
                      onIonChange={(e) => onChange(e.detail.value!)}
                      value={value}
                      placeholder={taskType === DocType.TASK ? "Update task title" : "Update assessment title"}
                      required
                    />
                  </>
                )}
              />
            </IonRow>
            <IonRow className="items-center py-1">
              <IonLabel className="font-bold">
                Subject
              </IonLabel>
              <IonInput
                fill="outline"
                onClick={handleOpenSubjectsModal}
                placeholder="Select a subject"
                value={getValues("subject")}
              />
            </IonRow>
            <IonRow className="py-1">
              <IonLabel className="font-bold">
                Deadline
              </IonLabel>
              <IonCol size="12" className="justify-start">
                <IonDatetimeButton datetime="datetime2" />
                <IonModal keepContentsMounted>
                  <IonDatetime
                    id="datetime2"
                    defaultValue={toBeUpdatedDoc?.deadlineDateParseable ? toBeUpdatedDoc.deadlineDateParseable : getValues("deadline")}
                    value={toBeUpdatedDoc?.deadlineDateParseable ? toBeUpdatedDoc.deadlineDateParseable : getValues("deadline")}
                    className="rounded-md"
                    hourCycle="h12"
                    presentation="date-time"
                    showDefaultButtons
                    onIonChange={(e) => {
                      console.log("UpdateTaskModal")
                      console.log("e.detail.value: ", e.detail.value)
                      setValue("deadline", e.detail.value!.toString())
                    }}
                  />
                </IonModal>
              </IonCol>
            </IonRow>

            <IonButton
              expand="block"
              className="pt-2"
              type="submit"
            >
              Update {taskType === DocType.TASK ? 'Task' : 'Assessment'}
            </IonButton>
          </IonGrid>

          <IonModal
            keepContentsMounted
            isOpen={isSubjectsModalOpen}
            onWillDismiss={handleCloseSubjectsModal}
            breakpoints={[0, 0.95]}
            initialBreakpoint={0.95}
          >
            <IonHeader>
              <IonToolbar>
                <IonSearchbar
                  slot="start"
                  name="searchText"
                  showCancelButton="always"
                  showClearButton="focus"
                  className="mt-5"
                  value={searchText}
                  onIonCancel={handleCloseSubjectsModal}
                  onIonInput={(e) => setSearchText(e.target.value ?? "")}>
                </IonSearchbar>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <Controller name="subject" control={control} render={({ field: { onChange } }) => (
                <IonList>
                  <IonRadioGroup value={getValues("subject")}>
                    {Object.values(Subject)
                      .filter(subject => subject.toLowerCase().includes(searchText.toLowerCase()))
                      .map((subject) => (
                        <IonItem key={subject} onClick={() => {
                          onChange(subject);
                          handleCloseSubjectsModal();
                          console.log("Selected subject: ", subject)
                        }}>
                          <IonRadio key={subject}>
                            {subject}
                          </IonRadio>
                        </IonItem>
                      ))}
                  </IonRadioGroup>
                </IonList>
              )} />
            </IonContent>
          </IonModal>
        </form>
      </IonHeader>
    </IonModal >
  )
}
