import React, { useEffect, useContext, useState } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Text, TextInput, Checkbox, Card } from "react-native-paper";
import { Context } from "../../Components/FirebaseProvider";

export default function Edit({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDelete] = useState(false);
  const [serviceOrderNumber, setServiceOrderNumber] = useState(
    route.params.orderNumber
  );
  const [serviceOrder, setServiceOrder] = useState(route.params.serviceOrder);
  const [warrantyPeriod, setWarrantyPeriod] = useState(
    route.params.serviceOrder.WarrantyPeriod
  );
  const [essentialData, setEssentialData] = useState(
    route.params.serviceOrder.EssentialData
  );

  const validationSchema = Yup.object().shape({
    PhoneNumber: Yup.string().required("Ovo je polje obavezno"),
    Article: Yup.string().required("Ovo je polje obavezno"),
    Name: Yup.string().required("Ovo je polje obavezno"),
    PhoneNumber: Yup.string().required("Ovo je polje obavezno"),
    Description: Yup.string().required("Ovo je polje obavezno"),
  });
  const { editServiceOrder } = useContext(Context);
  const savePhoto = (photoUri) => {
    setPhoto(photoUri);
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <View style={{ width: "90%" }}>
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
          }}
          onSubmit={async (values) => {
            const order = {
              Customer: {
                Name: values.Name,
                PhoneNumber: values.PhoneNumber,
              },
              Id: serviceOrder.Id,
              Article: values.Article,
              Description: values.Description,
              WarrantyPeriod: warrantyPeriod,
              EssentialData: essentialData,
            };

            editServiceOrder(order);
          }}
        >
          {({ handleChange, handleSubmit, handleBlur, values, errors }) => (
            <View>
              <Card style={{ elevation: 15, marginTop: 20 }}>
                <Card.Title title="Podaci o kupcu" />
                <Card.Content>
                  <TextInput
                    style={{ marginTop: 10, backgroundColor: "white" }}
                    label="Kupac"
                    placeholder="Kupac"
                    value={values.Name}
                    onBlur={handleBlur("Name")}
                    onChangeText={handleChange("Name")}
                  />
                  {errors.Name && (
                    <Text style={{ color: "red", marginLeft: 10 }}>
                      {errors.Name}
                    </Text>
                  )}
                  <TextInput
                    label="Kontakt broj"
                    style={{ marginTop: 15, backgroundColor: "white" }}
                    placeholder="Kontakt broj"
                    onBlur={handleBlur("PhoneNumber")}
                    onChangeText={handleChange("PhoneNumber")}
                    value={values.PhoneNumber}
                    keyboardType="number-pad"
                  />
                  {errors.PhoneNumber && (
                    <Text style={{ color: "red", marginLeft: 10 }}>
                      {errors.PhoneNumber}
                    </Text>
                  )}
                </Card.Content>
              </Card>

              <Card style={{ marginTop: 10, elevation: 15 }}>
                <Card.Title title=" Podaci za servis" />
                <Card.Content>
                  <TextInput
                    style={{ marginTop: 10, backgroundColor: "white" }}
                    label="Artikl"
                    placeholder="Artikl"
                    value={values.Article}
                    onBlur={handleBlur("Article")}
                    onChangeText={handleChange("Article")}
                  />
                  {errors.Article && (
                    <Text style={{ color: "red", marginLeft: 10 }}>
                      {errors.Article}
                    </Text>
                  )}
                  <TextInput
                    multiline={true}
                    style={{ marginTop: 10, backgroundColor: "white" }}
                    label="Opis"
                    placeholder="Opis"
                    value={values.Description}
                    onBlur={handleBlur("Description")}
                    onChangeText={handleChange("Description")}
                  />
                  {errors.Description && (
                    <Text style={{ color: "red", marginLeft: 10 }}>
                      {errors.Description}
                    </Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      marginLeft: 30,
                      marginRight: 30,
                    }}
                  >
                    <Text style={{ fontSize: 18, marginTop: 40 }}>
                      Garantni rok:
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        marginTop: 40,
                      }}
                    >
                      Podaci bitni:
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      marginLeft: 60,
                      marginRight: 60,
                    }}
                  >
                    <Checkbox
                      color="#87cefa"
                      status={warrantyPeriod ? "checked" : "unchecked"}
                      onPress={() => {
                        setWarrantyPeriod(!warrantyPeriod);
                      }}
                    />

                    <Checkbox
                      color="#87cefa"
                      status={essentialData ? "checked" : "unchecked"}
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
                        }}
                      >
                        Fotografija artikla:
                      </Text>
                      <View style={{ height: 200 }}>
                        <Image
                          style={{ width: "100%", height: "100%" }}
                          source={{ uri: route.params.serviceOrder.Photo }}
                        />
                      </View>
                    </View>
                  )}

                  <Button
                    loading={loading}
                    style={{
                      marginTop: 40,
                      width: "50%",
                      alignSelf: "center",
                    }}
                    uppercase={false}
                    labelStyle={{
                      color: loading ? "#87cefa" : "white",
                      fontSize: 20,
                    }}
                    mode="contained"
                    onPress={handleSubmit}
                  >
                    Potvrdi nalog
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}
