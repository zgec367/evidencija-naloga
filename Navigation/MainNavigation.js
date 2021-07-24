import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Context} from '../Components/FirebaseProvider';
import auth from '@react-native-firebase/auth';
import {Dimensions, Text, View, Alert, N} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home';
import Login from '../Screens/Login';
import {connect} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import {IconButton, Menu, Button} from 'react-native-paper';
import Create from '../Screens/ServiceOrder/Create';
import Details from '../Screens/ServiceOrder/Details';
import PhotoPreview from '../Screens/ServiceOrder/PhotoPreview';
import Edit from '../Screens/ServiceOrder/Edit';
import StartLogo from '../Screens/StartLogo';
import DoneOrders from '../Screens/ServiceOrder/DoneOrders';
import {logOut} from '../Redux/Employee/EmployeeActions';
import NoInternetConnection from '../Screens/NoInternetConnection';
function MainNavigation({logOut}) {
  const Stack = createStackNavigator(); //za kreiranje stoga, odnosno za navigaciju u aplikaciji, kad se ide kroz razne screenove
  const {user, setUser} = useContext(Context); //ulogiranje odlogiranje, sluzi za spremanje vrijednosti varijable koja će se mijenjati tokom aplikacije
  const [initLoggedUserFirebaseAuth, setInitLoggedUserFirebaseAuth] =
    useState(true); //kao loading za usera, on je na pocetku true, ako dohvati usera je false
  const [startLogoLoading, setStartLogoLoading] = useState(true);
  const [internetConnection, setInternetConnection] = useState();

  const [menuVisible, setMenuVisible] = useState(false);
  const onAuthStateChanged = user => {
    setUser(user);
    if (initLoggedUserFirebaseAuth) setInitLoggedUserFirebaseAuth(false); //ako user postoji ili ne postoji
  };
  const onStartLogoTimerFinished = async () => {
    setStartLogoLoading(false);
  };

  useEffect(() => {
    setTimeout(onStartLogoTimerFinished, 2000);

    const internetConnectionSubscribe = NetInfo.addEventListener(state => {
      setInternetConnection(state.isConnected);
    });
    const firebaseLoginLogoutSubscriber =
      auth().onAuthStateChanged(onAuthStateChanged);
    return firebaseLoginLogoutSubscriber, internetConnectionSubscribe; // unsubscribe on unmount
  }, []);

  if (initLoggedUserFirebaseAuth) return null;
  if (startLogoLoading) return <StartLogo />;
  if (!internetConnection) return <NoInternetConnection />;

  return (
    <NavigationContainer theme={{colors: {background: 'white'}}}>
      <Stack.Navigator initialRouteName="Home" mode="modal">
        {user ? (
          <Stack.Screen
            name="Home"
            component={Home}
            options={({navigation}) => ({
              headerLeft: () => (
                <Menu
                  visible={menuVisible}
                  statusBarHeight={48}
                  style={{marginLeft: 8}}
                  contentStyle={{
                    height: '110%',
                    width: Dimensions.get('window').width - 150,
                  }}
                  onDismiss={() => setMenuVisible(false)} //za klik negdje u app, makne menu...
                  anchor={
                    //3 crtice - menu button
                    <IconButton
                      size={40}
                      color="white"
                      icon="menu"
                      onPress={() => setMenuVisible(true)}
                    />
                  }>
                  <Text style={{margin: 10, fontSize: 20, color: '#072f3d'}}>
                    {user.displayName}
                  </Text>
                  <View
                    style={{
                      width: '90%',

                      height: '100%',
                      alignSelf: 'center',
                      marginTop: 50,
                    }}>
                    <Button
                      uppercase={false}
                      onPress={() => {
                        setMenuVisible(false);
                        navigation.navigate('FinishedOrders');
                      }}
                      style={{marginTop: 5}}
                      labelStyle={{
                        color: 'white',
                        fontSize: 15,
                      }}
                      mode="contained">
                      Izvršeni nalozi
                    </Button>

                    <Button
                      style={{marginTop: 40}}
                      onPress={() => {
                        Alert.alert(
                          'Odjava',
                          'Jeste li sigurni da se želite odjaviti?',
                          [
                            {
                              text: 'Odustani',
                              style: 'cancel',
                            },
                            {
                              text: 'Odjava',
                              onPress: () => {
                                setMenuVisible(false);
                                logOut();
                              },
                            },
                          ],
                        );
                      }}
                      labelStyle={{
                        fontSize: 15,
                        color: '#072f3d',
                        fontWeight: '700',
                      }}
                      mode="text">
                      Odjava
                    </Button>
                  </View>
                </Menu>
              ),
              headerTitle: 'Servisni nalozi',
              headerTintColor: 'white',
              headerTitleStyle: {
                fontSize: 20,
              },

              headerStyle: {
                backgroundColor: '#87cefa',
              },
            })}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Prijava',
              headerTintColor: 'white',
              headerTitleStyle: {
                fontSize: 20,
              },
              headerStyle: {
                backgroundColor: '#87cefa',
              },
            }}
          />
        )}
        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            title: 'Kreiranje servisnog naloga',
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 20,
            },
            headerStyle: {
              backgroundColor: '#87cefa',
            },
          }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{
            title: 'Uređivanje servisnog naloga',
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 20,
            },
            headerStyle: {
              backgroundColor: '#87cefa',
            },
          }}
        />

        <Stack.Screen
          name="Details"
          component={Details}
          options={{
            title: 'Detalji servisnog naloga',
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 25,
            },
            headerStyle: {
              backgroundColor: '#87cefa',
            },
          }}
        />
        <Stack.Screen
          name="PhotoPreview"
          component={PhotoPreview}
          options={{
            title: 'Prikaz slike',
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 25,
            },
            headerStyle: {
              backgroundColor: '#87cefa',
            },
          }}
        />
        <Stack.Screen
          name="FinishedOrders"
          component={DoneOrders}
          options={{
            title: 'Izvršeni nalozi',
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 25,
            },
            headerStyle: {
              backgroundColor: '#87cefa',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapDispatchToProps = {
  //iz reduxa, dohvaca se funkcija iz reduxa
  logOut,
};

export default connect(null, mapDispatchToProps)(MainNavigation);
//export default - exportam trenutnu komponentu da bude dostupna u drugoj komponenti
//connect - povezujem redux funkcije i stateove sa trenutnom komponentom
