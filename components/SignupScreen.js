import React, { useState } from 'react';

import { TextInput, Button } from 'react-native-paper';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import firebase from "../firebase";
import { Text } from 'react-native';

import { View } from "react-native";

export default function SignupScreen({ navigation, route }) {

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    const SignUp = (email, pwd) => {
        if(pwd === confirmPwd) {
            var params = {};

            if(route != undefined){
                params = {data : route.params.data};
                console.log(params);
                
            }

            firebase.auth().createUserWithEmailAndPassword(email, pwd)
            .then( res => {
                //navigation.navigate("OrderCompleted") 
                params.data['email'] = email;
                const pushAction = StackActions.replace('OrderCompleted', params);
                navigation.dispatch(pushAction);
            })
            .catch( err =>  
                alert(err.message)
            );
        }
        else{
            alert("Password Mismatch");
        }
    }

    return (
        <View style={{left: 0, right: 0, top: '50%'}}>

            <TextInput label="Email" value={ email } onChangeText={ setEmail } />
            <TextInput label="Password" value={ pwd } onChangeText={ setPwd } secureTextEntry />
            <TextInput label="Confirm Password" value={ confirmPwd } onChangeText={ setConfirmPwd } secureTextEntry />

            <Button onPress={ () => SignUp(email, pwd) }>Sign up</Button>
            <Button onPress={ () => navigation.navigate('LoginScreen') }>Login</Button>

        </View>
    )
}