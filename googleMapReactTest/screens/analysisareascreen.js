import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Button,
  ScrollView,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

const AnalysisReport = ({ navigation }) => {
  const [marker, setMarker] = useState({});
  const [areaname, setAreaname] = useState("");
  const [report, setReport] = useState([]);
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
    Geocoder.from(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
      .then(json => {
        var addressComponent = json.results[0].address_components[1].long_name;
        setAreaname(addressComponent);
        getRiskAreaFromApiAsync(addressComponent);
        setReport([]);
      })
      .catch(error => console.warn(error));
  }

  const video = "video0.mp4";

  const getRiskAreaFromApiAsync = async (name) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/riskarea/?name=' + name,
      );
      const objperson = await JSON.parse(JSON.stringify(response));
      console.log(typeof (objperson.headers.map.result));
      var result = JSON.parse(objperson.headers.map.result.replace(/\'/g, "\""));
      console.log(typeof (result));
      console.log(result);
      setReport(result);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    setMarker(placebetween);

    // Geocoder.from(marker.latitude, marker.longitude)
    //   .then(json => {
    //     var addressComponent = json.results[0].address_components[1].long_name;
    //     setAreaname(addressComponent);
    //     console.log("Entered");
    //     getRiskAreaFromApiAsync(areaname);
    //   })
    //   .catch(error => console.warn(error));
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
            latitudeDelta: 8,
            longitudeDelta: 8,
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
              paddingHorizontal: 15,
              width: '100%',
              marginVertical: 10,
              opacity: 0.9,
              height: 400,
            }}>
              <ScrollView>


                <View style={{
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginTop: 20,
                  flexDirection: 'row',

                }} >


                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',

                      marginTop: 10,
                      marginBottom: 10,

                      fontSize: 20,
                    }}>Area name</Text>
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 20,
                      color: 'green',
                      fontSize: 20,
                    }}>{areaname}</Text>

                </View>


                <View style={{
                  justifyContent: 'center',
                  paddingHorizontal:10,

                  flexDirection: 'row',

                }} >

                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,

                      fontSize: 20,
                    }}>Success</Text>
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 20,
                      color: 'green',
                      fontSize: 20,
                    }}>{report[1]}</Text>

                </View>
                <View style={{
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginTop: 0,
                  flexDirection: 'row',

                }} >
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      fontSize: 20,
                    }}>Targets</Text>
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 20,
                      color: 'green',
                      fontSize: 20,
                    }}>{report[2]}</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginTop: 0,
                  flexDirection: 'row',

                }} >
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      paddingHorizontal:10,
                      fontSize: 20,
                    }}>
                    Attack Nature
                  </Text>
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 30,
                      color: 'green',
                      fontSize: 20,
                    }}>
                    {report[5]}
                  </Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginTop: 0,
                  flexDirection: 'row',

                }} >
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,

                      fontSize: 20,
                    }}>
                    Weapon Used
                  </Text>
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 20,
                      color: 'green',
                      fontSize: 20,
                    }}>
                    {report[4]}
                  </Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  paddingHorizontal:10,
                  marginTop: 0,
                  flexDirection: 'row',

                }} >
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,

                      fontSize: 20,
                    }}>
                    Success Rate
                  </Text>
                  <Text

                    style={{
                      justifyContent: 'center',
                      width: '50%',
                      marginTop: 10,
                      marginBottom: 10,
                      marginLeft: 20,
                      color: 'green',
                      fontSize: 20,
                    }}>
                    {report[6]}
                  </Text>
                </View>
                </ScrollView>
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