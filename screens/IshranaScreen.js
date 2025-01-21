import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "../components/Card";
import colors from "../constants/colors";

const IshranaScreen = () => {
        const navigation = useNavigation();
        const navigateToScreen = (screenName) => {
            navigation.navigate(screenName);
        };

    return(
        <View style={styles.screen}>
            <TouchableOpacity onPress={() => navigateToScreen("HRANA")}>
                <Card style={styles.card}>
                    <Text style={styles.text}>HRANA</Text>
                </Card>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigateToScreen("EDUKACIJA")}>
                <Card style={styles.card}>
                    <Text style={styles.text}>EDUKATIVNI MATERIJAL</Text>
                </Card>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
        padding: 10,
        alignItems: 'center',
        backgroundColor: colors.pozadina
    },
    card: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
      },
});

export default IshranaScreen;