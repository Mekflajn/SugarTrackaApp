import React from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import colors from "../constants/colors";

const AuthChoiceScreen = ({navigation}) => {
    return(
        <View style={styles.screen}>
            <Text style={styles.text}>DOBRO DOSLI ODABERITE OPCIJU MOLIM!</Text>

            <Button title="PRIJAVI SE"
            onPress={() => navigation.navigate('LOGIN')}/>

            <Button title="REGISTRUJ SE"
            onPress={() => navigation.navigate('REGISTER')}/>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.pozadina
    },text: {
        fontSize: 20,
        marginBottom: 20
    }
});

export default AuthChoiceScreen;