import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
        const userDoc = doc(FIREBASE_DB, 'users', uid); // Pristup korisnikovim podacima
        const measurementsCollection = collection(userDoc, 'measurements');
        const q = query(measurementsCollection, orderBy('timestamp', 'desc')); // Sortiraj po vremenu unosa (najnovije prvo)

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
        console.error('Greška pri povlačenju merenja:', error);
      }
    };

    const unsubscribe = fetchMeasurements();
    return () => unsubscribe && unsubscribe();
  }, [uid]);

  if (loading) {
    return <View style={{flex: 1, backgroundColor: colors.pozadina}}><Text style={styles.loadingText}>Učitavanje podataka...</Text></View>;
  }

  // Formatiranje podataka za grafikon
  const chartData = {
    labels: measurements.reverse().map((_, index) => `M${index + 1}`), // Oznake za x-osa
    datasets: [
      {
        data: measurements.map((item) => {
          const glucoseValue = parseFloat(item.glucose);
          return !isNaN(glucoseValue) ? glucoseValue : 0;
        }),
      },
    ],
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.screen}>
        <Card style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>UNESITE VRIJEDNOST</Text>
            <Text style={styles.subText}>Unesite podatke o glukozi, pulsu, i pritisku za praćenje vašeg zdravlja.</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('UNOS')}
            >
              <Text style={styles.editButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Grafikon */}
        <Card style={styles.card}>
          {measurements.length === 0 ? (
            <Text style={styles.text}>TRENUTNO NEMATE NITI JEDNO MJERENJE.</Text>
          ) : (
            <>
              <Text style={styles.text}>PRIKAZ MJERENJA GRAFIKOM U mmol/l</Text>
              <LineChart
                data={chartData}
                width={260} // Širina grafikona
                height={200} // Visina grafikona
                yAxisSuffix=" mmol/L" // Sufiks za Y osu
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#f5f5f5',
                  backgroundGradientTo: '#e0e0e0',
                  decimalPlaces: 1, // Zaokruživanje na 1 decimalu
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Boja linije
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Boja oznaka
                  style: {
                    borderRadius: 10,
                  },
                  propsForLabels: {
                    fontSize: 10, // Veličina fonta za oznake
                  },
                  yAxisLabelWidth: 50, // Širina oznake za y-osa
                }}
                bezier // Zakrivljene linije
                style={{
                  marginVertical: 10,
                  borderRadius: 10,
                }}
              />
            </>
          )}
        </Card>

        <Card style={styles.card}>
          {measurements.length === 0 ? (
            <Text>TRENUTNO NEMATE NITI JEDNO MJERENJE.</Text>
          ) : (
            <>
              <Text style={styles.text}>LISTA ZADNJIH 5 MJERENJA</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                snapToInterval={260}
                decelerationRate="fast"
              >
                {measurements
                  .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate()) // Sortiraj po vremenu unosa (najnovije prvo)
                  .slice(0, 5)
                  .map((item) => (
                    <Card key={item.id} style={styles.measurementCard}>
                      <View style={styles.cardContent}>
                        <Text>Glukoza: {item.glucose}</Text>
                        <Text>Puls: {item.pulse}</Text>
                        <Text>Pritisak: {item.systolicPressure}/{item.diastolicPressure}</Text>
                        <Text>Bilješke: {item.notes}</Text>
                        <Text>
                          Vrijeme: {item.timestamp ? new Intl.DateTimeFormat('sr-RS', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                            hour12: false,
                          }).format(item.timestamp.toDate()) : "N/A"}
                        </Text>
                      </View>
                    </Card>
                  ))}
              </ScrollView>
            </>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.pozadina,
    paddingBottom: 110,
  },
  screen: {
    flex: 1,
    width: '100%',
    padding: 10,
    paddingBottom: 120,
    alignItems: 'center',
    backgroundColor: colors.pozadina,
  },
  card: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  measurementCard: {
    width: 250,
    marginRight: 10,
    padding: 10,
    backgroundColor: colors.pozadina,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
  },
});

export default PocetnaScreen;
