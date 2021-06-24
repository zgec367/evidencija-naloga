import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {FirebaseProvider} from './Components/FirebaseProvider';
import MainNavigation from './Navigation/MainNavigation';
import store from './Redux/Store';
import {Provider} from 'react-redux';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#87cefa',
  },
};
export default function App({navigation}) {
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <FirebaseProvider>
          <MainNavigation />
        </FirebaseProvider>
      </Provider>
    </PaperProvider>
  );
}
