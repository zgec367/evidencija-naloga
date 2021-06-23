import React from 'react';
import {View, Image} from 'react-native';

export default function PhotoPreview({navigation, route}) {
  return (
    <View style={{height: '100%'}}>
      <Image
        style={{height: '100%', width: '100%', resizeMode: 'contain'}}
        source={{uri: route.params.photo}}
      />
    </View>
  );
}
