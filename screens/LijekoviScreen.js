import React from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Card from "../components/Card";
import colors from "../constants/colors";

const LijekoviScreen = () => {
    return(
        <View style={styles.screen}>
            <TouchableWithoutFeedback>
                <Card style={styles.card}>
                    <Text style={styles.text}>TABLETE</Text>
                </Card>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback>
                <Card style={styles.card}>
                    <Text style={styles.text}>PODSJETNICI</Text>
                </Card>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
                <Card style={styles.card}>
                    <Text style={styles.text}>UPOZORENJA</Text>
                </Card>
            </TouchableWithoutFeedback>
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