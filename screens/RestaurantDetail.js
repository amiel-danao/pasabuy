import React from "react";
import { View, Text } from "react-native";
import { Divider } from "react-native-elements";
import About from "../components/restaurantDetail/About";
import MenuItems from "../components/restaurantDetail/MenuItems";
import ViewCart from "../components/restaurantDetail/ViewCart";

const foods = [
  {
    title: "nova",
    price: "₱13.50",
    image:
      "https://www.homeshop.ph/image/cache/catalog/Products/Snacks/Chips/Nova-Cheddar-Chips-78g-500x500-product_popup.png",
  },
  {
    title: "piattos",
    price: "₱19.20",
    image:
      "https://cdn.shopify.com/s/files/1/0338/0694/2253/products/Jackn_JillPiattosChips-Cheese3oz_front_2048x.jpg?v=1634669897",
  },
  {
    title: "C2",
    price: "₱15.00",
    image:
      "http://cdn.shopify.com/s/files/1/0060/6067/1058/products/C2-Apple-500mL_1200x1200.jpg?v=1622013232",
  },
  {
    title: "Nature's Spring",
    price: "₱21.50",
    image:
      "http://cdn.shopify.com/s/files/1/0358/1335/9748/products/Untitleddesign-2021-02-23T171915.996_1024x.png?v=1614071976",
  },
  {
    title: "Lasagna",
    price: "₱13.50",
    image:
      "https://thestayathomechef.com/wp-content/uploads/2017/08/Most-Amazing-Lasagna-2-e1574792735811.jpg",
  },
];

export default function RestaurantDetail({ route, navigation }) {
  return (
    <View>
      <About route={route} />
      <Divider width={1.8} style={{ marginVertical: 20 }} />
      <MenuItems restaurantName={route.params.name} foods={foods} />
      <ViewCart navigation={navigation} />
    </View>
  );
}
