import React, { useState } from 'react';

import { TextInput , Button} from 'react-native-paper';
//import { Container, Content, Form, Input, Label, Item } from 'native-base';
import auth from '@react-native-firebase/auth';
import firebase from "../firebase";
import { Text } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { SafeAir } from 'react-safe-area-component';
import {SafeAreaView, View, ScrollView, StyleSheet } from "react-native";

export default function LoginScreen ({ navigation, route }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const Login = (email, password) => {

        var params = {};

        if(route != undefined){
            params = {data : route.params.data};
            console.log(params);            
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then( res => {
            params.data['email'] = email;
            const pushAction = StackActions.replace('OrderCompleted', params);
            navigation.dispatch(pushAction);
        })
        .catch( err => alert(err.message));
    }


    return (
        <View style={{left: 0, right: 0, top: '50%'}}>
            <TextInput label="Email" value={ email } onChangeText={ setEmail } style={{width:'100%'}}/>
                <TextInput label="Password" value={ password } onChangeText={ setPassword } secureTextEntry />

                <Button onPress={ () => Login(email, password) } >Login</Button>
                <Button onPress={ () => {
                        var params = {};

                        if(route != undefined){
                            params = {data : route.params.data};
                            console.log(params);            
                        }
                        const pushAction = StackActions.replace('SignupScreen', params);
                        navigation.dispatch(pushAction);
                    }
                    } >SignUp</Button>
                </View>

    )
}