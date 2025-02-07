import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { FIREBASE_DB } from "../config/FirebaseConfig";
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import colors from "../constants/colors";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const HranaScreen = () => {
    const [nazivHrane, setNazivHrane] = useState('');
    const [hrana, setHrana] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const userId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (userId) {
            const fetchHrana = async () => {
                try {
                    const foodRef = collection(FIREBASE_DB, "users", userId, "food");
                    const querySnapshot = await getDocs(foodRef);
                    const hranaData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    hranaData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

                    setHrana(hranaData);
                } catch (error) {
                    console.error("Greška pri preuzimanju obroka:", error);
                }
            };

            fetchHrana();
        }
    }, [userId]);

    const addHrana = async () => {
        if (nazivHrane.trim() && selectedTime && userId) {
            try {
                const foodRef = collection(FIREBASE_DB, "users", userId, "food");
                await addDoc(foodRef, {
                    naziv: nazivHrane,
                    timestamp: new Date(),
                    time: selectedTime,
                });
                setNazivHrane('');
                setSelectedTime(null);

                const querySnapshot = await getDocs(foodRef);
                const hranaData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                hranaData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

                setHrana(hranaData);
            } catch (error) {
                console.error("Greška pri dodavanju obroka:", error);
            }
        }
    };

    const deleteHrana = async (hranaId) => {
        if (!hranaId) {
            console.error("Greška: ID obroka nije definisan.");
            return;
        }
        try {
            const foodDocRef = doc(FIREBASE_DB, "users", userId, "food", hranaId);
            await deleteDoc(foodDocRef);
            const foodRef = collection(FIREBASE_DB, "users", userId, "food");
            const querySnapshot = await getDocs(foodRef);
            const hranaData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            hranaData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

            setHrana(hranaData);
        } catch (error) {
            console.error("Greška pri brisanju obroka:", error);
        }
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Unesite naziv obroka</Text>
            <TextInput
                style={styles.input}
                placeholder="Naziv obroka"
                value={nazivHrane}
                onChangeText={setNazivHrane}
            />
            <View style={styles.timeButtonsContainer}>
                <View style={styles.timeButtons}>
                    {["Doručak", "Ručak", "Večera", "Užina"].map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
                            onPress={() => setSelectedTime(time)}
                        >
                            <Text style={styles.timeButtonText}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.addButton} onPress={addHrana}>
                    <Text style={styles.addButtonText}>Dodaj obrok</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={hrana}
                renderItem={({ item }) => (
                    <Card style={styles.item}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardText}>{item.naziv}</Text>
                            <Text style={styles.cardText}>{item.time}</Text>
                            <TouchableOpacity onPress={() => deleteHrana(item.id)}>
                                <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </Card>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.pozadina,
        paddingBottom: 110,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 5,
        marginBottom: 20,
    },
    timeButtonsContainer: {
        marginBottom: 20,
    },
    timeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: colors.primary,
    },
    timeButtonText: {
        fontSize: 13,
        color: '#000',
        fontWeight: 'bold',
    },
    addButton: {
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 20,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    item: {
        flex: 1,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        flex: 1,
        textAlign: 'center',
    },
});

export default HranaScreen;