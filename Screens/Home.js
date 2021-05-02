import React, {useEffect} from 'react';
import RNPrint from 'react-native-print';
import {View, FlatList, Text, ActivityIndicator} from 'react-native';
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
  const printPDF = async item => {
    await RNPrint.print({
      html: `
      <style>
      td, th {
        border: 1px solid black;
        text-align: left;
        font-size: 35px;
        margin:0px;
      }
      h2 {
        font-size:35px;
        text-align: center;
      }
      table{
        width:100%;
      }
      .service{
        width:80%;
      }
     .description{
       height:100px;
     }
     .order-info{
       font-size:35px;
       margin-top:100px;
     }
     .customer-line{
       margin-top:50px;
     }
     .received{
      margin-top:100px;
      float:right;
      font-size:35px;
     }
      </style>
      <h2>Servisni nalog br.: ${moment(item.OrderDate).year()}/${
        item.ServiceOrderNumber
      }</h2>
      <table>
      <tr>
        <td>Kupac:${item.Customer.Name}</td>
        <td>Tel./Mob.:${item.Customer.PhoneNumber}</td>
      </tr>
      </table>
      <h2>Za servis:</h2>
      <table>
      <tr>
        <td>Artikl:${item.Article}</td>
        
      </tr>
      <tr>
      <td class="service">Garantni rok:${item.WarrantyPeriod ? 'Da' : 'Ne'}</td>
      </tr>
      <tr>
      <td class="service">Podaci bitni:${item.EssentialData ? 'Da' : 'Ne'}</td>
      </tr>
      </table>
      <table>
      <tr class="description">
      <td>Opis:</td>
      <td>${item.Description}</td>
      </tr>
     
      </table>

      <div class="order-info"> <div>Datum i vrijeme naloga: ${
        moment(item.OrderDate).format('DD.MM.yyyy. u ') + item.OrderTime
      }
      </div>
      <div class="received"> <div>Zaprimio:</div> <div>${item.Received}</div>
      </div>
     
      <div class="order-info">Kupac</div>
      <div class="customer-line">_______________________</div>
      
      </div>
     
      `,
    });
  };
  return (
    <View style={{height: '100%', alignItems: 'center'}}>
      {!serviceOrders.loadingData ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.Id}
          style={{width: '100%'}}
          data={serviceOrders.data}
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
  return {
    serviceOrders: state.serviceOrdersData,
  };
};

const mapDispatchToProps = {
  fetchInProgressOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
