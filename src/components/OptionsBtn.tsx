import { IonButton, IonIcon } from '@ionic/react'
import { ellipsisVertical, ellipsisVerticalOutline } from 'ionicons/icons'
import { isOptionsActiveAtom, optionsAtomWithToggle } from '../atoms'
import { useAtom } from 'jotai'

export default function OptionsBtn() {
  const [isActive, toggle] = useAtom(isOptionsActiveAtom);

  return (
    <IonButton onClick={() => toggle()}>
      <IonIcon icon={isActive ? ellipsisVertical : ellipsisVerticalOutline} />
    </IonButton>
  )
}
