import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';

export const Context = createContext();

export const FirebaseProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <Context.Provider //sluzi za spremanje vrijednosti varijable koja će se mijenjati tokom aplikacije
      value={{
        user,
        setUser,
      }}>
      {children}
    </Context.Provider>
  );
};
