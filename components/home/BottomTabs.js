import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import auth from '@react-native-firebase/auth';
import firebase from "../../firebase";

export default function BottomTabs() {

  return (
    <View
      style={{
        flexDirection: "row",
        margin: 10,
        marginHorizontal: 30,
        justifyContent: "space-between",
      }}
    >
      <Icon icon="home" text="Home" />
      <Icon icon="search" text="Browse" />
      <Icon icon="shopping-bag" text="Grocery" />
      <Icon icon="receipt" text="Orders" />
      
      <TouchableOpacity onPress={() => {
        firebase.auth()
        .signOut()
        .then(() => console.log('User signed out!'))
      }}>
        <View>
          <FontAwesome5
            name="user"
            size={25}
            style={{
              marginBottom: 3,
              alignSelf: "center",
            }}
          />
          <Text>Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const Icon = (props) => (
  <TouchableOpacity>
    <View>
      <FontAwesome5
        name={props.icon}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",
        }}
      />
      <Text>{props.text}</Text>
    </View>
  </TouchableOpacity>
);
