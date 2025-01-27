import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";

const Header = ({ title, style, showBackButton }) => {
  const navigation = useNavigation();

  return (
    <View style={{ ...styles.header, ...style }}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          {/* Koristi sliku umesto ikone */}
          <Image 
            source={require("../assets/arrowBack.png")}  // putanja do tvoje slike
            style={styles.backIcon}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    height: 100,
    paddingTop: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: colors.linija,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 23,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
    paddingTop: 30,
  },
  backIcon: {
    width: 30,   // dimenzije slike
    height: 30,
    resizeMode: "contain", // osiguraj da slika bude pravilno prilagođena
    tintColor: 'black'
  }
});

export default Header;
