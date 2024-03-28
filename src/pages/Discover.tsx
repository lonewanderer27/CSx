import { IonContent, IonLabel, IonList, IonListHeader, IonPage, useIonRouter, useIonViewWillEnter } from '@ionic/react'
import React, { useRef, useState } from 'react'
import AddBtn from '../components/AddBtn'
import AddModal from '../components/AddModal';
import LogoTitle from '../components/LogoTitle';
import { getDatabase } from 'firebase/database';
import firebaseApp from "../firebaseApp";
import Tasks from '../components/Tasks';

const db = getDatabase(firebaseApp);

function Discover() {
  const rt = useIonRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const page = useRef<HTMLElement>();
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  useIonViewWillEnter(() => {
    setPresentingElement(page.current);
  }, []);

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
          <IonListHeader>
            <IonLabel>Tasks</IonLabel>
          </IonListHeader>
          <Tasks title="tasks" firebaseKey='tasks' spec="specTasks" />
          <IonListHeader>
            <IonLabel>Assessments</IonLabel>
          </IonListHeader>
          <Tasks title="assessments" firebaseKey='assessments' spec="specAssessments"  />
        </IonList>
        <AddBtn handleAdd={handleOpenAddModal} />
        <AddModal 
          isOpen={isAddModalOpen} 
          handleDismiss={handleCloseAddModal} 
          presentingElement={presentingElement}
        />
      </IonContent>
    </IonPage>
  )
}

export default Discover