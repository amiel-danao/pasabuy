import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import OrderItem from "./OrderItem";
import firebase from "../../firebase";
import LottieView from "lottie-react-native";
import { NavigationContainer, StackActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
//import { getDoc, doc, updateDoc, increment } from "@react-native-firebase/firestore";
import firestore from 'firebase/firestore';


export default function ViewCart({ navigation}) {
  

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { items, restaurantName } = useSelector(
    (state) => state.cartReducer.selectedItems
  );

  const total = items
    .map((item) => Number(item.price.replace("₱", "")))
    .reduce((prev, curr) => prev + curr, 0);

  const totalPHP = total.toLocaleString("en", {
    style: "currency",
    currency: "PHP",
  });

  const [newData, setData] = useState({});
  
  const addOrderToFireBase = () => {
    setLoading(true);

    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
    
    db.collection("orders")
      .add(newData)
      .then(() => {

        incrementPendingOrders(1);

        setTimeout(() => {
          setLoading(false);
          navigation.navigate("OrderCompleted");
        }, 2500);
      });
  };

  function incrementPendingOrders(increase){
    console.log("start increment");
    var db = firebase.firestore();
    // const ref = firebase.firestore().doc(db, "settings", "counters");
    
    var docRef = db.collection("settings").doc("counters");
    
    //const docRef = firebase.firestore().doc(db, "settings","counters");

    // docRef.update({
    //   pendingOrders: pendingOrdersCount + increase
    // });

    //var docRef = db.collection("settings").doc("counters");

    docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          let pendingOrdersCount = 0;
          if("pendingOrders" in doc.data()){
            pendingOrdersCount = doc.data()["pendingOrders"];
          }
          
          docRef.update({
            pendingOrders: pendingOrdersCount + increase
          });
    
          console.log("incremented pendingOrders");
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
  }

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.7)",
    },

    modalCheckoutContainer: {
      backgroundColor: "white",
      padding: 16,
      height: 500,
      borderWidth: 1,
    },

    restaurantName: {
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      marginBottom: 10,
    },

    subtotalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
    },

    subtotalText: {
      textAlign: "left",
      fontWeight: "600",
      fontSize: 15,
      marginBottom: 10,
    },
  });

  const checkoutModalContent = () => {
    return (
      <>
        <View style={styles.modalContainer}>
          <View style={styles.modalCheckoutContainer}>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            {items.map((item, index) => (
              <OrderItem key={index} item={item} />
            ))}
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>Subtotal</Text>
              <Text>{totalPHP}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                style={{
                  marginTop: 50,
                  backgroundColor: "black",
                  alignItems: "center",
                  padding: 13,
                  borderRadius: 30,
                  width: 300,
                  position: "relative",
                }}
                onPress={() => {

                  let thisData = {
                    items: items,
                    restaurantName: restaurantName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    state:0
                  };

                  if(firebase.auth().currentUser != null){
                    thisData['email'] = firebase.auth().currentUser.email;
                  }

                  setModalVisible(false);
                  setData(thisData);



                  if(firebase.auth().currentUser == null){                    

                    //navigation.navigate("LoginScreen", {data:newData});
                    const pushAction = StackActions.push('LoginScreen', {data:thisData});
                    navigation.dispatch(pushAction);
                  }
                  else{
                    addOrderToFireBase();                    
                  }

                  
                }}
              >
                <Text style={{ color: "white", fontSize: 20 }}>Checkout</Text>
                <Text
                  style={{
                    position: "absolute",
                    right: 20,
                    color: "white",
                    fontSize: 15,
                    top: 17,
                  }}
                >
                  {total ? totalPHP : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
      </>
    );
  };

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {checkoutModalContent()}
      </Modal>
      {total ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            position: "absolute",
            //bottom: 130,
            flex: 1,
            justifyContent: 'flex-end',

            zIndex: 999,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "black",
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 15,
                borderRadius: 30,
                width: 300,
                position: "relative",
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "white", fontSize: 20, marginRight: 30 }}>
                View Cart
              </Text>
              <Text style={{ color: "white", fontSize: 20 }}>{totalPHP}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
      {loading ? (
        <View
          style={{
            backgroundColor: "black",
            position: "absolute",
            opacity: 0.6,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <LottieView
            style={{ height: 200 }}
            source={require("../../assets/animations/scanner.json")}
            autoPlay
            speed={3}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
}
