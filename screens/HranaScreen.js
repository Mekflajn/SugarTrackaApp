import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { FIREBASE_DB } from "../config/FirebaseConfig";
import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import colors from "../constants/colors";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faClock, faUtensils } from "@fortawesome/free-solid-svg-icons";

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
            <View style={styles.inputSection}>
                <Text style={styles.title}>Dodaj novi obrok</Text>
                <View style={styles.inputContainer}>
                    <FontAwesomeIcon 
                        icon={faUtensils} 
                        size={20} 
                        color={colors.primary} 
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Naziv obroka"
                        value={nazivHrane}
                        onChangeText={setNazivHrane}
                        placeholderTextColor="#999"
                    />
                </View>
                
                <View style={styles.timeButtons}>
                    {["Doručak", "Ručak", "Večera", "Užina"].map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeButton, 
                                selectedTime === time && styles.selectedButton
                            ]}
                            onPress={() => setSelectedTime(time)}
                        >
                            <FontAwesomeIcon 
                                icon={faClock} 
                                size={14} 
                                color={selectedTime === time ? 'white' : colors.primary} 
                                style={styles.timeIcon}
                            />
                            <Text style={[
                                styles.timeButtonText, 
                                selectedTime === time && styles.selectedTimeText
                            ]}>{time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={addHrana}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonText}>Dodaj obrok</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listSection}>
                <Text style={styles.listTitle}>Lista obroka</Text>
                <FlatList
                    data={hrana}
                    renderItem={({ item }) => (
                        <Card style={styles.foodCard}>
                            <View style={styles.foodContent}>
                                <View style={styles.foodNameContainer}>
                                    <FontAwesomeIcon 
                                        icon={faUtensils} 
                                        size={18} 
                                        color={colors.primary} 
                                        style={styles.foodIcon}
                                    />
                                    <Text style={styles.foodName}>{item.naziv}</Text>
                                </View>
                                
                                <View style={styles.timeContainer}>
                                    <View style={styles.timeTag}>
                                        <Text style={styles.timeTagText}>{item.time}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => deleteHrana(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <FontAwesomeIcon icon={faTrash} size={16} color="red" />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    )}
                    keyExtractor={(item) => item.id}
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
        paddingBottom: 110,
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
        flexWrap: 'wrap',
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
        marginBottom: 8,
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
    foodCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    foodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    foodNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.4,
    },
    foodIcon: {
        marginRight: 8,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    timeContainer: {
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

export default HranaScreen;