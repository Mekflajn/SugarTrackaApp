import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { FIREBASE_DB } from "../config/FirebaseConfig";
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import colors from "../constants/colors";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TableteScreen = () => {
    const [nazivTablete, setNazivTablete] = useState('');
    const [tablete, setTablete] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const userId = getAuth().currentUser?.uid;

    const timeOrder = ["Jutro", "Podne", "Veče"];

    useEffect(() => {
        if (userId) {
            const fetchTablete = async () => {
                try {
                    const medicinsRef = collection(FIREBASE_DB, "users", userId, "medicines");
                    const querySnapshot = await getDocs(medicinsRef);
                    const tableteData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    tableteData.sort((a, b) => b.timestamp - a.timestamp);

                    tableteData.forEach(tablet => {
                        if (Array.isArray(tablet.times)) {
                            tablet.times.sort((a, b) => timeOrder.indexOf(a) - timeOrder.indexOf(b));
                        }
                    });

                    setTablete(tableteData);
                } catch (error) {
                    console.error("Greška pri preuzimanju lijekova:", error);
                }
            };

            fetchTablete();
        }
    }, [userId]);

    const toggleTime = (time) => {
        setSelectedTimes((prevSelectedTimes) => {
            if (prevSelectedTimes.includes(time)) {
                return prevSelectedTimes.filter((item) => item !== time);
            } else {
                return [...prevSelectedTimes, time];
            }
        });
    };

    const addTablet = async () => {
        if (nazivTablete.trim() && selectedTimes.length > 0 && userId) {
            try {
                const medicinsRef = collection(FIREBASE_DB, "users", userId, "medicines");
                await addDoc(medicinsRef, {
                    naziv: nazivTablete,
                    timestamp: new Date(),
                    times: selectedTimes,
                });
                setNazivTablete('');
                setSelectedTimes([]);
                const querySnapshot = await getDocs(medicinsRef);
                const tableteData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                tableteData.sort((a, b) => b.timestamp - a.timestamp);
                tableteData.forEach(tablet => {
                    if (Array.isArray(tablet.times)) {
                        tablet.times.sort((a, b) => timeOrder.indexOf(a) - timeOrder.indexOf(b));
                    }
                });
                setTablete(tableteData);
            } catch (error) {
                console.error("Greška pri dodavanju tablete:", error);
            }
        }
    };

    const deleteTablet = async (tabletId) => {
        if (!tabletId) {
            console.error("Greška: ID tablete nije definisan.");
            return;
        }
        try {
            const tabletDocRef = doc(FIREBASE_DB, "users", userId, "medicines", tabletId);
            await deleteDoc(tabletDocRef);
            const medicinsRef = collection(FIREBASE_DB, "users", userId, "medicines");
            const querySnapshot = await getDocs(medicinsRef);
            const tableteData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            tableteData.sort((a, b) => b.timestamp - a.timestamp);
            tableteData.forEach(tablet => {
                if (Array.isArray(tablet.times)) {
                    tablet.times.sort((a, b) => timeOrder.indexOf(a) - timeOrder.indexOf(b));
                }
            });
            setTablete(tableteData);
        } catch (error) {
            console.error("Greška pri brisanju tablete:", error);
        }
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Unesite naziv lijeka</Text>
            <TextInput
                style={styles.input}
                placeholder="Naziv lijeka"
                value={nazivTablete}
                onChangeText={setNazivTablete}
            />
            <View style={styles.timeButtons}>
                {["Jutro", "Podne", "Veče"].map((time) => (
                    <TouchableOpacity
                        key={time}
                        style={[styles.timeButton, selectedTimes.includes(time) && styles.selectedButton]}
                        onPress={() => toggleTime(time)}
                    >
                        <Text style={styles.timeButtonText}>{time}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addTablet}>
                <Text style={styles.addButtonText}>Dodaj Lijek</Text>
            </TouchableOpacity>
            <FlatList
                data={tablete || []}
                renderItem={({ item }) => (
                    <Card style={styles.item}>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardText}>{item.naziv}</Text>
                            <Text style={styles.cardText}>
                                {item.times && Array.isArray(item.times) ? item.times.join(', ') : 'Nema vremena'}
                            </Text>
                            <TouchableOpacity onPress={() => deleteTablet(item.id)}>
                                <FontAwesomeIcon icon={faTrash} size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </Card>
                )}
                keyExtractor={(item) => item.id || Math.random().toString()}
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
        color: '#000',
        fontWeight: 'bold',
    },
    addButton: {
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        fontWeight: 'bold',
        color: '#fff'
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
    timeText: {
        textAlign: 'center',
    },
});

export default TableteScreen;
