import React from 'react';
import {connect} from 'react-redux';
import {View, FlatList, Text} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import RNPrint from 'react-native-print';
import moment from 'moment';
function DoneOrders({navigation, serviceOrders}) {
  const printPDF = async serviceOrder => {
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
   .order-price{
    font-size:40px;
    font-weight:500;
    float:right;
    margin-top:20px;
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
    <h2>Servisni nalog br.: ${moment(serviceOrder.OrderDate).year()}/${
        serviceOrder.ServiceOrderNumber
      }</h2>
    <table>
    <tr>
      <td>Kupac:${serviceOrder.Customer.Name}</td>
      <td>Tel./Mob.:${serviceOrder.Customer.PhoneNumber}</td>
    </tr>
    </table>
    <h2>Za servis:</h2>
    <table>
    <tr>
      <td>Artikl:${serviceOrder.Article}</td>
      
    </tr>
    <tr>
    <td class="service">Garantni rok:${
      serviceOrder.WarrantyPeriod ? 'Da' : 'Ne'
    }</td>
    </tr>
    <tr>
    <td class="service">Podaci bitni:${
      serviceOrder.EssentialData ? 'Da' : 'Ne'
    }</td>
    </tr>
    </table>
    <table>
    <tr class="description">
    <td>Opis:</td>
    <td>${serviceOrder.Description}</td>
    <tr class="description">
    <td>Izvršene usluge:</td>
    <td>${serviceOrder.PerformedServicesList.map(service => service)}</td>
    </tr>
   
    </table>
    <div class="order-price">Ukupna cijena: ${serviceOrder.TotalPrice} HRK</div>
    <div class="order-info"> <div>Datum i vrijeme naloga: ${
      moment(serviceOrder.OrderDate).format('DD.MM.yyyy. u ') +
      serviceOrder.OrderTime
    }
    </div>
    <div class="received"> <div>Zaprimio:</div> <div>${
      serviceOrder.Received
    }</div>
    </div>
   
    <div class="order-info">Kupac</div>
    <div class="customer-line">_______________________</div>
    
    </div>
   
    `,
    });
  };

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
                size={30}
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
            {item.Photo ? (
              <Card.Cover
                source={{uri: item.Photo}}
                style={{resizeMode: 'contain'}}
              />
            ) : null}
          </Card>
        )}
      />
    </View>
  );
}
const mapStateToProps = state => {
  console.log(state.serviceOrdersData);

  return {
    serviceOrders: state.serviceOrdersData,
  };
};
export default connect(mapStateToProps, null)(DoneOrders);
