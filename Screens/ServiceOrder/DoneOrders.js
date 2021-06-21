import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {View, FlatList, Text, ActivityIndicator} from 'react-native';
import {FAB, Card, IconButton} from 'react-native-paper';
import moment from 'moment';

function DoneOrders({navigation, serviceOrders}) {
  useEffect(() => {}, []);
  return (
    <View style={{height: '100%'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.Id}
        style={{width: '100%'}}
        data={serviceOrders.data.filter(item => item.Done == true)}
        renderItem={({item}) => (
          <Card
            onPress={() => navigation.navigate('Details', {serviceOrder: item})}
            style={{
              width: '90%',
              alignSelf: 'center',
              margin: 20,
              elevation: 10,
              backgroundColor: 'lightgrey',
            }}>
            <Card.Title
              style={{flexWrap: 'wrap'}}
              titleStyle={{color: '#072f3d'}}
              title={
                'Servisni nalog: ' +
                item.ServiceOrderNumber +
                '/' +
                moment(item.OrderDate).year()
              }
            />
            <Text style={{alignSelf: 'flex-end'}}>
              <IconButton
                icon="pencil"
                color="#072f3d"
                onPress={() =>
                  navigation.navigate('Edit', {serviceOrder: item})
                }
              />
              <IconButton
                icon="printer-pos"
                color="#072f3d"
                onPress={() => printPDF(item)}
              />
            </Text>

            <Card.Content>
              <Text style={{color: '#072f3d', fontSize: 15}}>
                {item.Article + ' - ' + item.Description}
              </Text>
              <Text style={{color: '#072f3d', fontSize: 15}}>
                {'Kontakt: ' + item.Customer.PhoneNumber}
              </Text>
            </Card.Content>
            {item.Photo && (
              <Card.Cover
                source={{uri: item.Photo}}
                style={{resizeMode: 'contain'}}
              />
            )}
          </Card>
        )}
      />
    </View>
  );
}
const mapStateToProps = state => {
  console.log('.----------------------------------------------QQQQQ');
  console.log(state.serviceOrdersData);

  return {
    serviceOrders: state.serviceOrdersData,
  };
};
export default connect(mapStateToProps, null)(DoneOrders);
