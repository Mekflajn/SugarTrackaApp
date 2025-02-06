import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import colors from '../constants/colors';
import { LineChart } from 'react-native-chart-kit';

const PocetnaScreen = () => {
  const { uid } = useUser();
  const navigation = useNavigation();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      console.error("Korisnički UID nije dostupan.");
      return;
    }

    const fetchMeasurements = () => {
      try {
        const userDoc = doc(FIREBASE_DB, 'users', uid);
        const measurementsCollection = collection(userDoc, 'measurements');
        const q = query(measurementsCollection, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
            };
          });
          setMeasurements(items);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Greška pri povlačenju mjerenja iz baze:', error);
      }
    };

    const unsubscribe = fetchMeasurements();
    return () => unsubscribe && unsubscribe();
  }, [uid]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.pozadina }}>
        <Text style={styles.loadingText}>Učitavanje podataka...</Text>
      </View>
    );
  }

  const chartData = {
    labels: measurements
      .slice(0, 10)
      .reverse()
      .map((_, index) => `M${index + 1}`),
    datasets: [
      {
        data: measurements
          .slice(0, 10)
          .reverse()
          .map((item) => {
            const glucoseValue = parseFloat(item.glucose);
            return !isNaN(glucoseValue) ? glucoseValue : 0;
          }),
      },
    ],
  };

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screen}>
        <Card style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>UNESITE VRIJEDNOST</Text>
            <Text style={styles.subText}>
              Unesite podatke o glukozi, pulsu, i pritisku za praćenje vašeg zdravlja.
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('UNOS')}
            >
              <Text style={styles.editButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.card2}>
          {measurements.length === 0 ? (
            <Text style={styles.text}>TRENUTNO NEMATE NITI JEDNO MJERENJE.</Text>
          ) : (
            <>
              <Text style={styles.text}>PRIKAZ MJERENJA GRAFIKONOM U mmol/l</Text>
              <LineChart
                data={chartData}
                width={260}
                height={200}
                yAxisSuffix=" mmol/L"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#f5f5f5',
                  backgroundGradientTo: '#e0e0e0',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 10 },
                  propsForLabels: { fontSize: 10 },
                  yAxisLabelWidth: 50,
                }}
                bezier
                style={{
                  alignSelf: 'center',
                  marginVertical: 10,
                  borderRadius: 10,
                }}
              />
            </>
          )}
        </View>

        <View style={styles.card1}>
          {measurements.length === 0 ? (
            <Text style={styles.text}>TRENUTNO NEMATE NITI JEDNO MJERENJE.</Text>
          ) : (
            <>
              <Text style={[styles.text, { textAlign: 'center', width: '100%', marginBottom: 10 }]}>
                LISTA ZADNJIH 5 MJERENJA
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                style={styles.measurementsScrollView}
              >
              <Image
                source={require('../assets/up.png')}
                style={styles.scrollIcon}
              />
                {measurements.slice(0, 5).map((item) => (
                  <Card key={item.id} style={styles.measurementCard}>
                    <View style={styles.cardContent}>
                      <View style={styles.measurementHeader}>
                        <Text style={styles.dateText}>
                          {item.timestamp.toDate().toLocaleDateString('sr-Latn-RS', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </Text>
                        <Text style={styles.timeText}>
                          {item.timestamp.toDate().toLocaleTimeString('sr-Latn-RS', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      
                      <View style={styles.measurementDetails}>
                        <Text style={styles.measurementText}>Glukoza: {item.glucose} mmol/L</Text>
                        <Text style={styles.measurementText}>Puls: {item.pulse} o/min</Text>
                        <Text style={styles.measurementText}>
                          Pritisak: {item.systolicPressure}/{item.diastolicPressure} mmHg
                        </Text>
                        {item.notes && (
                          <Text style={styles.notesText}>Bilješke: {item.notes}</Text>
                        )}
                      </View>
                    </View>
                  </Card>
                ))}
                  <Image
                source={require('../assets/down.png')}
                style={styles.scrollIcon}
              />
              </ScrollView>

            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.pozadina,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 120,
    backgroundColor: colors.pozadina,
  },
  screen: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  card1: {
    width: '90%',
    minHeight: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 50,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  card2: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    backgroundColor: 'white',
    height: 300,
    alignSelf: 'center',
    borderRadius: 10,
    shadowRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollableContainer: {
    height: '100%',
    paddingVertical: 10,
  },
  verticalListContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  measurementCard: {
    width: '90%',
    marginVertical: 6,
    alignSelf: 'center',
    backgroundColor: colors.pozadina,
    borderRadius: 8,
    padding: 12,
  },
  cardContent: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: 40,
    alignSelf: 'center',
  },

  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
  scrollIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginVertical: 5,
    tintColor: colors.primary,
  },
  measurementsScrollView: {
    width: '100%',
    maxHeight: 200,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  measurementDetails: {
    width: '100%',
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.primary,
  },
  measurementText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
  notesText: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default PocetnaScreen;
