import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { collection, doc, query, getDocs, orderBy, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import colors from '../constants/colors';

const IstorijaScreen = () => {
  const { uid } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      console.error("Korisnički UID nije dostupan.");
      return;
    }

    console.log('UID:', uid);
    const fetchMeasurements = () => {
      try {
        const userDoc = doc(FIREBASE_DB, 'users', uid);
        const measurementsCollection = collection(userDoc, 'measurements');
        const q = query(measurementsCollection, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Firestore dokument:", data);
            return {
              id: doc.id,
              ...data,
            };
          });
          setData(items);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Greška pri povlačenju merenja:', error);
      }
    };

    const unsubscribe = fetchMeasurements();
    return () => unsubscribe && unsubscribe();
  }, [uid]);

  const handleDelete = async (id) => {
    try {
      const userDoc = doc(FIREBASE_DB, 'users', uid);
      const measurementDoc = doc(userDoc, 'measurements', id);

      await deleteDoc(measurementDoc);
      Alert.alert('Obaveštenje', 'Uspešno obrisano.');
    } catch (error) {
      console.error('Greška pri brisanju merenja:', error);
    }
  };

  if (loading) {
    return <View style={{backgroundColor: colors.pozadina}}><Text style={styles.loadingText}>Učitavanje podataka...</Text></View>;
  }

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <Text style={styles.noDataText}>Nema sačuvanih mjerenja.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.textContent}>
                  <Text style={styles.glucoseText}>Vrijednost glukoze: {item.glucose} mmol/L</Text>
                  <Text style={styles.pulseText}>Puls: {item.pulse} BPM</Text>
                  <Text style={styles.pressureText}>Pritisak: {item.systolicPressure}/{item.diastolicPressure} mmHg</Text>
                  <Text style={styles.notesText}>Bilješke: {item.notes || 'Nema bilješki'}</Text>
                  <Text style={styles.timestampText}>
                  Vrijeme: {item.timestamp ? (() => {
                      const date = item.timestamp.toDate();
                      const day = String(date.getDate()).padStart(2, '0');  // Dvocifreni dan
                      const month = String(date.getMonth() + 1).padStart(2, '0');  // Dvocifreni mesec
                      const year = date.getFullYear();
                      const hours = String(date.getHours()).padStart(2, '0');  // Dvocifreni sat
                      const minutes = String(date.getMinutes()).padStart(2, '0');  // Dvocifreni minut
                      return `${day}/${month}/${year} ${hours}:${minutes}`;
                    })() : "N/A"}
                </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconContainer}>
                  <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                </TouchableOpacity>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.pozadina,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  glucoseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  pulseText: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 5,
  },
  pressureText: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  timestampText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  iconContainer: {
    marginLeft: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    color: '#777',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    color: '#777',
  },
  flatListContent: {
    paddingBottom: 120, // Dodano padding ispod FlatList-a
},
});

export default IstorijaScreen;
