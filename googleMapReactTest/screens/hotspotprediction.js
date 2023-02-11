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
import Geocoder from 'react-native-geocoding';

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
  // Geocoder.init("AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk");
  const mapRef = useRef(null);
  const edgePaddingValue = 70;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };
  const [coordinate, setCoordinate] = React.useState([]);
  const [type, setType] = React.useState("");
  let mainarr = [];
  let allcoordinates=[];
  const getPolygonFromApi = (query, index) => {
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
        allcoordinates[index]=mainarr;
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

  const getHotspotFromApiAsync = async (areas) => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/hotspotkmean/',
      );
      const objperson = await JSON.parse(JSON.stringify(response));
      var result=JSON.parse(objperson.headers.map.result);
      console.log(result);
      // result[0][0]=33.6844202;
      // result[0][1]=73.04788479999999;
      // //const len=result.length;
      // var addressComponent=["Islamabad","Quetta","Mardan"];
      // for (var i = 0; i < result.length; i++) {
      //   // const response=await Geocoder.from(result[i][0], result[i][1]);
      //   // var addressComponent = response.results[0].address_components[1]?.long_name;
      //   // if (addressComponent){
      //   //   console.log("latLng Geocoder",i,"    ",addressComponent);
      //   //   getPolygonFromApi(addressComponent, i);
      //   // }
      //   console.log("latLng Geocoder",i,"    ",addressComponent[i]);
      //   getPolygonFromApi(addressComponent[i], i);
      // }
      // console.log(allcoordinates);
      // setCoordinate(allcoordinates);   
      // console.log("coordinates: ",coordinate.length);
      setCoordinate(result);
      // console.log("coordinates: ",coordinate);

    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(()=> {
    // const response=await Geocoder.from(33.68394,73.04699);
    // var addressComponent = response.results[0].address_components[1]?.long_name;
    // if (addressComponent){
    //     console.log("latLng Geocoder: ",addressComponent);
    // }
    getHotspotFromApiAsync();
  },[])

  var createGeocodeCallback = function (n) {
    return function (error, json) {
      if (error) {
        console.log(error);
      } else {
        var addressComponent = json.results[0].address_components[1].long_name;
        console.log("latLng Geocoder",addressComponent);
        getPolygonFromApi(addressComponent);
      }
    };
  }

  // React.useEffect(() => {
  //   [1, 2, 3, 4, 5].every((v,i) =>{
  //     [1, 2, 3, 4, 5].every((v,j) =>{
  //       [1, 2].forEach((v,k) =>{
  //         Geocoder.from( 33.6844202, 73.04788479999999)
  //         .then(json => {
  //             var addressComponent = json.results[0].address_components[1].long_name;
  //             console.log("latLng Geocoder",addressComponent);
  //         })
  //         .catch(error => console.warn(error));
  //       })
  //       if(j==0){
  //         return false;
  //       }
  //     })

  //     if (i == 0) {
  //       return false;
  //     }
  //   });
  // }, [])
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
            latitudeDelta: 2.8214,
            longitudeDelta: 6.9567,
          }}
        >
          {/* {mapRef.current?.fitToCoordinates([coordinate[0][0], coordinate[Math.floor(coordinate.length)][Math.floor(coordinate.length / 2)]], { edgePadding })} */}
          {/* {markers.map((marker, index) => (
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
          /> */}

          {/* <Circle
            center={{ latitude: 33.6543503171031, longitude: 71.55881982351336 }}
            radius={1000}
            strokeColor="black"
            strokeWidth={2}
            fillColor="#4F6D7A"
          /> */}
          {/* {mapRef.current?.fitToCoordinates([coordinate[0][0], coordinate[0][1]], { edgePadding })} */}
          
          {coordinate.length?coordinate.map((coor, index) => (
          <Circle
            center={{ latitude: coor[0], longitude: coor[1] }}
            radius={10000}
            strokeColor="red"
            strokeWidth={2}
            fillColor="red"
          />
          )):(<View></View>)}
          {/* {coordinate.length?coordinate.map((coor, index) => (
            <Polygon
              key={index}
              coordinates={coor}
              fillColor="rgba(0, 200, 0, 0.5)"
              strokeColor="rgba(0,0,0,0.5)"
              strokeWidth={2}
            />
          )):(<View></View>)} */}
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