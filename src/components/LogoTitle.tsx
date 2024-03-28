import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/react'
import logo from "../assets/logo.png"
import { informationCircle } from 'ionicons/icons'

type LogoTitleProps = {
  handleInfo: () => void
}

function LogoTitle(props: LogoTitleProps) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="primary">
          <IonButton onClick={props.handleInfo}>
            <IonIcon size="large" src={informationCircle}></IonIcon>
          </IonButton>
        </IonButtons>
        <IonTitle><img src={logo} className="h-20 mx-auto" /></IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export default LogoTitle