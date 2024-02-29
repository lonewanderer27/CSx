import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'

function About() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='p-2'>
          <IonButtons>
            <IonBackButton/>
          </IonButtons>
          <IonTitle>About CSx</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <h1>Who developed this awesome app?</h1>
      </IonContent>
    </IonPage>
  )
}

export default About