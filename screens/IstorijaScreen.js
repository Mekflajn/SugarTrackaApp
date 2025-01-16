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
    return <Text style={styles.loadingText}>Učitavanje podataka...</Text>;
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
                  <Text>Vrijednost glukoze: {item.glucose}</Text>
                  <Text>Puls: {item.pulse}</Text>
                  <Text>Pritisak: {item.systolicPressure}/{item.diastolicPressure}</Text>
                  <Text>Bilješke: {item.notes}</Text>
                  <Text>
                    Vrijeme: {item.timestamp ? new Intl.DateTimeFormat('sr-RS', { 
                      dateStyle: 'short', 
                      timeStyle: 'short', 
                      hour12: false 
                    }).format(item.timestamp.toDate()) : "N/A"}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconContainer}>
                  <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                </TouchableOpacity>
              </View>
            </Card>
          )}
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
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
});

export default IstorijaScreen;
