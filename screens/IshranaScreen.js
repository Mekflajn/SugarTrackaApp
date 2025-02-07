import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "../components/Card";
import colors from "../constants/colors";

const IshranaScreen = () => {
    const navigation = useNavigation();
    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Upravljanje ishranom</Text>
            <View style={styles.contentContainer}>
                <TouchableOpacity 
                    onPress={() => navigateToScreen("HRANA")} 
                    style={styles.dugme}
                    activeOpacity={0.7}
                >
                    <Card style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image 
                                source={require('../assets/food.png')} 
                                style={styles.icon}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>OMILJENI OBROCI</Text>
                                <Text style={styles.subText}>Pregledajte i upravljajte vašim omiljenim obrocima</Text>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigateToScreen("PREPORUCENI_OBROCI")} 
                    style={styles.dugme}
                    activeOpacity={0.7}
                >
                    <Card style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image 
                                source={require('../assets/recommend.png')} 
                                style={styles.icon}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>PREPORUČENI OBROCI</Text>
                                <Text style={styles.subText}>Otkrijte zdrave i uravnotežene obroke</Text>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    onPress={() => navigateToScreen("EDUKACIJA")} 
                    style={styles.dugme}
                    activeOpacity={0.7}
                >
                    <Card style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image 
                                source={require('../assets/education.png')} 
                                style={styles.icon}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>EDUKATIVNI MATERIJAL</Text>
                                <Text style={styles.subText}>Saznajte više o zdravoj ishrani</Text>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.pozadina,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 25,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginTop: -60,
        paddingBottom: 40,
    },
    dugme: {
        width: '100%',
        marginBottom: 20,
    },
    card: {
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    icon: {
        width: 45,
        height: 45,
        marginRight: 15,
        tintColor: colors.primary
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 5
    },
    subText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    }
});

export default IshranaScreen;