import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Header = ({ title, style, showBackButton }) => {
  const navigation = useNavigation();

  return (
    <View style={{ ...styles.header, ...style }}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}>
            <FontAwesomeIcon 
              icon={faChevronLeft} 
              size={24} 
              color="white"
            />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 75,
    paddingTop: 20,
    backgroundColor: colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: colors.linija,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 23,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: 10,
    height: "100%",
    justifyContent: "center",
    padding: 10,
    zIndex: 1,
  }
});

export default Header;
