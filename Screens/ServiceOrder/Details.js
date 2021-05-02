import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";

import moment from "moment";
export default function Details({ navigation, route }) {
  return (
    <View style={{ height: "100%" }}>
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 20, alignSelf: "center" }}>
          Servisni nalog: {route.params.serviceOrder.ServiceOrderNumber} /{" "}
          {moment(route.params.serviceOrder.OrderDate).format("DD-MM-yyyy")}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 20 }}>
          Kupac: {route.params.serviceOrder.Customer.Name}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Kontakt broj: {route.params.serviceOrder.Customer.PhoneNumber}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Artikl: {route.params.serviceOrder.Article}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Garantni rok: {route.params.serviceOrder.WarrantyPeriod ? "Da" : "Ne"}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Podaci bitni: {route.params.serviceOrder.EssencialData ? "Da" : "Ne"}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Opis: {route.params.serviceOrder.Description}
        </Text>

        <Text style={{ fontSize: 18, marginTop: 50, textAlign: "right" }}>
          Zaprimio: {route.params.serviceOrder.Received} u{" "}
          {route.params.serviceOrder.OrderTime}
        </Text>
      </View>
      <View
        style={{
          width: "90%",
          height: "30%",
          alignSelf: "center",
          marginTop: 40,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PhotoPreview", {
              photo: route.params.serviceOrder.Photo,
            })
          }
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={{ uri: route.params.serviceOrder.Photo }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
