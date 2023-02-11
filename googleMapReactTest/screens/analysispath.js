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
import MapViewDirections from 'react-native-maps-directions';

const AnalysisPath = ({ navigation, route }) => {
    const sourceCoordinates = {
        latitude: Math.round(JSON.parse(route.params.sourceCoordinates).lat * 10000) / 10000,
        longitude: Math.round(JSON.parse(route.params.sourceCoordinates).lng * 10000) / 10000,
    };
    const destinationCoordinates = {
        latitude: Math.round(JSON.parse(route.params.destinationCoordinates).lat * 10000) / 10000,
        longitude: Math.round(JSON.parse(route.params.destinationCoordinates).lng * 10000) / 10000,
    };
    const source = (Math.round(JSON.parse(route.params.sourceCoordinates).lat * 10000) / 10000) + "," + (Math.round(JSON.parse(route.params.sourceCoordinates).lng * 10000) / 10000);
    const destination = (Math.round(JSON.parse(route.params.destinationCoordinates).lat * 10000) / 10000) + "," + (Math.round(JSON.parse(route.params.destinationCoordinates).lng * 10000) / 10000);
    // const [coordinates] = useState([
    //     {
    //         latitude: 33.6844,
    //         longitude: 73.0479,
    //     },
    //     {
    //         latitude: 31.5204,
    //         longitude: 74.3587,
    //     },
    // ]);
    // const source = "33.6844,73.0479";
    // const destination = "31.5204,74.3587";
    Geocoder.init("AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk");
    const mapRef = useRef(null);
    const edgePaddingValue = 70;
    const edgePadding = {
        top: edgePaddingValue,
        right: edgePaddingValue,
        bottom: edgePaddingValue,
        left: edgePaddingValue,
    };
    const API_KEY = "AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk";
    const [routes, setRoutes] = useState({});
    const [riskpathcolor, setRiskpathcolor] = useState({});

    const getRandomColor = ["red", "gray", "yellow", "blue", "white", "green"];
    var riskpath = [];
    let multiDirectionPolygonArray = [];
    const [arr, setArr] = useState([]);
    const [risk, setRisk] = useState([]);

    const decode = encoded => {
        var points = [];
        var index = 0,
            len = encoded.length;
        var lat = 0,
            lng = 0;
        while (index < len) {
            var b,
                shift = 0,
                result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++).charCodeAt(0) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            points.push({ lat: lat / 1e5, lng: lng / 1e5 });
        }
        return points;
    };

    const getRiskPathFromApiAsync = async (areas) => {
        try {
            const response = await fetch(
                'http://localhost:8000/api/riskpath/?areas=' + areas,
            );
            const objperson = await JSON.parse(JSON.stringify(response));
            // console.log("Response in json: ",objperson);
            // console.log("Status: ",response.status);
            console.log("Result from api: ", objperson.headers.map.result);
            return Number(objperson.headers.map.result);
        } catch (error) {
            console.error(error);
        }
    };

    const getRoutesFromApiAsync = async () => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&key=${API_KEY}&sensor=false&alternatives=true`,
            );
            const json = await response.json();
            console.log(json);
            setRoutes(json.routes);
            json.routes &&
                json.routes.length &&
                json.routes.forEach((route, index) => {
                    multiDirectionPolygonArray[index] = [];
                    route.legs[0].steps.forEach((step, idx) => {
                        let polygonLatLng = decode(step.polyline.points);
                        multiDirectionPolygonArray[index][idx] = polygonLatLng;
                    });
                });
            multiDirectionPolygonArray.map((marker, index) => {
                marker.map(mrk => {
                    mrk.map(point => {
                        point['latitude'] = point['lat']
                        delete point['lat']
                        point['longitude'] = point['lng']
                        delete point['lng']
                    })
                })
            })
            console.log(".......", multiDirectionPolygonArray);
            var areasall=[];
            multiDirectionPolygonArray.forEach( (marker, index) => {
                var areas = [];
                var ai = 0;
                marker.forEach((mrk, i) => {
                    mrk.every((point, j) => {
                        areas[ai] = [point['latitude'], point['longitude']];
                        ai++;
                        // const response = await Geocoder.from(point['latitude'], point['longitude']);
                        // var addressComponent = response.results[0].address_components[1]?.long_name;
                        // if (addressComponent) {
                        //     console.log("latLng Geocoder", ai, "    ", addressComponent);
                        //     areas[ai] = addressComponent;
                        //     ai++;
                        // }
                        if (j == 0) {
                            return false;
                        }
                    });
                });
                console.log("Areas to pass: ", areas);
                areasall.push(areas);
            });
            // for (var z=0;z<areasall.length;z++) {
            //     for (var y=0;y<areasall[z].length;y++) {
            //         const response = await Geocoder.from(areasall[z][y][0], areasall[z][y][1]);
            //         var addressComponent = response.results[0].address_components[1]?.long_name;
            //         if (addressComponent) {
            //             console.log("latLng Geocoder", addressComponent);
            //             areasall[z][y] = addressComponent;
            //         }
            //     }
            // }
            areasall=[['Islamabad', 'Islamabad', 'H-9', 'شاہراہ کشمیر،', 'Islamabad', 'Shaheenabad', 'Shaheenabad', 'Band Road', 'Gulfishan Colony', 'Lahore', 'Multan Road', 'Chauburji Chowk', 'Saadi Park', 'Saadi Park', 'Mozang Chungi', 'Jubilee Town', 'MRC', 'Main Gulberg', 'Main Gulberg', 'Block K', 'Mushtaq Ahmed Gurmani Road', 'Gurumangat Road'],['Islamabad', 'Islamabad', 'G-9/4', 'Service Road East G 9', 'Service Road East G 9', 'G 8/2', '4/C', 'G 8/1', 'فیصل ایونیو', 'G-7/1', 'Islamabad', 'Kallar Syedan Road', 'Bhalot Link Road', 'Jhelum Cantt', 'Grand Trunk Road', 'National Highway 5', 'National Highway 5', 'Kala Shah Kaku', 'Balkhay', 'Lakhodher', 'Cantt', 'GCQG 8JW', 'Aziz Bhatti Road', 'Cantt', 'Cantt', 'Sarwar Colony', 'CMA Colony',
            'Millat Colony', 'Gurumangat Road']];
            for (var z=0;z<areasall.length;z++) {
                riskpath[z]=await getRiskPathFromApiAsync(JSON.stringify(areasall[z]));
            }
            setRisk(riskpath);
            var riskpath1 = [...riskpath].sort(function (a, b) { return a - b });
            console.log("Risk of the paths: ", riskpath[0], "     ", riskpath[1]);
            for (var k = 0; k < riskpath1.length; k++) {
                var index = riskpath.indexOf(riskpath1[k]);
                riskpath[index] = getRandomColor[k];
                if (k == riskpath1.length - 1) {
                    riskpath[index] = "green";
                }
            }
            console.log(riskpath);
            setRiskpathcolor(riskpath);
            setArr(multiDirectionPolygonArray);
            // getRandomColor[riskpath.indexOf(Math.max(...riskpath))] = "green";
            // getRandomColor[riskpath.indexOf(Math.min(...riskpath))] = "red";
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRoutesFromApiAsync();
    }, [])


    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.Container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: sourceCoordinates.latitude,
                        longitude: sourceCoordinates.longitude,
                        latitudeDelta: 0.0214,
                        longitudeDelta: 0.0567,
                    }}
                >
                    {mapRef.current?.fitToCoordinates([sourceCoordinates, destinationCoordinates], { edgePadding })}
                    <Marker coordinate={sourceCoordinates} >
                        
                        
                    </Marker>
                    <Marker coordinate={destinationCoordinates} />
                    {arr &&
                        arr.map((marker, index) =>
                            marker.map(mrk => (
                                <Polyline
                                    coordinates={mrk}
                                    strokeWidth={6}
                                    strokeColor={riskpathcolor[index]}
                                    geodesic={true}
                                    tappable={true}
                                    onPress={() => { (<View>{risk[index]}</View>) }}
                                // options={{
                                //     strokeColor: getRandomColor[index + 1],
                                //     strokeOpacity: 1,
                                //     strokeWeight: 4
                                // }}
                                />
                            ))
                        )}
                </MapView>
                <View style={{flexDirection:"row", position:'absolute', bottom: 50,}}>
                    {risk.map(r=>(<Text style={{color:"black"}}>{r+"     "}</Text>))}
                </View>
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
});

export default AnalysisPath;