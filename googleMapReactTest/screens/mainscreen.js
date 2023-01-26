import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';

function MainScreen({navigation} ){
  
  return (

    <View style={{ backgroundColor: 'black', height: 1000 }}>
      <View style={{ backgroundColor:'green',width:500,height:70 }}>
          <Text style={{ backgroundColor: 'green', color:'white',marginLeft:70,margin:20,fontSize:15,fontFamily:'bold' }}>
                MILITARY CONVOY PROTECTION
          </Text>
        
      </View>
      <View style={{ flexDirection: 'row', marginTop: 120, marginLeft: 60,width:600,height:70 }}>
        <Image
          style={{ width: 70, height:70 }}
          source={{
            uri: 'https://www.crushpixel.com/static16/preview2/event-manager-chalk-white-icon-2323264.jpg',
          }}
        />
        <TouchableOpacity style={{ backgroundColor: 'green',width:200 }} onPress={() => navigation.navigate("Analysis Report")}>
          <Text style={{ marginLeft:50,backgroundColor: 'green', color: 'white', fontSize: 15, fontWeight: 'bold', margin: 20 }}>
            RISK ANALYSIS 
          </Text>
        </TouchableOpacity>

      </View>

      <View style={{ flexDirection: 'row', marginTop: 40, marginLeft: 60,width:600,height:70 }}>
        <Image
          style={{ width: 70, height: 70 }}
          source={{
            uri: 'https://png.pngtree.com/png-vector/20190330/ourlarge/pngtree-vector-route-icon-png-image_894735.jpg',
          }}
        />
        <TouchableOpacity style={{ backgroundColor: 'green',width:200 }} onPress={() => navigation.navigate('Traveling Information')}>
          <Text style={{ marginLeft:50,backgroundColor: 'green', color: 'white', fontSize:15, fontWeight: 'bold', margin: 20, }}>
            MONITORING

          </Text>
        </TouchableOpacity>

      </View>

      <View style={{ flexDirection: 'row', marginTop: 40, marginLeft: 60,width:600,height:70 }}>
        <Image
          style={{ width: 70, height: 70 }}
          source={{
            uri: 'data:image/png;base64,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',
          }}
        />
        <TouchableOpacity style={{ backgroundColor: 'green',width:200 }} onPress={() => navigation.navigate('Landmine Detection')}>
          <Text style={{ backgroundColor: 'green', color: 'white', fontSize:15, fontWeight: 'bold', margin: 20 }}>
            LANDMINE DETECT
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 40, marginLeft: 60,width:600,height:70 }}>
        <Image
          style={{ width: 70, height: 70 }}
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo2XfoF_0n9J8e5EYgPr-uyYMkHIqkoh7H14OyRYL96RIUM3Lsbc5xWv7nLaJ87-lZjkI&usqp=CAU',
          }}
        />
        <TouchableOpacity style={{ backgroundColor: 'green',width:200 }} onPress={() => navigation.navigate('Hotspot Prediction')} >
          <Text style={{ backgroundColor: 'green', color: 'white', fontSize: 15, fontWeight: 'bold', margin: 20 }}>
            HOTSPOT AREAS
          </Text>
        </TouchableOpacity>

      </View>

    </View>


  );
}
export default MainScreen;