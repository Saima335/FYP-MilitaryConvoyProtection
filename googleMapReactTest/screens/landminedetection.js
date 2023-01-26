import React ,{useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion } from 'react-native-maps';

const LandmineScreen = ({ navigation }) => {

  const markers = [{
    latlng: {
      latitude: 33.6844,
      longitude: 73.0479,
    }, title: "Pakistan", description: "Ladmine Found"
  },
  {
    latlng: {
      latitude: 24.8607,
      longitude: 67.0011,
    }, title: "Another in Pakistan", description: "Another Landmine Found"
  }];

  const mapRef = useRef(null);
  const edgePaddingValue = 70;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

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
        >
          {mapRef.current?.fitToCoordinates([markers[0].latlng, markers[1].latlng], { edgePadding })}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description} />
          ))}
        </MapView>
        {/* <View style={styles.ButtonArea}>
            <TouchableOpacity style={styles.Button} onPress={() => this._goToMyPosition(44.7866, 20.4489)}>
              <Text style={styles.ButtonText}>Show Landmine Areas</Text>
            </TouchableOpacity>
          </View> */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    minHeight: '100%',
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
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  Button: {
    width: 200,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'green',
    alignItems: 'center'
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default LandmineScreen;