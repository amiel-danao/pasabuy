import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import firebase from "../firebase";
import MenuItems from "../components/restaurantDetail/MenuItems";
import { incrementPendingOrders } from '../components/restaurantDetail/ViewCart'
import { useIsFocused } from '@react-navigation/native';
import {getFirestore, getDoc, doc, setDoc, increment } from "firebase/firestore";

export default function OrderCompleted({ navigation, route }) {

  const isFocused = useIsFocused();

  React.useEffect(()=>{
  if(isFocused){
    console.log("Yeeeeha");
    // callback
    if(route != undefined){
      
      if(route.params != undefined){
        console.log(route.params.data);
        const db = firebase.firestore();

        db.collection("orders")
          .add(route.params.data)
          .then(() => {
            incrementPendingOrders(1);
            console.log("saved order from ");
          });
      }
    }
  }
  },[isFocused])


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

  const [lastOrder, setLastOrder] = useState({
    items: [
      {
        title: "Bologna",
        description: "With butter lettuce, tomato and sauce bechamel",
        price: "₱13.50",
        image:
          "https://www.modernhoney.com/wp-content/uploads/2019/08/Classic-Lasagna-14-scaled.jpg",
      },
    ],
  });

  const { items, restaurantName } = useSelector(
    (state) => state.cartReducer.selectedItems
  );

  const total = items
    .map((item) => Number(item.price.replace("₱", "")))
    .reduce((prev, curr) => prev + curr, 0);

  const totalUSD = total.toLocaleString("en", {
    style: "currency",
    currency: "PHP",
  });

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          setLastOrder(doc.data());
        });
      });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* green checkmark */}
      <View
        style={{
          margin: 15,
          alignItems: "center",
          height: "100%",
        }}
      >
        <LottieView
          style={{ height: 100, alignSelf: "center", marginBottom: 30 }}
          source={require("../assets/animations/check-mark.json")}
          autoPlay
          speed={0.5}
          loop={false}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Your order at {restaurantName} has been placed for {totalUSD}
        </Text>
        <ScrollView>
          <MenuItems
            foods={lastOrder.items}
            hideCheckbox={true}
            marginLeft={10}
          />
          <LottieView
            style={{ height: 200, alignSelf: "center" }}
            source={require("../assets/animations/cooking.json")}
            autoPlay
            speed={0.5}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
