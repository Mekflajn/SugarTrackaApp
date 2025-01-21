import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "../components/Card";
import colors from "../constants/colors";

const LijekoviScreen = () => {
    const navigation = useNavigation();
    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return(
        <View style={styles.screen}>
            <TouchableOpacity style={styles.touchable} onPress={() => navigateToScreen("TABLETE")}>
                <Card style={[styles.card, styles.cardShadow]}>
                    <Text style={styles.text}>TABLETE</Text>
                </Card>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.touchable} onPress={() => navigateToScreen("PODSJETNICI")}>
                <Card style={[styles.card, styles.cardShadow]}>
                    <Text style={styles.text}>PODSJETNICI</Text>
                </Card>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.pozadina,
    },
    touchable: {
        width: '80%',  // Postavi istu širinu za oba TouchableOpacity
        marginBottom: 30,
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 15,
        backgroundColor: colors.cardBackground,
    },
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
});

export default LijekoviScreen;
