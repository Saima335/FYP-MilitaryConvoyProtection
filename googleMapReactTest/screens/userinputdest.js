import React, { useEffect, useState } from "react";
import Geocoder from 'react-native-geocoding';

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
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const UserInputDest = ({ navigation }) => {
    const [destination, setDestination] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState("");
    var check = false;
    var places = ['islamabad', 'lahore', 'karachi', 'gawadar', 'multan', 'quetta', 'gawadar', 'pano akil', 'kakul', 'murree', 'sialkot'];
    const checkTextInput = () => {
        // console.log(sourceCoordinates);
        if (destinationCoordinates !== "") {
            navigation.navigate('Traveling', { screen: 'map', params: { destinationCoordinates: destinationCoordinates } });
        }
        else {
            alert('Please Enter Valid Field Values');
        }
        // if (!source.trim() || !destination.trim()) {
        //     alert('Please Enter Field values first');

        // }
        // else {
        //     navigation.navigate('Map',{sourceCoordinates:sourceCoordinates, destinationCoordinates:destinationCoordinates});
        //     // places.map(place => { if (source == place || destination == place) check = true; })
        //     // if (check == true) {
        //     //     navigation.navigate('Map',{sourceCoordinates:sourceCoordinates, destinationCoordinates:destinationCoordinates});
        //     // }
        //     // else {
        //     //     alert('Please Enter Valid Source And Destination');
        //     // }

        // }
    }
    return (
        <View style={{ height: 1000, backgroundColor: 'black', }}>
            
            <View style={{
                justifyContent: 'center',

                marginTop: 200,
                marginHorizontal: 30,
                height: 100,
            }} >
                <Text

                    style={{
                        justifyContent: 'center',

                        marginTop: 10,
                        color: 'green',
                        marginBottom: 10,
                        marginLeft: 10,
                        fontSize: 20,
                    }}>
                    Enter Your Destination:
                </Text>
                <GooglePlacesAutocomplete
                    GooglePlacesDetailsQuery={{ fields: "geometry" }}
                    placeholder='Enter your Destination'
                    minLength={4}
                    autoFocus={true}
                    listViewDisplayed="auto"
                    returnKeyType={'search'}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        // console.log("data", data);
                        // console.log("details", details);
                        // console.log(JSON.stringify(details?.geometry?.location));
                        setDestinationCoordinates(JSON.stringify(details?.geometry?.location));
                    }}
                    onFail={(error) => console.error(error)}
                    query={{
                        key: 'AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk',
                        language: 'en',
                    }}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    debounce={200}
                    renderRow={(rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address = rowData.structured_formatting.secondary_text;
                        return (
                            <View>
                                <Text style={{ fontSize: 14, color: 'black' }}>{title}</Text>
                                <Text style={{ fontSize: 14, color: 'black' }}>{address}</Text>
                            </View>
                        );
                    }}
                    styles={styles}>
                </GooglePlacesAutocomplete>

                {/* <GooglePlacesAutocomplete
                    GooglePlacesDetailsQuery={{ fields: "geometry" }}
                    fetchDetails={true} // you need this to fetch the details object onPress
                    placeholder="Enter your Destination"
                    query={{
                        key: "AIzaSyAoJNvyfx5Gtg5v4B-NAD8bcLUbXScHxwk",
                        language: "en", // language of the results
                    }}
                    onPress={(data, details = null) => {
                        console.log("data", data);
                        console.log("details", details);
                        console.log(JSON.stringify(details?.geometry?.location));
                        setDestinationCoordinates(JSON.stringify(details?.geometry?.location));
                    }}
                    onFail={(error) => console.error(error)} /> */}
                {/* <TextInput
                    style={styles.input}
                    onChangeText={setDestination}
                    value={destination}
                    placeholder="Please Enter Your Destination"
                /> */}
            </View>
            <View style={{
                justifyContent: 'center',

                marginTop: 60,
                marginLeft: 100,
                width: 200,
            }}>
                <TouchableOpacity
                    onPress={checkTextInput}
                    style={{
                        backgroundColor: 'green',
                        width: 200,
                        height: 50,
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ textAlign: "center", margin: 12, fontWeight: "bold", }}>START TRAVELING</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textInputContainer: {
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        zIndex: 10,
        width: '100%',
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 45,
        color: 'black',
        fontSize: 16,
        borderWidth: 1,
        zIndex: 10,
    },
    predefinedPlacesDescription: {
        color: 'black',
    },
    listView: {
        top: 45.5,
        zIndex: 100,
        position: 'absolute',
        color: 'black',
        width: '99%',
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'black',
    },
    description: {
        flexDirection: "row",
        flexWrap: "wrap",
        fontSize: 14,
        maxWidth: '89%',
        color: 'black'
    },
    //   row: {
    //     height: "100%",
    //    },

});

export default UserInputDest;