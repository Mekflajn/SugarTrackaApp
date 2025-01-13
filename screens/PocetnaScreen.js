import React, {useState} from "react";
import { View, Text, StyleSheet, Button, Modal, StatusBar, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import Card from "../components/Card";
import colors from "../constants/colors";
import UnosScreen from "./UnosScreen";



const PocetnaScreen = props =>{
    const { user } = useUser();
    console.log(user);
    const navigation = useNavigation();

    return(
        <View style={styles.screen}>
            <Card style={styles.card}>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>UNESITE VRIJEDNOST</Text>
                        <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('UNOS')}>
                            <Text style={styles.editButtonText}>+</Text>
                        </TouchableOpacity>
                </View>
            </Card>

            <Card style={styles.card}>
                <View><Text style={styles.text}>GRAFIKON</Text></View>
            </Card>

            <Card style={styles.card}>
                <View><Text style={styles.text}>LISTA ZADNJA 3 MJERENJA</Text></View>
                <View>
                    <Text>1. MJERENJE</Text>
                    <Text>2. MJERENJE</Text>
                    <Text>3. MJERENJE</Text>
                </View>
            </Card>
            {user ? <Text>Dobrodošao, {user.name}</Text> : <Text>Učitavanje...</Text>}

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
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
      },
    editButton: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        height: 40
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }

});

export default PocetnaScreen;