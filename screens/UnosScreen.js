import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";
import Icon from 'react-native-vector-icons/Ionicons';

//TODO: NAPRAVITI MENU DA NE SKACE IZNAD TASTATURE PRILIKOM UNOSA

const UnosScreen = () => {
    const navigation = useNavigation();

    const [glukoza, setGlukoza] = useState('');
    const [gornjiPritisak, setGornjiPritisak] = useState('');
    const [donjiPritisak, setDonjiPritisak] = useState('');
    const [puls, setPuls] = useState('');
    const [biljeske, setBiljeske] = useState('');

    // Funkcija za čuvanje podataka u Firestore
    const saveData = async () => {
        try {
            const data = {
                glukoza,
                gornjiPritisak,
                donjiPritisak,
                puls,
                biljeske,
                timestamp: firestore.FieldValue.serverTimestamp(), // Za praćenje kada su podaci uneseni
            };

            // Sačuvaj podatke u Firestore-u
            await firestore().collection('podaci').add(data);
            navigation.goBack();
        } catch (error) {
            console.error("Greška pri čuvanju podataka: ", error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={80}
                    style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={styles.screen}>
                            {/* Unos glukoze */}
                            <View style={styles.polja}>
                                <Text style={styles.text}>VRIJEDNOST GLUKOZE</Text>
                                <View style={styles.inputContainer}>
                                    <Icon name="analytics-outline" size={24} color="#8D8D8D" style={styles.icon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Unesite vrijednost glukoze" 
                                        keyboardType="numeric"
                                        value={glukoza}
                                        onChangeText={setGlukoza}
                                    />
                                </View>
                            </View>

                            {/* Unos pritiska */}
                            <View style={styles.polja}>
                                <Text style={styles.text}>PRITISAK</Text>
                                <View style={styles.inputContainer}>
                                    <Icon name="heart-outline" size={24} color="#8D8D8D" style={styles.icon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Unesite vrijednost gornjeg pritiska" 
                                        keyboardType="numeric"
                                        value={gornjiPritisak}
                                        onChangeText={setGornjiPritisak}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Icon name="heart-outline" size={24} color="#8D8D8D" style={styles.icon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Unesite vrijednost donjeg pritiska" 
                                        keyboardType="numeric"
                                        value={donjiPritisak}
                                        onChangeText={setDonjiPritisak}
                                    />
                                </View>
                            </View>

                            {/* Unos pulsa */}
                            <View style={styles.polja}>
                                <Text style={styles.text}>PULS</Text>
                                <View style={styles.inputContainer}>
                                    <Icon name="pulse-outline" size={24} color="#8D8D8D" style={styles.icon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Unesite vrijednost pulsa" 
                                        keyboardType="numeric"
                                        value={puls}
                                        onChangeText={setPuls}
                                    />
                                </View>
                            </View>

                            {/* Dodatne bilješke */}
                            <View style={styles.polja}>
                                <Text style={styles.text}>DODATNE BILJEŠKE</Text>
                                <View style={styles.inputContainer}>
                                    <Icon name="document-text-outline" size={24} color="#8D8D8D" style={styles.icon} />
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder="Unesite dodatne bilješke ukoliko imate" 
                                        multiline={true}
                                        value={biljeske}
                                        onChangeText={setBiljeske}
                                    />
                                </View>
                            </View>

                            {/* Potvrda */}
                            <View style={styles.button}>
                                <TouchableOpacity style={styles.button} onPress={saveData}>
                                    <Text style={styles.editButtonText}>POTVRDI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,  // omogućava pomjeranje sadržaja prema gore
        padding: 10,
    },
    screen: {
        minHeight: '100%',
        flex: 1,
        width: '100%',
        padding: 10,
        alignItems: 'center',
        backgroundColor: colors.pozadina,
    },
    polja: {
        marginBottom: 15,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: colors.linija,
        marginBottom: 10
    },
    text: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10,
        color: '#333',
    },
    icon: {
        marginRight: 5,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        marginVertical: 20,
        paddingHorizontal: 20,
        width: '70%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default UnosScreen;
