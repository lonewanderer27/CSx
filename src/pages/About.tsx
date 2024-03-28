import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRippleEffect, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react'
import logo from "../assets/logo.png"
import { authors } from '../authors'

function About() {
  const visitAuthor = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='p-2'>
          <IonButtons>
            <IonBackButton defaultHref='/' />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <div>
          <img src={logo} alt="CSx Logo" className="mx-auto" />
        </div>
        <IonList lines="none">
          <IonListHeader>
            <IonLabel>Developed by</IonLabel>
          </IonListHeader>
          {authors.map(author => (
            <IonItem className='py-2' key={author.name} onClick={() => visitAuthor(author.url)}>
              <IonThumbnail slot="start">
                <img src={author.image} className='rounded-md' />
              </IonThumbnail>
              <IonLabel>
                <p style={{ fontWeight: "bold" }}>{author.name}</p>
                <p>{author.description}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default About