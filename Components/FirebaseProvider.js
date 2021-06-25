import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';

export const Context = createContext();

export const FirebaseProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logOut: async () => {
          await auth()
            .signOut()
            .catch(error => {
              console.log(error);
            });
        },
      }}>
      {children}
    </Context.Provider>
  );
};
