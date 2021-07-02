import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';

import moment from 'moment';
export default function Details({navigation, route}) {
  useEffect(() => {
    console.log(route.params.serviceOrder);
  }, []);
  return (
    <ScrollView>
      <View style={{height: '100%'}}>
        <View style={{margin: 10}}>
          <Text style={{fontSize: 20, alignSelf: 'center'}}>
            Servisni nalog: {route.params.serviceOrder.ServiceOrderNumber} /{' '}
            {moment(route.params.serviceOrder.OrderDate).format('DD-MM-yyyy')}
          </Text>
          <Text style={{fontSize: 18, marginTop: 20}}>
            Kupac: {route.params.serviceOrder.Customer.Name}
          </Text>
          <Text style={{fontSize: 18, marginTop: 10}}>
            Kontakt broj: {route.params.serviceOrder.Customer.PhoneNumber}
          </Text>
          <Text style={{fontSize: 18, marginTop: 10}}>
            Artikl: {route.params.serviceOrder.Article}
          </Text>
          <Text style={{fontSize: 18, marginTop: 10}}>
            Garantni rok:{' '}
            {route.params.serviceOrder.WarrantyPeriod ? 'Da' : 'Ne'}
          </Text>
          <Text style={{fontSize: 18, marginTop: 10}}>
            Podaci bitni:{' '}
            {route.params.serviceOrder.EssentialData ? 'Da' : 'Ne'}
          </Text>
          <Text style={{fontSize: 18, marginTop: 10}}>
            Opis: {route.params.serviceOrder.Description}
          </Text>
          {route.params.serviceOrder.PerformedServicesList.length ? (
            <Text style={{fontSize: 18, marginTop: 10}}>
              Izvršene usluge:{'\n'}
              {route.params.serviceOrder.PerformedServicesList.map(
                service => '- ' + service + '\n',
              )}
            </Text>
          ) : null}
          {route.params.serviceOrder.TotalPrice ? (
            <Text
              style={{
                fontSize: 18,
                marginTop: 20,
                fontWeight: '700',
                textAlign: 'right',
              }}>
              Ukupna cijena: {route.params.serviceOrder.TotalPrice} HRK
            </Text>
          ) : null}
          <Text style={{fontSize: 18, marginTop: 40, textAlign: 'right'}}>
            Zaprimio: {route.params.serviceOrder.Received} u{' '}
            {route.params.serviceOrder.OrderTime}
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            height: 200,
            alignSelf: 'center',
            marginTop: 40,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PhotoPreview', {
                photo: route.params.serviceOrder.Photo,
              })
            }>
            <Image
              style={{width: '100%', height: '100%'}}
              source={{uri: route.params.serviceOrder.Photo}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
