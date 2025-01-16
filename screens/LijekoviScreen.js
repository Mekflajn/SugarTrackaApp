import React from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "../components/Card";
import colors from "../constants/colors";

const LijekoviScreen = () => {
    const navigation = useNavigation();
    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName); // Navigacija do ekrana za tablete
    };


    return(
        <View style={styles.screen}>
            <TouchableOpacity onPress={() => navigateToScreen("TABLETE")}>
                <Card style={styles.card}>
                    <Text style={styles.text}>TABLETE</Text>
                </Card>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigateToScreen("PODSJETNICI")}>
                <Card style={styles.card}>
                    <Text style={styles.text}>PODSJETNICI</Text>
                </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateToScreen("UPOZORENJA")}>
                <Card style={styles.card}>
                    <Text style={styles.text}>UPOZORENJA</Text>
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

export default LijekoviScreen;