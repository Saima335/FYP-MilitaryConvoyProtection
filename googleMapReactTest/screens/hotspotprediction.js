import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion, Polygon, Circle } from 'react-native-maps';

const HotSpotScreen = ({ navigation }) => {

  const markers = [{
    latlng: {
      latitude: 33.6844,
      longitude: 73.0479,
    }, title: "Pakistan", description: "Hotspot Area for Attacks"
  },
  {
    latlng: {
      latitude: 24.8607,
      longitude: 67.0011,
    }, title: "Another in Pakistan", description: "Another Hotspot Area for Attacks"
  }];
  const mapRef = useRef(null);
  const edgePaddingValue = 70;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };
  const query = "Islamabad";
  const [coordinate, setCoordinate] = React.useState([]);
  const [type, setType] = React.useState("");
  let mainarr = [];
  const getPolygonFromApi = () => {
    return fetch(`https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&format=json`)
      .then(response => response.json())
      .then(json => {
        for (var i = 0; i < json.length; i++) {
          if (json[i].geojson.type == "Polygon") {
            json[i].geojson.coordinates[0].map(coor => {
              let mydata = { longitude: coor[0], latitude: coor[1] };
              mainarr.push(mydata);
            });
            break;
          }
          else if (json[i].geojson.type == "MultiPolygon") {
            json[i].geojson.coordinates[0][0].map(coor => {
              let mydata = { longitude: coor[0], latitude: coor[1] };
              mainarr.push(mydata);
            });
            break;
          }
        }
        setCoordinate(mainarr);
        console.log(Math.floor(coordinate.length/2));
        // let filterGeoJsonType = json.filter(function (data) {
        //   if (data.geojson.type === "MultiPolygon") {
        //     console.log("Coordinates Multipolygon: ", data.geojson.coordinates[0][0]);
        //     let position = 0;
        //     data.geojson.coordinates[0][0].map(coor => {
        //       if(position %10 === 0){
        //         mainarr.push({longitude: coor[0], latitude: coor[1]});
        //       }
        //       position++;
        //     });
        //     console.log("Main Array Multipolygon", mainarr);
        //     setCoordinate(mainarr);
        //   } else if (data.geojson.type === "Polygon") {
        //     console.log("Coordinates Polygon: ", data.geojson.coordinates[0]);
        //     data.geojson.coordinates[0].map(coor => {
        //           let mydata={longitude: coor[0], latitude: coor[1]};
        //           mainarr.push(mydata);
        //     });
        //     // let position = 0;
        //     // data.geojson.coordinates[0].map(coor => {
        //     //   if(position %10 === 0){
        //     //     let mydata={longitude: coor[0], latitude: coor[1]};
        //     //     mainarr=[...mainarr,mydata]
        //     //     if (position!==0){
        //     //       mainarr.push(mydata);
        //     //     }
        //     //   }
        //     //   position++;
        //     // });
        //     console.log("Main Array Polygon", mainarr);
        //     setCoordinate(mainarr);
        //   }
        //   return data.geojson.type === "MultiPolygon" || data.geojson.type === "Polygon"
        // });
        // console.log(filterGeoJsonType);
        // setType(filterGeoJsonType);

      })
      .catch(error => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    getPolygonFromApi();
  }, [])
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
        >
          {mapRef.current?.fitToCoordinates([coordinate[0],coordinate[Math.floor(coordinate.length/2)]], { edgePadding })}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description} />
          ))}
          <Circle
            center={{ latitude: 33.6844, longitude: 73.0479 }}
            radius={1000}
            strokeColor="black"
            strokeWidth={2}
            fillColor="#4F6D7A"
          />
          {coordinate.length ? (
            <Polygon
              coordinates={coordinate}
              fillColor="rgba(0, 200, 0, 0.5)"
              strokeColor="rgba(0,0,0,0.5)"
              strokeWidth={2}
            />) : <View></View>}
        </MapView>
        {/* <View style={styles.ButtonArea}>
            <TouchableOpacity style={styles.Button} onPress={() => this._goToMyPosition()}>
              <Text style={styles.ButtonText}>Show HotSpot Areas</Text>
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

export default HotSpotScreen;