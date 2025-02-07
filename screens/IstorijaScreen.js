import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
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
        console.error('Greška pri povlačenju mjerenja:', error);
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
      Alert.alert('Obavještenje', 'Mjerenje uspješno obrisano.');
    } catch (error) {
      console.error('Greška pri brisanju mjerenja:', error);
    }
  };
  if (loading) {
    return <View style={{flex: 1, backgroundColor: colors.pozadina}}><Text style={styles.loadingText}>Učitavanje podataka...</Text></View>;
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
                <View style={styles.mainInfo}>
                  <Text style={styles.dateText}>
                    {item.timestamp ? (() => {
                      const date = item.timestamp.toDate();
                      const day = String(date.getDate()).padStart(2, '0');  
                      const month = String(date.getMonth() + 1).padStart(2, '0');  
                      const year = date.getFullYear();
                      const hours = String(date.getHours()).padStart(2, '0');  
                      const minutes = String(date.getMinutes()).padStart(2, '0');  
                      return `${day}.${month}.${year} - ${hours}:${minutes}`;
                    })() : "N/A"}
                  </Text>
                  
                  <Text style={styles.glucoseText}>
                    Glukoza: <Text style={[styles.valueText, styles.glucoseValue]}>{item.glucose} mmol/L</Text>
                  </Text>
                  
                  <Text style={styles.pressureText}>
                    Pritisak: <Text style={[styles.valueText, styles.pressureValue]}>{item.systolicPressure}/{item.diastolicPressure} mmHg</Text>
                  </Text>
                  
                  <Text style={styles.pulseText}>
                    Puls: <Text style={[styles.valueText, styles.pulseValue]}>{item.pulse} o/min</Text>
                  </Text>

                  {item.notes && (
                    <Text style={styles.notesText}>
                      Bilješke: <Text style={styles.notesValue}>{item.notes}</Text>
                    </Text>
                  )}
                </View>

                <TouchableOpacity 
                  onPress={() => handleDelete(item.id)} 
                  style={styles.deleteButton}
                >
                  <FontAwesomeIcon icon={faTrash} size={20} color="#FF0000" />
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
    paddingBottom: 110,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
    marginRight: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  glucoseText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
    fontWeight: '500',
  },
  pressureText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  pulseText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  valueText: {
    fontWeight: '600',
  },
  glucoseValue: {
    color: colors.primary,
    fontSize: 18,
  },
  pressureValue: {
    color: colors.primary,
  },
  pulseValue: {
    color: '#FF6B6B',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 6,
  },
  notesValue: {
    fontStyle: 'italic',
    color: '#444',
  },
  deleteButton: {
    padding: 8,
    alignSelf: 'center',
    marginLeft: 10,
  },
  flatListContent: {
    paddingBottom: 120,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    color: '#777',
  },
});

export default IstorijaScreen;
