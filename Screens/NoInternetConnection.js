import React, {useContext, useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import NoInternet from '../assets/NoInternetConnection.png';

export default function NoInternetConnection({navigation}) {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Image width={'100%'} height={'100%'} source={NoInternet} />
    </View>
  );
}
