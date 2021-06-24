import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
  Button,
  Text,
  TextInput,
  Checkbox,
  Card,
  Chip,
} from 'react-native-paper';
import {editServiceOrder} from '../../Redux/ServiceOrder/ServiceOrderActions';
import {connect} from 'react-redux';

function Edit({navigation, route, editServiceOrder}) {
  const [loading, setLoading] = useState(false);
  const [finishOrder, setFinishedOrder] = useState(false);

  const [performedServicesList, setPerformedServicesList] = useState(
    route.params.serviceOrder.PerformedServicesList
      ? route.params.serviceOrder.PerformedServicesList
      : [],
  );

  const [serviceOrder, setServiceOrder] = useState(route.params.serviceOrder);
  const [warrantyPeriod, setWarrantyPeriod] = useState(
    route.params.serviceOrder.WarrantyPeriod,
  );
  const [essentialData, setEssentialData] = useState(
    route.params.serviceOrder.EssentialData,
  );
  console.log(
    '33 linija edit..' + route.params.serviceOrder.PerformedServicesList,
  );
  const validationSchema = Yup.object().shape({
    PhoneNumber: Yup.string().required('Ovo je polje obavezno'),
    Article: Yup.string().required('Ovo je polje obavezno'),
    Name: Yup.string().required('Ovo je polje obavezno'),
    PhoneNumber: Yup.string().required('Ovo je polje obavezno'),
    Description: Yup.string().required('Ovo je polje obavezno'),
  });

  const addChip = value => {
    setPerformedServicesList([...performedServicesList, value]);
  };

  return (
    <ScrollView
      contentContainerStyle={{alignItems: 'center'}}
      keyboardShouldPersistTaps="always">
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
            TotalPrice: serviceOrder.TotalPrice ? serviceOrder.TotalPrice : '',
            Component: '',
          }}
          onSubmit={async values => {
            serviceOrder.Customer = {
              Name: values.Name,
              PhoneNumber: values.PhoneNumber,
            };

            serviceOrder.Article = values.Article;
            serviceOrder.Description = values.Description;
            serviceOrder.WarrantyPeriod = warrantyPeriod;
            serviceOrder.EssentialData = essentialData;
            serviceOrder.PerformedServicesList = performedServicesList;
            serviceOrder.TotalPrice = values.TotalPrice;
            serviceOrder.Done = finishOrder ? true : serviceOrder.Done;

            editServiceOrder(serviceOrder, navigation);
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
                  {route.params.serviceOrder.Photo ? (
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
                  ) : null}

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
                              size={50}
                              onPress={() => {
                                if (values.Component.length) {
                                  addChip(values.Component);
                                }
                                values.Component = '';
                              }}
                            />
                          }
                          style={{backgroundColor: 'white'}}
                          onBlur={handleBlur('Component')}
                          onChangeText={handleChange('Component')}
                          label="Utrošeni materijal"
                          placeholder="Proizvod"
                          value={values.Component}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: 20,
                          }}>
                          {performedServicesList.map((item, index) => (
                            <Chip
                              style={{backgroundColor: 'white', margin: 5}}
                              key={index}
                              onClose={() =>
                                setPerformedServicesList(chips =>
                                  chips.filter(chip => chip !== item),
                                )
                              }
                              onPress={() => console.log(item)}>
                              {item}
                            </Chip>
                          ))}
                        </View>

                        <TextInput
                          style={{backgroundColor: 'white', marginTop: 10}}
                          onBlur={handleBlur('TotalPrice')}
                          onChangeText={handleChange('TotalPrice')}
                          label="Cijena usluge"
                          placeholder="Unesite cijenu"
                          value={values.TotalPrice}
                          left={
                            <TextInput.Affix
                              text="HRK"
                              textStyle={{margin: 5}}
                            />
                          }
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
                      onPress={() => {
                        if (values.TotalPrice && performedServicesList.length) {
                          setFinishedOrder(true);
                          handleSubmit();
                        } else {
                          alert(
                            'Niste unijeli cijenu i usluge servisnog naloga',
                          );
                        }
                      }}>
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

const mapDispatchToProps = {
  editServiceOrder,
};

export default connect(null, mapDispatchToProps)(Edit);
