import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Button,
    Image,
} from 'react-native';

const AnalysisScreen = ({ navigation }) => {
    return (

        <View style={{ backgroundColor: 'black', height: 1000, alignItems:'center' }}>
            
            <View style={{ flexDirection: 'row', marginTop:250}}>
                <Image
                    style={{ width: 70, height: 70 }}
                    source={{
                        uri: 'https://www.crushpixel.com/static16/preview2/event-manager-chalk-white-icon-2323264.jpg',
                    }}
                />
                <TouchableOpacity style={{ backgroundColor: 'green', width: 250 }} onPress={() => navigation.navigate("Analysis Area Report")}>
                    <Text style={{ marginLeft: 50, backgroundColor: 'green', color: 'white', fontSize: 15, fontWeight: 'bold', margin: 20 }}>
                        RISK AREA ANALYSIS
                    </Text>
                </TouchableOpacity>

            </View>

            <View style={{ flexDirection: 'row', marginTop:50}}>
                <Image
                    style={{ width: 70, height: 70 }}
                    source={{
                        uri: 'https://png.pngtree.com/png-vector/20190330/ourlarge/pngtree-vector-route-icon-png-image_894735.jpg',
                    }}
                />
                <TouchableOpacity style={{ backgroundColor: 'green', width: 250 }} onPress={() => navigation.navigate('User Input')}>
                    <Text style={{ marginLeft: 50, backgroundColor: 'green', color: 'white', fontSize: 15, fontWeight: 'bold', margin: 20, }}>
                        SAFE PATH

                    </Text>
                </TouchableOpacity>

            </View>

            

        </View>


    );
}

const styles = StyleSheet.create({

});






export default AnalysisScreen;