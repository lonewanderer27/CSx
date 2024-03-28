import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/index.css';

import Discover from './pages/Discover';
import About from './pages/About';
import { DatabaseProvider, FirebaseAppProvider, useFirebaseApp } from 'reactfire';
import { getDatabase } from 'firebase/database';

setupIonicReact({
  mode: 'ios'
});

const App: React.FC = () => {
  const app = useFirebaseApp();
  const db = getDatabase(app);

  return (
    <DatabaseProvider sdk={db}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Redirect to="/discover" />
            </Route>
            <Route path="/discover" exact={true}>
              <Discover />
            </Route>
            <Route path="/about" exact={true}>
              <About />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </DatabaseProvider>
  )
};

export default App;
