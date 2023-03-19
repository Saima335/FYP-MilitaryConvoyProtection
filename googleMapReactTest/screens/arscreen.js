import React, { useState } from "react";

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
    PermissionsAndroid,
} from 'react-native';
import AppTab from '../navigation/appTab';
import { NavigationContainer } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

import {useCameraDevices, Camera} from 'react-native-vision-camera';


const ArScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = React.useState(false);

    const devices = useCameraDevices();
    const device = devices.back;
    const isFocused = useIsFocused();

    React.useEffect(() => {
        checkCameraPermission();
      }, []);
    
     const checkCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: "App Camera Permission",
                message:
                  "App needs access to your camera " +
                  "so you can locate terrorists.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const status = await Camera.getCameraPermissionStatus();
                setHasPermission(status === 'authorized');
            } else {
              console.log("Camera permission denied");
            }
          } catch (err) {
            console.warn(err);
          }
     };

     function renderCamera() {
        if (device == null) {
          return (
            <View>
              <Text style={{ color: 'black' }}>Loading</Text>
            </View>
          )
        }
        else {
          return (
            <View style={{ flex: 1 }}>
              {device != null &&
                hasPermission && isFocused && (
                  <>
                    <Camera
                      style={StyleSheet.absoluteFill}
                      device={device}
                      isActive={true}
                    />
                  </>
                )}
            </View>
          )
        }
    
    
      }
    
    return (
        <View style={{ flex: 1 }}>
            {renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    tinyLogo: {
        justifyContent: 'center',
        height: 200,
        width: 300,
        margin: 40,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    topBar: {
        height: 50,
        backgroundColor: '#62d1bc', // green
        alignItems: 'center',
        justifyContent: 'center',
      },
      topBarTitleText: {
        color: '#ffffffff', // white   
        fontSize: 20,
      },
      caption: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
      },
      captionTitleText: {
        color: '#121B0D', // black
        fontSize: 16,
        fontWeight: '600',
      },
      rnCamera: {
        flex: 1,
        width: '94%',
        alignSelf: 'center',
      },
});

export default ArScreen;