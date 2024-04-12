import { IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonToolbar, useIonAlert, useIonViewWillEnter } from "@ionic/react"
import { Subject, DocType } from "../enums"
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { Inputs, TaskModalProps } from "../types"
import { useRef, useState } from "react"
import { push, ref, set } from "firebase/database"
import { getDatabase } from "firebase/database"
import firebaseApp from "../firebaseApp"

const db = getDatabase(firebaseApp);

function AddTaskModal(props: TaskModalProps) {
  const page = useRef<HTMLElement>();
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  
  const handleOpenSubjectsModal = () => {
    setIsSubjectsModalOpen(true);
  }

  const handleCloseSubjectsModal = () => {
    setIsSubjectsModalOpen(false);
  }

  const [taskType, setTaskType] = useState<DocType>(DocType.TASK)
  const { getValues, control, handleSubmit, reset, setValue } = useForm<Inputs>();

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

  const onAddSubmit: SubmitHandler<Inputs> = (data) => {
    if (!verifyInputs(data)) return;
    const { deadline, title, subject } = data;

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
    if (taskType === DocType.TASK) {
      newData.specTask = title;
    } else {
      newData.specAssessment = title;
    }

    // save to database
    const listRef = ref(db, taskType === DocType.TASK ? 'tasks/' : 'assessments/');
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
    <IonModal
      isOpen={props.isOpen}
      onDidDismiss={props.handleDismiss}
      breakpoints={[0, 0.82]}
      initialBreakpoint={0.82}
      keepContentsMounted
    >
      <IonHeader>
        <IonToolbar>
          <IonSegment value={taskType} className="mt-2">
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

        <form className="ion-padding" onSubmit={handleSubmit(onAddSubmit, onError)}>
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
                      placeholder={taskType === DocType.TASK ? "Enter task title" : "Enter assessment title"}
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
                <IonDatetimeButton datetime="datetime" />
                <IonModal keepContentsMounted>
                  <IonDatetime
                    id="datetime"
                    value={getValues("deadline")}
                    className="rounded-md"
                    hourCycle="h12"
                    presentation="date-time"
                    showDefaultButtons
                    onIonChange={(e) => {
                      console.log("AddTaskModal")
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
              Send {taskType === DocType.TASK ? 'Task' : 'Assessment'}
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

export default AddTaskModal