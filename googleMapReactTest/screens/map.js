import React, { useRef, useState, useEffect } from "react";
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    Image,
    TextInput,
    useColorScheme,
    View,
    Button,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Animated
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion, Overlay } from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';
import Video from 'react-native-video';

const MainScreen = ({ navigation, route }) => {
    const [marker, setMarker] = useState({});
    const [curr, setCurr] = useState({});
    const [coordinate, setCoordinate] = useState({});
    var call = 0;
    const markers = [{
        latlng: {
            latitude: 30.3753,
            longitude: 69.3451,
        }, title: "Pakistan", description: "Marker Showed"
    },
    {
        latlng: {
            latitude: 29.3735,
            longitude: 68.3451,
        }, title: "Another in Pakistan", description: "Marker Showed again"
    }];

    // const sourceCoordinates = {
    //     latitude: Math.round(JSON.parse(route.params.sourceCoordinates).lat * 10000) / 10000,
    //     longitude: Math.round(JSON.parse(route.params.sourceCoordinates).lng * 10000) / 10000,
    // };
    const destinationCoordinates = {
        latitude: Math.round(JSON.parse(route.params.destinationCoordinates).lat * 10000) / 10000,
        longitude: Math.round(JSON.parse(route.params.destinationCoordinates).lng * 10000) / 10000,
    };
    const destination = (Math.round(JSON.parse(route.params.destinationCoordinates).lat * 10000) / 10000) + "," + (Math.round(JSON.parse(route.params.destinationCoordinates).lng * 10000) / 10000);

    const placebetween = {
        latitude: 31.75069, longitude: 73.98471
    }

    const [coordinates] = useState([
        {
            latitude: 33.6844,
            longitude: 73.0479,
        },
        {
            latitude: 31.5204,
            longitude: 74.3587,
        },
    ]);

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
    }

    async function requestPermissions() {
        try {
            if (Platform.OS === 'ios') {
                try {
                    const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
                    if (permissionStatus === 'granted') {
                        console.log('accessed location');
                    }
                    else {
                        console.log('location permission denied');
                    }
                }
                catch (error) {
                    console.warn(err);
                }
            }
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('accessed location');
                Geolocation.getCurrentPosition(
                    (position) => {
                        const cords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        if (call == 0) {
                            const source = cords.latitude + "," + cords.longitude;
                            getRoutesFromApiAsync(source, destination);
                        }
                        call++;
                        animate(cords.latitude, cords.longitude);
                        setCurr(cords);
                        setCoordinate(new AnimatedRegion({
                            latitude: cords.latitude,
                            longitude: cords.longitude,
                            latitudeDelta: 0.0214,
                            longitudeDelta: 0.0567,
                        }))
                    },
                    (error) => {
                        console.log(error);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );

            } else {
                console.log('location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

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

    React.useEffect(() => {
        setCoordinate(new AnimatedRegion({
            latitude: 33.6844,
            longitude: 73.0479,
            latitudeDelta: 0.0214,
            longitudeDelta: 0.0567,
        }))
        requestPermissions();
        // const interval=setInterval(()=>{
        //     requestPermissions();
        // },6000);
        // return ()=>clearInterval(interval)
    }, []);

    // React.useEffect(() => {
    //     setMarker(placebetween);
    //     Geocoder.from("Islamabad")
    //         .then(json => {
    //             var location = json.results[0].geometry.location;
    //             console.log("Islamabad Geocoder: ",location);
    //         })
    //         .catch(error => console.warn(error));

    //     Geocoder.from( 33.6844202, 73.04788479999999)
    //         .then(json => {
    //             var addressComponent = json.results[0].address_components[1].long_name;
    //             console.log("latLng Geocoder",addressComponent);
    //         })
    //         .catch(error => console.warn(error));
    // }, []);
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

    const getRoutesFromApiAsync = async (source, destination) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&key=${API_KEY}&sensor=false&alternatives=true`,
            );
            const json = await response.json();
            console.log(json);
            setRoutes(json.routes);
            console.log("No of Routes: ", json.routes.length);
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
                    console.log("Marker", mrk);
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
            for (var z=0;z<areasall.length;z++) {
                for (var y=0;y<areasall[z].length;y++) {
                    const response = await Geocoder.from(areasall[z][y][0], areasall[z][y][1]);
                    var addressComponent = response.results[0].address_components[1]?.long_name;
                    if (addressComponent) {
                        console.log("latLng Geocoder", addressComponent);
                        areasall[z][y] = addressComponent;
                    }
                }
            }
            // areasall=[['Islamabad', 'Islamabad', 'H-9', 'شاہراہ کشمیر،', 'Islamabad', 'Shaheenabad', 'Shaheenabad', 'Band Road', 'Gulfishan Colony', 'Lahore', 'Multan Road', 'Chauburji Chowk', 'Saadi Park', 'Saadi Park', 'Mozang Chungi', 'Jubilee Town', 'MRC', 'Main Gulberg', 'Main Gulberg', 'Block K', 'Mushtaq Ahmed Gurmani Road', 'Gurumangat Road'],['Islamabad', 'Islamabad', 'G-9/4', 'Service Road East G 9', 'Service Road East G 9', 'G 8/2', '4/C', 'G 8/1', 'فیصل ایونیو', 'G-7/1', 'Islamabad', 'Kallar Syedan Road', 'Bhalot Link Road', 'Jhelum Cantt', 'Grand Trunk Road', 'National Highway 5', 'National Highway 5', 'Kala Shah Kaku', 'Balkhay', 'Lakhodher', 'Cantt', 'GCQG 8JW', 'Aziz Bhatti Road', 'Cantt', 'Cantt', 'Sarwar Colony', 'CMA Colony',
            // 'Millat Colony', 'Gurumangat Road']];
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

    React.useEffect(() => {
        getRoutesFromApiAsync();
    }, [])
    return (
        <View>
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
                {/* <Overlay
                    image="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
                    bounds={[
                        [40.712216, -74.22655],
                        [40.773941, -74.12544]
                    ]}
                /> */}
                <Marker.Animated coordinate={coordinate} ref={markerRef} />
                <Marker coordinate={destinationCoordinates} />
                {mapRef.current?.fitToCoordinates([curr, destinationCoordinates], { edgePadding })}
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
                {/* <MapViewDirections
                    origin={sourceCoordinates}
                    destination={placebetween}
                    apikey={"AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk"} // insert your API Key here
                    strokeWidth={4}
                    strokeColor="#111111"
                    onReady={result => {
                        console.log(result);
                        mapRef.current?.fitToCoordinates([sourceCoordinates, destinationCoordinates], { edgePadding });
                    }}
                />
                <MapViewDirections
                    origin={placebetween}
                    destination={destinationCoordinates}
                    apikey={"AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk"} // insert your API Key here
                    strokeWidth={4}
                    strokeColor="red"
                    onReady={result => {
                        console.log(result);
                        mapRef.current?.fitToCoordinates([sourceCoordinates, destinationCoordinates], { edgePadding });
                    }}
                />
                <Marker.Animated coordinate={coordinate} ref={markerRef}/>
                <Marker coordinate={sourceCoordinates} />
                <Marker coordinate={destinationCoordinates} />
                <Marker coordinate={marker} title={"lat: " + marker.latitude + "\nlng: " + marker.longitude}>
                    <View style={{}}>
                        <Text style={{color:'blue', fontWeight:"bold"}}>
                            {"lat: " + marker.latitude + "\nlng: " + marker.longitude}
                        </Text>
                    </View> 
                </Marker> */}
                {/* {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker.latlng}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
                <Polyline
                    coordinates={[
                        { latitude: 30.3753, longitude: 69.3451 },
                        { latitude: 69.3451, longitude: 45.567 },
                        { latitude: 30.3353, longitude: 39.3251 },
                        { latitude: 30.3453, longitude: 39.3751 },
                        { latitude: 30.3653, longitude: 39.3791 },
                        { latitude: 30.3653, longitude: 39.3591 }
                    ]}
                    strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                    strokeColors={[
                        '#7F0000',
                        '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                        '#B24112',
                        '#E5845C',
                        '#238C23',
                        '#7F0000'
                    ]}
                    strokeWidth={6}
                /> */}
            </MapView>
            <View style={{ flexDirection: "row", position: 'absolute', bottom: 50, }}>
                {risk.map(r => (<Text style={{ color: "black" }}>{r + "     "}</Text>))}
            </View>
            <Video
                source={require('./persondrone.mp4')}
                shouldPlay={true}
                resizeMode="cover"
                style={{ position: 'absolute', width: 250, height: 200 }}
                isMuted={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        minHeight: '100%',
    }
});

export default MainScreen;