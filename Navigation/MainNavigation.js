import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Context} from '../Components/FirebaseProvider';
import auth from '@react-native-firebase/auth';
import {Dimensions, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home';
import Login from '../Screens/Login';
import {IconButton, Menu, Button} from 'react-native-paper';
import Create from '../Screens/ServiceOrder/Create';
import Details from '../Screens/ServiceOrder/Details';
import PhotoPreview from '../Screens/ServiceOrder/PhotoPreview';
import Edit from '../Screens/ServiceOrder/Edit';
import StartLogo from '../Screens/StartLogo';
import DoneOrders from '../Screens/ServiceOrder/DoneOrders';
export default function MainNavigation() {
  const Stack = createStackNavigator();
  const {logOut} = useContext(Context);
  const {user, setUser} = useContext(Context);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };
  const toStartLogo = async () => {
    setLoading(false);
  };
  useEffect(() => {
    setTimeout(toStartLogo, 2000);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  if (loading) return <StartLogo />;
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
                  visible={visible}
                  statusBarHeight={48}
                  style={{marginLeft: 8}}
                  contentStyle={{
                    height: '70%',
                    width: Dimensions.get('window').width - 150,
                  }}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <IconButton
                      size={40}
                      color="white"
                      icon="menu"
                      onPress={() => setVisible(true)}
                    />
                  }>
                  <Text style={{margin: 10, fontSize: 20, color: '#072f3d'}}>
                    {user.displayName}
                  </Text>
                  <View
                    style={{
                      width: '90%',

                      height: Dimensions.get('window').height,
                      alignSelf: 'center',
                      marginTop: 50,
                    }}>
                    <Button
                      uppercase={false}
                      onPress={() => console.log('opa')}
                      labelStyle={{
                        fontSize: 15,
                        color: 'white',
                      }}
                      mode="contained">
                      Profil
                    </Button>
                    <Button
                      uppercase={false}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate('FinishedOrders');
                      }}
                      style={{marginTop: 20}}
                      labelStyle={{
                        color: 'white',
                        fontSize: 15,
                      }}
                      mode="contained">
                      Izvršeni nalozi
                    </Button>
                    <Button
                      style={{marginTop: 150}}
                      onPress={() => logOut()}
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
            title: 'Izvšeni nalozi',
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
