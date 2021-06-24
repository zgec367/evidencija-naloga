import React, { createContext, useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore, { firebase } from "@react-native-firebase/firestore";

export const Context = createContext();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        logOut: async () => {
          await auth()
            .signOut()
            .catch((error) => {
              console.log(error);
            });
        },
        addServiceOrder: async (serviceOrder, photo) => {
          await firestore()
            .collection("ServiceOrders")
            .add(serviceOrder)
            .then((snapshot) => {
              serviceOrder.Id = snapshot.id;
              if (photo) {
                const fileExtension = photo.split(".").pop();
                const fileName = `${snapshot.id}.${fileExtension}`;
                const storageRef = firebase
                  .storage()
                  .ref(`serviceorders/images/${fileName}`);
                storageRef.putFile(photo).on(
                  firebase.storage.TaskEvent.STATE_CHANGED,
                  (snapshot) => {
                    if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                      console.log("Success");
                    }
                  },
                  (error) => {
                    unsubscribe();
                    console.log("error: " + error.toString());
                  },
                  () => {
                    storageRef.getDownloadURL().then((downloadUrl) => {
                      console.log("file: " + downloadUrl);
                      serviceOrder.Photo = downloadUrl;
                      snapshot.set(serviceOrder);
                    });
                  }
                );
              } else {
                snapshot.set(serviceOrder);
              }
            });
        },
        editServiceOrder: async (serviceOrder) => {
          await firestore()
            .collection("ServiceOrders")
            .doc(serviceOrder.Id)
            .update({
              Customer: {
                Name: serviceOrder.Customer.Name,
                PhoneNumber: serviceOrder.Customer.PhoneNumber,
              },
              Article: serviceOrder.Article,
              Description: serviceOrder.Description,
              WarrantyPeriod: serviceOrder.WarrantyPeriod,
              EssentialData: serviceOrder.EssentialData,
            })
            .then((snapshot) => {
              console.log("uspjesna izmjena");
            })
            .catch((error) => console.log(error));
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};
