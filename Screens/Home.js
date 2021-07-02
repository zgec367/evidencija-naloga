import React, {useEffect} from 'react';
import {View, FlatList, Text, ActivityIndicator, Image} from 'react-native';
import {FAB, Card, IconButton} from 'react-native-paper';
import moment from 'moment';
import {connect} from 'react-redux';
import {fetchInProgressOrder} from '../Redux/ServiceOrder/ServiceOrderActions';
function Home({navigation, serviceOrders, fetchInProgressOrder}) {
  useEffect(() => {
    if (!serviceOrders.data.length) {
      console.log('NEMA');
      fetchInProgressOrder();
    }
  }, []);

  return (
    <View style={{height: '100%', alignItems: 'center'}}>
      {!serviceOrders.loadingData ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.Id}
          style={{width: '100%'}}
          data={serviceOrders.data.filter(item => item.Done == false)}
          renderItem={({item}) => (
            <Card
              onPress={() =>
                navigation.navigate('Details', {serviceOrder: item})
              }
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
                right={() => (
                  <Text style={{alignSelf: 'flex-end'}}>
                    <IconButton
                      size={40}
                      icon="pencil"
                      color="#072f3d"
                      onPress={() =>
                        navigation.navigate('Edit', {serviceOrder: item})
                      }
                    />
                  </Text>
                )}
              />

              <Card.Content>
                <Text style={{color: '#072f3d', fontSize: 15}}>
                  {item.Article + ' - ' + item.Description}
                </Text>
                <Text style={{color: '#072f3d', fontSize: 15}}>
                  {'\nKupac: ' + item.Customer.Name}
                </Text>
                <Text style={{color: '#072f3d', fontSize: 15}}>
                  {'Kontakt: ' + item.Customer.PhoneNumber}
                </Text>
              </Card.Content>
              {item.Photo ? (
                <View
                  style={{
                    width: '90%',
                    height: 200,
                    alignSelf: 'center',
                    margin: 10,
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={{uri: item.Photo}}
                  />
                </View>
              ) : null}
            </Card>
          )}
        />
      ) : (
        <ActivityIndicator
          style={{marginTop: 40}}
          size="large"
          color="#87cefa"
        />
      )}
      <FAB
        style={{
          position: 'absolute',
          bottom: 0,
          margin: 15,
          right: 0,
          backgroundColor: '#87cefa',
        }}
        color="white"
        icon="plus"
        onPress={() => {
          navigation.navigate('Create', {
            orderNumber: serviceOrders.data.length,
          });
        }}
      />
    </View>
  );
}
const mapStateToProps = state => {
  console.log(state.serviceOrdersData.data);

  return {
    serviceOrders: state.serviceOrdersData,
  };
};

const mapDispatchToProps = {
  fetchInProgressOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
