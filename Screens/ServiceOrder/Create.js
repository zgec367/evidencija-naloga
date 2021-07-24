import React, {useEffect, useContext, useState} from 'react';
import {View, ScrollView, Image, TouchableOpacity} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {launchCamera} from 'react-native-image-picker';
import {addServiceOrder} from '../../Redux/ServiceOrder/ServiceOrderActions';
import {
  Button,
  Text,
  TextInput,
  Checkbox,
  Card,
  Dialog,
  Portal,
} from 'react-native-paper';
import {Context} from '../../Components/FirebaseProvider';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

function Create({navigation, route, addServiceOrder, serviceOrders}) {
  const {user, setUser} = useContext(Context);
  const [employee, setEmployee] = useState({});
  const [hasPermission, setHasPermission] = useState(null);
  const [deleteDialog, setDelete] = useState(false);
  const [serviceOrderNumber, setServiceOrderNumber] = useState(
    route.params.orderNumber,
  );
  const [warrantyPeriod, setWarrantyPeriod] = useState(false);
  const [essentialData, setEssentialData] = useState(false);
  const [photo, setPhoto] = useState('');
  const [visible, setVisible] = useState(true);

  const validationSchema = Yup.object().shape({
    Article: Yup.string().required('Ovo je polje obavezno'),
    Name: Yup.string().required('Ovo je polje obavezno'),
    PhoneNumber: Yup.string()
      .required('Ovo je polje obavezno')
      .matches('^[0-9]+$', 'Neispravan broj'),
    Description: Yup.string().required('Ovo je polje obavezno'),
  });

  const getEmployee = async () => {
    await firestore()
      .collection('Employees')
      .where('Id', '==', user.uid)
      .get()
      .then(querySnapshot => {
        const result = querySnapshot.docs.map(e => e._data);
        setEmployee(...result);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const takePhoto = async () => {
    const permission = await Camera.requestPermissionsAsync();
    console.log('slikano' + permission.status);
    /*
    if (status === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      console.log(pickerResult);
    }*/
  };
  useEffect(() => {
    getEmployee();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{alignItems: 'center'}}
      keyboardShouldPersistTaps={'always'}>
      <View style={{width: '90%'}}>
        <Formik
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          initialValues={{
            Name: '',
            PhoneNumber: '',
            Article: '',
            Description: '',
            Received: '',
          }}
          onSubmit={async values => {
            const serviceOrder = {
              ServiceOrderNumber: serviceOrderNumber + 1,
              Customer: {
                Name: values.Name,
                PhoneNumber: values.PhoneNumber,
              },
              Article: values.Article,
              Description: values.Description,

              OrderTime: moment(new Date()).format('HH:mm'),
              Received: employee.Name,
              WarrantyPeriod: warrantyPeriod,
              EssentialData: essentialData,
              Photo: photo,
              Done: false,
            };

            addServiceOrder(serviceOrder, navigation);
          }}>
          {({handleChange, handleSubmit, handleBlur, values, errors}) => (
            <View>
              <Card style={{elevation: 15, marginTop: 20}}>
                <Card.Title title="Podaci o kupcu" />
                <Card.Content>
                  <TextInput
                    style={{marginTop: 10, backgroundColor: 'white'}}
                    label="Kupac"
                    placeholder="Kupac"
                    value={values.Name}
                    onBlur={handleBlur('Name')}
                    onChangeText={handleChange('Name')}
                  />
                  {errors.Name && (
                    <Text style={{color: 'red', marginLeft: 10}}>
                      {errors.Name}
                    </Text>
                  )}
                  <TextInput
                    label="Kontakt broj"
                    style={{marginTop: 15, backgroundColor: 'white'}}
                    placeholder="Kontakt broj"
                    onBlur={handleBlur('PhoneNumber')}
                    onChangeText={handleChange('PhoneNumber')}
                    value={values.PhoneNumber}
                    keyboardType="numeric"
                  />
                  {errors.PhoneNumber && (
                    <Text style={{color: 'red', marginLeft: 10}}>
                      {errors.PhoneNumber}
                    </Text>
                  )}
                </Card.Content>
              </Card>

              <Card style={{marginTop: 10, elevation: 15}}>
                <Card.Title title=" Podaci za servis" />
                <Card.Content>
                  <TextInput
                    style={{marginTop: 10, backgroundColor: 'white'}}
                    label="Artikl"
                    placeholder="Artikl"
                    value={values.Article}
                    onBlur={handleBlur('Article')}
                    onChangeText={handleChange('Article')}
                  />
                  {errors.Article && (
                    <Text style={{color: 'red', marginLeft: 10}}>
                      {errors.Article}
                    </Text>
                  )}
                  <TextInput
                    multiline={true}
                    style={{marginTop: 10, backgroundColor: 'white'}}
                    label="Opis"
                    placeholder="Opis"
                    value={values.Description}
                    onBlur={handleBlur('Description')}
                    onChangeText={handleChange('Description')}
                  />
                  {errors.Description && (
                    <Text style={{color: 'red', marginLeft: 10}}>
                      {errors.Description}
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      marginLeft: 30,
                      marginRight: 30,
                    }}>
                    <Text style={{fontSize: 18, marginTop: 40}}>
                      Garantni rok:
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        marginTop: 40,
                      }}>
                      Podaci bitni:
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      marginLeft: 60,
                      marginRight: 60,
                    }}>
                    <Checkbox
                      color="#87cefa"
                      status={warrantyPeriod ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setWarrantyPeriod(!warrantyPeriod);
                      }}
                    />

                    <Checkbox
                      color="#87cefa"
                      status={essentialData ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setEssentialData(!essentialData);
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      marginTop: 20,
                    }}>
                    Priloži fotografiju:
                  </Text>

                  {photo ? (
                    <TouchableOpacity
                      onLongPress={() => setDelete(true)}
                      onPress={() =>
                        launchCamera(
                          {
                            quality: 0.1,
                            maxHeight: 200,
                            maxWidth: 300,
                            includeBase64: false,
                          },

                          result => {
                            if (!result.didCancel) {
                              result.assets.map(data => setPhoto(data.uri));
                              console.log(photo);
                            }
                          },
                        )
                      }
                      style={{
                        marginTop: 20,
                        height: 300,
                      }}>
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                        source={{uri: photo}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon
                      style={{alignSelf: 'center'}}
                      name="photo"
                      size={200}
                      color="#87cefa"
                      onPress={() =>
                        launchCamera({quality: 0.2}, result => {
                          if (!result.didCancel) {
                            result.assets.map(data => setPhoto(data.uri));
                          }
                        })
                      }
                    />
                  )}
                  <Button
                    loading={serviceOrders.submitLoading}
                    disabled={serviceOrders.submitLoading}
                    style={{
                      marginTop: 40,
                      width: '60%',
                      alignSelf: 'center',
                    }}
                    uppercase={false}
                    labelStyle={{
                      color: serviceOrders.submitLoading ? '#87cefa' : 'white',
                      fontSize: 20,
                    }}
                    mode="contained"
                    onPress={handleSubmit}>
                    Kreiraj nalog
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}
        </Formik>
        <Portal>
          <Dialog visible={deleteDialog} onDismiss={() => setDelete(false)}>
            <Dialog.Title>Upozorenje!</Dialog.Title>
            <Dialog.Content>
              <Text style={{fontSize: 20}}>Obriši fotografiju?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setPhoto('');
                  setDelete(false);
                }}>
                Da
              </Button>
              <Button
                mode="outlined"
                style={{borderColor: '#87cefa', margin: 5}}
                onPress={() => {
                  setDelete(false);
                }}>
                Odustani
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </ScrollView>
  );
}
const mapStateToProps = state => {
  console.log(state.serviceOrdersData.submitLoading);
  return {
    serviceOrders: state.serviceOrdersData,
  };
};
const mapDispatchToProps = {
  addServiceOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
