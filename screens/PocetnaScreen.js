import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import colors from '../constants/colors';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faPills, faUtensils, faChartLine, faCalendar, faStethoscope, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

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

  const calculateDailyAverage = () => {
    if (measurements.length === 0) return "N/A";
    const today = new Date().setHours(0, 0, 0, 0);
    const todayMeasurements = measurements.filter(m => 
      m.timestamp.toDate().setHours(0, 0, 0, 0) === today
    );
    if (todayMeasurements.length === 0) return "N/A";
    const sum = todayMeasurements.reduce((acc, curr) => acc + parseFloat(curr.glucose), 0);
    return (sum / todayMeasurements.length).toFixed(1);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.pozadina, paddingBottom: 110}}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>
          {/* Statistika kartica */}
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Današnji prosjek</Text>
                <Text style={styles.statValue}>{calculateDailyAverage()} mmol/L</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Broj mjerenja</Text>
                <Text style={styles.statValue}>{measurements.length}</Text>
              </View>
            </View>
          </Card>

          {/* Brze akcije */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('UNOS')}
            >
              <FontAwesomeIcon icon={faPlus} size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Novo mjerenje</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('LIJEKOVI')}
            >
              <FontAwesomeIcon icon={faPills} size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Terapija</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ISHRANA')}
            >
              <FontAwesomeIcon icon={faUtensils} size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Ishrana</Text>
            </TouchableOpacity>
          </View>

          {/* Grafikon */}
          <View style={styles.chartContainer}>
            <View style={styles.cardHeader}>
              <FontAwesomeIcon icon={faChartLine} size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Trend kretanja glukoze</Text>
            </View>
            <View style={styles.chartWrapper}>
              {measurements.length > 0 ? (
                <LineChart
                  data={chartData}
                  width={300}
                  height={180}
                  yAxisSuffix=" mmol/L"
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 68, 68, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                    strokeWidth: 2,
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: "#FF4444"
                    },
                    propsForLabels: { 
                      fontSize: 10 
                    },
                    propsForBackgroundLines: {
                      strokeWidth: 1,
                      stroke: "#e3e3e3",
                      strokeDasharray: "0",
                    },
                  }}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={true}
                  withHorizontalLines={true}
                  withVerticalLines={true}
                />
              ) : (
                <Text style={styles.noDataText}>Nema dostupnih podataka</Text>
              )}
            </View>
          </View>

          {/* Poslednja merenja sa ScrollView */}
          <Card style={styles.measurementsCard}>
            <View style={styles.cardHeader}>
              <FontAwesomeIcon icon={faCalendar} size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Prikaz posljednjih 5 mjerenja</Text>
            </View>
            <View style={styles.scrollViewContainer}>
              <ScrollView 
                style={styles.measurementsScrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {measurements.length > 0 && (
                  <Image 
                    source={require('../assets/up.png')} 
                    style={styles.scrollIndicator} 
                    tintColor={colors.primary}
                  />
                )}
                {measurements.slice(0, 5).map((item) => (
                  <View key={item.id} style={styles.measurementItem}>
                    <View style={styles.measurementHeader}>
                      <Text style={styles.measurementTime}>
                        {item.timestamp.toDate().toLocaleTimeString('sr-Latn-RS', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      <Text style={styles.measurementDate}>
                        {item.timestamp.toDate().toLocaleDateString('sr-Latn-RS', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={styles.measurementValues}>
                      <View style={styles.glucoseContainer}>
                        <Text style={styles.glucoseValue}>{item.glucose} mmol/L</Text>
                      </View>
                      <Text style={styles.otherValues}>
                        {item.systolicPressure}/{item.diastolicPressure} mmHg • {item.pulse} o/min
                      </Text>
                      {item.note && (
                        <Text style={styles.noteText}>
                          Bilješka: {item.note}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
                {measurements.length > 0 && (
                  <Image 
                    source={require('../assets/down.png')} 
                    style={styles.scrollIndicator} 
                    tintColor={colors.primary}
                  />
                )}
              </ScrollView>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
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
    minHeight: 300,
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
    minHeight: 150,
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
    maxHeight: 220,
  },
  scrollViewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scrollViewContent: {
    width: '100%',
    alignItems: 'center',
  },
  measurementItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    marginVertical: 6,
    width: '90%',
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  measurementTime: {
    fontSize: 14,
    color: '#666',
  },
  measurementDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  measurementValues: {
    marginTop: 6,
    width: '100%',
  },
  glucoseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  glucoseValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 5,
  },
  glucoseIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  otherValues: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    width: '90%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
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
  chartWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  statsCard: {
    marginTop: 10,
    width: '90%',
    padding: 15,
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  quickActionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.3,
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
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  measurementsCard: {
    width: '90%',
    padding: 15,
    marginBottom: 20,
    maxHeight: 300,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: colors.primary,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    paddingRight: 10,
  },
  scrollIndicator: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginVertical: 5,
  },
});

export default PocetnaScreen;
