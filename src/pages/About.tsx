import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import logo from "../assets/logo.png"

function About() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='p-2'>
          <IonButtons>
            <IonBackButton />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <div>
          <img src={logo} alt="CSx Logo" className="mx-auto" />
        </div>
      </IonContent>
      <IonFooter>
        <IonToolbar className="ion-padding">
          <IonButton expand="block">
            Install
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}

export default About