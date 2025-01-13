import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../constants/colors";

const Header = ({ title, style, showBackButton }) => {
  const navigation = useNavigation();

  return (
    <View style={{ ...styles.header, ...style }}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="black" />
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
    paddingTop: 30
  },
});

export default Header;
