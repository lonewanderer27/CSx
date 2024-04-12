import { IonContent, IonLabel, IonList, IonListHeader, IonPage, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import { useRef, useState } from 'react'
import AddBtn from '../components/AddBtn'
import AddTaskModal from '../components/AddTaskModal';
import LogoTitle from '../components/LogoTitle';
import Tasks from '../components/Tasks';
import OptionsBtn from '../components/OptionsBtn';
import UpdateTaskModal from '../components/UpdateTaskModal';
import { useAtom } from 'jotai';
import { isUpdateModalOpenAtom } from '../atoms';

function Discover() {
  const rt = useIonRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, toggle] = useAtom(isUpdateModalOpenAtom);
  const page = useRef<HTMLElement>();

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  }

  const handleOpenInfo = () => {
    rt.push('/about')
  }

  return (
    <IonPage ref={page}>
      <LogoTitle handleInfo={handleOpenInfo} />
      <IonContent className='ion-padding'>
        <IonList>

          <IonListHeader style={{ marginBottom: "-15px" }}>
            <IonLabel>Tasks</IonLabel>
            <OptionsBtn />
          </IonListHeader>
          <Tasks title="tasks" firebaseKey='tasks' spec="specTasks" />

          <IonListHeader style={{ marginBottom: "-15px" }}>
            <IonLabel>Assessments</IonLabel>
            <OptionsBtn />
          </IonListHeader>
          <Tasks title="assessments" firebaseKey='assessments' spec="specAssessments" />
          
        </IonList>
        <AddBtn handleAdd={handleOpenAddModal} />
        <AddTaskModal
          isOpen={isAddModalOpen}
          handleDismiss={handleCloseAddModal}
        />
        {isUpdateModalOpen && 
          <UpdateTaskModal
          isOpen={isUpdateModalOpen}
          handleDismiss={() => toggle(false)}
        />}
      </IonContent>
    </IonPage>
  )
}

export default Discover