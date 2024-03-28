import { IonButton, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonToolbar, useIonAlert, useIonViewWillEnter } from "@ionic/react"
import { Subject, TaskType } from "../enums"
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { Inputs } from "../types"
import { useRef, useState } from "react"
import { push, ref, set } from "firebase/database"
import { getDatabase } from "firebase/database"
import firebaseApp from "../firebaseApp"

type AddModalProps = {
  isOpen: boolean
  handleDismiss: () => void
  presentingElement?: HTMLElement | undefined
}

const db = getDatabase(firebaseApp);

function AddModal(props: AddModalProps) {
  const page = useRef<HTMLElement>();
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);

  useIonViewWillEnter(() => {
    setPresentingElement(page.current);
  }, []);

  const handleOpenSubjectsModal = () => {
    setIsSubjectsModalOpen(true);
  }

  const handleCloseSubjectsModal = () => {
    setIsSubjectsModalOpen(false);
  }

  const [taskType, setTaskType] = useState<TaskType>(TaskType.TASK)
  const { getValues, control, handleSubmit, reset, setValue } = useForm<Inputs>();

  const [searchText, setSearchText] = useState("");

  console.log("searchTexT: ", searchText)

  const [submitting, setSubmitting] = useState(false);
  const [presentAlert] = useIonAlert();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("Data: ", data);
    const { deadline, title, subject } = data;

    // check if data is complete
    if (!title) {
      presentAlert("Title is required", [{ text: "Ok" }]);
      return;
    }

    if (!subject) {
      presentAlert("Please select a subject", [{ text: "Ok" }]);
      return;
    }

    setSubmitting(true);

    // get formatted data
    const deadlineDateReal = deadline ?? new Date().toISOString();
    const deadlineDate = new Date(deadline ?? new Date()).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }); // Format as "Month Day Year Hour:Minute AM/PM"

    // create task object
    let newData: any = {
      deadlineDate,
      deadlineDateReal,
      nameOfSubj: subject,
      specTask: title
    }

    // Determine specTask or specAssessment based on taskType
    if (taskType === TaskType.TASK) {
      newData.specTask = title;
    } else {
      newData.specAssessment = title;
    }

    // save to database
    const listRef = ref(db, taskType === TaskType.TASK ? 'tasks/' : 'assessments/');
    const newTaskRef = push(listRef);
    set(newTaskRef, newData)
    .then(() => {
      setSubmitting(false);

      // reset form
      reset();

      // hide this modal
      props.handleDismiss();
    }).catch((error: any) => {
      console.error("Error adding document: ", error);
    });
  }
  const onError: SubmitErrorHandler<Inputs> = (errors) => {
    console.log("Errors: ", errors);
  }

  return (
    <IonModal isOpen={props.isOpen} onDidDismiss={props.handleDismiss} presentingElement={props.presentingElement} keepContentsMounted>
      <IonHeader>
        <IonToolbar>
          <IonSegment value={taskType}>
            <IonSegmentButton value={TaskType.TASK} onClick={() => setTaskType(TaskType.TASK)}>
              <IonLabel>Task</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={TaskType.ASSESSMENT} onClick={() => setTaskType(TaskType.ASSESSMENT)}>
              <IonLabel>
                Assessment
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        <form className="ion-padding" onSubmit={handleSubmit(onSubmit, onError)}>
          <IonGrid>
            <IonRow className="items-center px-1">
              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    labelPlacement="fixed"
                    label="Title"
                    onIonChange={(e) => onChange(e.detail.value!)}
                    value={value}
                    placeholder={taskType === TaskType.TASK ? "Enter task title" : "Enter assessment title"}
                    required
                  />
                )}
              />
            </IonRow>
            <IonRow className="items-center">
              <IonCol>
                <IonLabel>
                  Subject
                </IonLabel>
              </IonCol>
              <IonCol size="9">
                <IonButton size="small" onClick={handleOpenSubjectsModal} className="ml-5">
                  <IonLabel>{getValues("subject") || "Select a subject"}</IonLabel>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow className="items-center">
              <IonCol>
                <IonLabel>
                  Deadline
                </IonLabel>
              </IonCol>
              <IonCol size="9">
                <IonDatetimeButton datetime="datetime" className="ml-[-40px]" />

                <IonModal keepContentsMounted>
                  <IonDatetime
                    id="datetime"
                    value={getValues("deadline")}
                    onIonChange={(e) => {
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
              Send {taskType === TaskType.TASK ? 'Task' : 'Assessment'}
            </IonButton>
          </IonGrid>

          <IonModal keepContentsMounted>
            <Controller name="deadline" control={control} render={({ field: { onChange, value } }) => (
              <IonDatetime className="rounded-lg" id="datetime" value={value} onIonChange={(e) => onChange(e.target.value)} />
            )} />
          </IonModal>

          <IonModal
            keepContentsMounted
            isOpen={isSubjectsModalOpen}
            onWillDismiss={handleCloseSubjectsModal}
          >
            <IonHeader>
              <IonToolbar>
                <IonSearchbar
                  name="searchText"
                  className="mt-5"
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.target.value ?? "")}>
                </IonSearchbar>
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding-horizontal">
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
    </IonModal>
  )
}

export default AddModal