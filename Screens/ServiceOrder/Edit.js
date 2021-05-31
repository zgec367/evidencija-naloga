import React, {useEffect, useContext, useState} from 'react';
import {View, ScrollView, Image, TouchableOpacity} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
  Button,
  Text,
  TextInput,
  Checkbox,
  Card,
  IconButton,
  Chip,
} from 'react-native-paper';
import {Context} from '../../Components/FirebaseProvider';
import {editServiceOrder} from '../../Redux/ServiceOrder/ServiceOrderActions';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {set} from 'react-native-reanimated';
import {connect} from 'react-redux';

function Edit({navigation, route, editServiceOrder, serviceOrders}) {
  const [loading, setLoading] = useState(false);
  const [performedServices, setPerformedServices] = useState('');
  const [performedServicesList, setPerformedServicesList] = useState([]);
  const [servicePrice, setServicePrice] = useState(null);
  const [deleteDialog, setDelete] = useState(false);
  const [serviceOrderNumber, setServiceOrderNumber] = useState(
    route.params.orderNumber,
  );
  const [serviceOrder, setServiceOrder] = useState(route.params.serviceOrder);
  const [warrantyPeriod, setWarrantyPeriod] = useState(
    route.params.serviceOrder.WarrantyPeriod,
  );
  const [essentialData, setEssentialData] = useState(
    route.params.serviceOrder.EssentialData,
  );

  const validationSchema = Yup.object().shape({
    PhoneNumber: Yup.string().required('Ovo je polje obavezno'),
    Article: Yup.string().required('Ovo je polje obavezno'),
    Name: Yup.string().required('Ovo je polje obavezno'),
    PhoneNumber: Yup.string().required('Ovo je polje obavezno'),
    Description: Yup.string().required('Ovo je polje obavezno'),
  });

  const savePhoto = photoUri => {
    setPhoto(photoUri);
  };

  const removeChip = chipToDelete => {
    setPerformedServicesList(chips =>
      chips.filter(chip => chip !== chipToDelete),
    );
  };

  return (
    <ScrollView contentContainerStyle={{alignItems: 'center'}}>
      <View style={{width: '90%'}}>
        <Formik
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          initialValues={{
            Name: serviceOrder.Customer.Name,
            PhoneNumber: serviceOrder.Customer.PhoneNumber,
            Article: serviceOrder.Article,
            Description: serviceOrder.Description,
            Received: serviceOrder.Received,
            PerformedServicesPrice: serviceOrder.PerformedServicesPrice
              ? serviceOrder.PerformedServicesPrice
              : '',
            TotalPrice: serviceOrder.TotalPrice ? serviceOrder.TotalPrice : '',
            Component: '',
          }}
          onSubmit={async values => {
            const orderEdit = {
              Customer: {
                Name: values.Name,
                PhoneNumber: values.PhoneNumber,
              },
              Id: serviceOrder.Id,
              Article: values.Article,
              Description: values.Description,
              WarrantyPeriod: warrantyPeriod,
              EssentialData: essentialData,
              PerformedServicesList: performedServicesList,
              TotalPrice: values.TotalPrice,
            };

            editServiceOrder(orderEdit);
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
                    keyboardType="number-pad"
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
                  {route.params.serviceOrder.Photo && (
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          marginTop: 20,
                        }}>
                        Fotografija artikla:
                      </Text>
                      <View style={{height: 200}}>
                        <Image
                          style={{width: '100%', height: '100%'}}
                          source={{uri: route.params.serviceOrder.Photo}}
                        />
                      </View>
                    </View>
                  )}

                  <Card
                    style={{
                      marginTop: 25,
                      elevation: 15,
                      backgroundColor: '#87cefa',
                    }}>
                    <Card.Title title="Izvršene usluge" />

                    <Card.Content>
                      <View>
                        <TextInput
                          right={
                            <TextInput.Icon
                              icon="plus-circle"
                              color="#072f3d"
                              size={75}
                              onPress={() => {
                                if (values.Component.length) {
                                  performedServicesList.push(values.Component);
                                  console.log(performedServicesList);
                                }
                                values.Component = '';
                              }}
                            />
                          }
                          style={{backgroundColor: 'white'}}
                          onBlur={handleBlur('Component')}
                          onChangeText={handleChange('Component')}
                          label="Utrošeni materijal/usluga"
                          placeholder="Proizvod/usluga"
                          value={values.Component}
                        />

                        {performedServicesList.map((item, index) => (
                          <Chip
                            key={index}
                            onClose={() =>
                              setPerformedServicesList(chips =>
                                chips.filter(chip => chip !== item),
                              )
                            }
                            onPress={() => console.log('Pressed')}>
                            {item}
                          </Chip>
                        ))}

                        <TextInput
                          style={{backgroundColor: 'white'}}
                          onBlur={handleBlur('PerformedServicesPrice')}
                          onChangeText={handleChange('PerformedServicesPrice')}
                          label="Cijena usluge"
                          placeholder="Unesite cijenu (HRK)"
                          value={values.PerformedServicesPrice.toString()}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                        }}></View>
                    </Card.Content>
                  </Card>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      loading={loading}
                      style={{
                        marginTop: 40,

                        align: 'Right',
                      }}
                      uppercase={false}
                      labelStyle={{
                        color: loading ? '#87cefa' : 'white',
                        fontSize: 15,
                      }}
                      mode="contained"
                      onPress={handleSubmit}>
                      Završi nalog
                    </Button>
                    <Button
                      loading={loading}
                      style={{
                        marginTop: 40,

                        align: 'Right',
                      }}
                      uppercase={false}
                      labelStyle={{
                        color: loading ? '#87cefa' : 'white',
                        fontSize: 15,
                      }}
                      mode="contained"
                      onPress={handleSubmit}>
                      Spremi izmjene
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            </View>
          )}
        </Formik>
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
  editServiceOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
