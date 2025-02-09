import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { FIREBASE_DB } from "../config/FirebaseConfig";
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import colors from "../constants/colors";
import Card from "../components/Card";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faClock, faPills } from "@fortawesome/free-solid-svg-icons";

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

        if (nazivTablete.trim() === '' && selectedTimes.length === 0) {
            Alert.alert("Obavještenje", "Unesite naziv tablete i odaberite vrijeme za uzimanje tablete.");
            return;
        }
        if (selectedTimes.length === 0) {
            Alert.alert("Obavještenje", "Odaberite vrijeme za uzimanje tablete.");
            return;
        }
        if (nazivTablete.trim() === '') {
            Alert.alert("Obavještenje", "Unesite naziv tablete.");
            return;
        }

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
            <View style={styles.inputSection}>
                <Text style={styles.title}>Dodaj novi lijek</Text>
                <View style={styles.inputContainer}>
                    <FontAwesomeIcon 
                        icon={faPills} 
                        size={20} 
                        color={colors.primary} 
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Naziv lijeka"
                        value={nazivTablete}
                        onChangeText={setNazivTablete}
                        placeholderTextColor="#999"
                    />
                </View>
                
                <View style={styles.timeButtons}>
                    {["Jutro", "Podne", "Veče"].map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeButton, 
                                selectedTimes.includes(time) && styles.selectedButton
                            ]}
                            onPress={() => toggleTime(time)}
                        >
                            <FontAwesomeIcon 
                                icon={faClock} 
                                size={14} 
                                color={selectedTimes.includes(time) ? 'white' : colors.primary} 
                                style={styles.timeIcon}
                            />
                            <Text style={[
                                styles.timeButtonText, 
                                selectedTimes.includes(time) && styles.selectedTimeText
                            ]}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={addTablet}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonText}>Dodaj lijek</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listSection}>
                <Text style={styles.listTitle}>Lista lijekova</Text>
                <FlatList
                    data={tablete || []}
                    renderItem={({ item }) => (
                        <Card style={styles.medicineCard}>
                            <View style={styles.medicineContent}>
                                <View style={styles.medicineNameContainer}>
                                    <FontAwesomeIcon 
                                        icon={faPills} 
                                        size={18} 
                                        color={colors.primary} 
                                        style={styles.medicineIcon}
                                    />
                                    <Text style={styles.medicineName}>{item.naziv}</Text>
                                </View>
                                
                                <View style={styles.timesContainer}>
                                    {item.times && item.times.map((time, index) => (
                                        <View key={index} style={styles.timeTag}>
                                            <Text style={styles.timeTagText}>{time}</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity 
                                    onPress={() => deleteTablet(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <FontAwesomeIcon icon={faTrash} size={16} color="red" />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    )}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.pozadina,
        padding: 15,
        paddingBottom: 100,
    },
    inputSection: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    inputIcon: {
        marginRight: 10,
    },
    timeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    timeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    selectedButton: {
        backgroundColor: colors.primary,
    },
    timeIcon: {
        marginRight: 5,
    },
    timeButtonText: {
        color: colors.primary,
        fontWeight: '500',
        fontSize: 14,
    },
    selectedTimeText: {
        color: 'white',
    },
    addButton: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listSection: {
        flex: 1,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
        alignSelf: 'center',
    },
    medicineCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    medicineContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    medicineNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.4,
    },
    medicineIcon: {
        marginRight: 8,
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    timesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.5,
        justifyContent: 'center',
    },
    timeTag: {
        backgroundColor: colors.primary + '15',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginRight: 4,
    },
    timeTagText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '500',
    },
    deleteButton: {
        padding: 8,
        flex: 0.1,
        alignItems: 'flex-end',
    },
});

export default TableteScreen;
