  import { IonButton, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRadio, IonRadioGroup, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonToolbar, useIonViewWillEnter } from "@ionic/react"
  import { Subject, TaskType } from "../enums"
  import { Controller, SubmitErrorHandler, SubmitHandler, set, useForm } from "react-hook-form"
  import { Inputs } from "../types"
  import { useRef, useState } from "react"

  type AddModalProps = {
    isOpen: boolean
    handleDismiss: () => void
    presentingElement?: HTMLElement | undefined
  }

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
    const { getValues, control, handleSubmit, reset } = useForm<Inputs>();

    const [searchText, setSearchText] = useState("");

    console.log("searchTexT: ", searchText)

    const [submitting, setSubmitting] = useState(false);
    const onSubmit: SubmitHandler<Inputs> = (data) => {
      setSubmitting(true);
      
      console.log("Data: ", data);

      // delay for 5 seconds
      setTimeout(() => {
        setSubmitting(false);
        props.handleDismiss();
      }, 5000);

      setSubmitting(false);

      // reset form
      reset();

      // hide this modal
      props.handleDismiss();
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
                        placeholder="Enter task of title" 
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
                <IonDatetime id="datetime" value={value} onIonChange={(e) => onChange(e.target.value)} />
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