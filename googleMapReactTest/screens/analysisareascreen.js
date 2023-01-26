import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Button,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

const AnalysisReport = ({ navigation }) => {
  const [marker, setMarker] = useState({});
  const [areaname, setAreaname] = useState("");
  const placebetween = {
    latitude: 31.75069, longitude: 73.98471
  }
  Geocoder.init("AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk");
  const mapRef = useRef(null);
  const markerRef = useRef();

  const edgePaddingValue = 70;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  function onMapPress(e) {
    setMarker(e.nativeEvent.coordinate);
    console.log(marker);
    Geocoder.from(marker.latitude, marker.longitude)
      .then(json => {
        var addressComponent = json.results[0].address_components[1].long_name;
        setAreaname(addressComponent);
      })
      .catch(error => console.warn(error));
  }

  const video = "video0.mp4";

  const getPersonFromApiAsync = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/detect2/?video=' + video,
      );
      const objperson=await JSON.parse(JSON.stringify(response));
      console.log(objperson.headers.map.person);
    } catch (error) {
      console.error(error);
    }
  };
 
  React.useEffect(() => {
    getPersonFromApiAsync();
    setMarker(placebetween);

    Geocoder.from(marker.latitude, marker.longitude)
      .then(json => {
        var addressComponent = json.results[0].address_components[1].long_name;
        setAreaname(addressComponent);
      })
      .catch(error => console.warn(error));
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.Container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 30.3753,
            longitude: 69.3451,
            latitudeDelta: 0.0214,
            longitudeDelta: 0.0567,
          }}
          onPress={e => onMapPress(e)}
        >
          <Marker coordinate={marker}>
            {/* <View style={{}}>
                        <Text style={{color:'blue', fontWeight:"bold"}}>
                            {"lat: " + marker.latitude + "\nlng: " + marker.longitude}
                        </Text>
                    </View> */}
          </Marker>
        </MapView>
        <View style={styles.ButtonArea}>
          <View style={{ marginBottom: 10, }}>
            <Text

              style={{
                justifyContent: 'center',
                color: 'black',
                marginTop: 10,
                marginLeft: 50,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Risk Analysis Report
            </Text>
            <View style={{
              backgroundColor: 'black',
              borderRadius: 8,
              paddingVertical: 15,
              paddingHorizontal: 25,
              width: '100%',
              marginVertical: 10,
              opacity: 0.9,
            }}>

              <View style={{
                justifyContent: 'center',

                marginTop: 20,
                flexDirection: 'row',

              }} >

                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,

                    fontSize: 20,
                  }}>Area name</Text>
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                    color: 'green',
                    fontSize: 20,
                  }}>{areaname}</Text>

              </View>


              <View style={{
                justifyContent: 'center',


                flexDirection: 'row',

              }} >

                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,

                    fontSize: 20,
                  }}>Risk Category</Text>
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                    color: 'green',
                    fontSize: 20,
                  }}>Mine Detected</Text>

              </View>
              <View style={{
                justifyContent: 'center',

                marginTop: 0,
                flexDirection: 'row',

              }} >
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    fontSize: 20,
                  }}>Level Of Danger</Text>
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                    color: 'green',
                    fontSize: 20,
                  }}>HIGH</Text>
              </View>
              <View style={{
                justifyContent: 'center',

                marginTop: 0,
                flexDirection: 'row',

              }} >
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,

                    fontSize: 20,
                  }}>
                  Probablity
                </Text>
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 30,
                    color: 'green',
                    fontSize: 20,
                  }}>
                  98 perc
                </Text>
              </View>
              <View style={{
                justifyContent: 'center',

                marginTop: 0,
                flexDirection: 'row',

              }} >
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,

                    fontSize: 20,
                  }}>
                  Terrorist Involved
                </Text>
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                    color: 'green',
                    fontSize: 20,
                  }}>
                  20
                </Text>
              </View>
              <View style={{
                justifyContent: 'center',

                marginTop: 0,
                flexDirection: 'row',

              }} >
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,

                    fontSize: 20,
                  }}>
                  Probablity of loss
                </Text>
                <Text

                  style={{
                    justifyContent: 'center',

                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 20,
                    color: 'green',
                    fontSize: 20,
                  }}>
                  20 perc
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    minHeight: '30%',
  },
  Container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black'

  },
  Webview: {
    flex: 2,

  },
  ButtonArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: '100%',
    marginVertical: 10,
  },
  Button: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});






export default AnalysisReport;