import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react'
import { add, addCircle, addCircleOutline, addCircleSharp } from 'ionicons/icons'

type AddBtnProps = {
  handleAdd: () => void
}

function AddBtn(props: AddBtnProps) {
  return (
    <IonFab slot="fixed" horizontal='end' vertical='bottom' className='p-5'>
      <IonFabButton color="tertiary" onClick={props.handleAdd}>
        <IonIcon src={add}></IonIcon>
      </IonFabButton>
    </IonFab>
  )
}

export default AddBtn