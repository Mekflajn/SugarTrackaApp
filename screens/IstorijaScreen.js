import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { collection, doc, query, getDocs, orderBy, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faCalendar, faFilter, faSort, faTimes } from '@fortawesome/free-solid-svg-icons';
import colors from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const IstorijaScreen = () => {
  const { uid } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateInput, setActiveDateInput] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'high', 'low', 'normal'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' ili 'desc'

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

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDateFrom(null);
        setDateTo(null);
        setFilterType('all');
        setSortOrder('desc');
        setShowFilters(false);
      };
    }, [])
  );

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

  const filteredData = data.filter(item => {
    const itemDate = item.timestamp.toDate();
    const matchesDateRange = (!dateFrom || itemDate >= dateFrom) && 
                           (!dateTo || itemDate <= dateTo);

    let matchesType = true;
    if (filterType === 'high') {
        matchesType = item.glucose > 7;  // Samo glukoza povišena
    } else if (filterType === 'low') {
        matchesType = item.glucose < 4;  // Samo glukoza snižena
    } else if (filterType === 'normal') {
        matchesType = item.glucose >= 4 && item.glucose <= 7;  // Samo glukoza normalna
    }

    return matchesDateRange && matchesType;
  }).sort((a, b) => {
    const dateA = a.timestamp.toDate();
    const dateB = b.timestamp.toDate();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (activeDateInput === 'from') {
        setDateFrom(selectedDate);
      } else {
        setDateTo(selectedDate);
      }
    }
  };

  // Dodajte helper funkciju za formatiranje datuma
  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (loading) {
    return <View style={{flex: 1, backgroundColor: colors.pozadina}}><Text style={styles.loadingText}>Učitavanje podataka...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <View style={styles.filterButtonContent}>
            <FontAwesomeIcon icon={faFilter} size={18} color={colors.primary} />
            <Text style={styles.filterButtonText}>Filteri</Text>
          </View>
        </TouchableOpacity>

        {showFilters && (
          <Card style={styles.filterCard}>
            <View style={styles.filterRow}>
              <TouchableOpacity 
                style={[styles.dateButton, { flex: 0.48 }]}
                onPress={() => {
                  setActiveDateInput('from');
                  setShowDatePicker(true);
                }}
              >
                <FontAwesomeIcon icon={faCalendar} size={16} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {dateFrom ? formatDate(dateFrom) : 'Od datuma'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.dateButton, { flex: 0.48 }]}
                onPress={() => {
                  setActiveDateInput('to');
                  setShowDatePicker(true);
                }}
              >
                <FontAwesomeIcon icon={faCalendar} size={16} color={colors.primary} />
                <Text style={styles.dateButtonText}>
                  {dateTo ? formatDate(dateTo) : 'Do datuma'}
                </Text>
              </TouchableOpacity>
            </View>

            {(dateFrom || dateTo) && (
              <View style={styles.clearDatesContainer}>
                <TouchableOpacity 
                  style={styles.clearDatesButton}
                  onPress={() => {
                    setDateFrom(null);
                    setDateTo(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} size={14} color="white" />
                  <Text style={styles.clearDatesText}>Obriši datume</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.filterTypeRow}>
              {['all', 'high', 'low', 'normal'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterTypeButton,
                    filterType === type && styles.activeFilterType
                  ]}
                  onPress={() => setFilterType(type)}
                >
                  <Text style={[
                    styles.filterTypeText,
                    filterType === type && styles.activeFilterTypeText
                  ]}>
                    {type === 'all' ? 'Sve' : 
                     type === 'high' ? 'Povišen' :
                     type === 'low' ? 'Snižen' : 'Normalan'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{alignSelf: 'center', width: '100%'}}>
              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              >
                <FontAwesomeIcon 
                  icon={faSort} 
                  size={16} 
                  color={colors.primary}
                  style={styles.sortIcon} 
                />
                <Text style={styles.sortButtonText}>
                  {sortOrder === 'desc' ? 'Najnovije prvo' : 'Najstarije prvo'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={activeDateInput === 'from' ? (dateFrom || new Date()) : (dateTo || new Date())}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

      {filteredData.length === 0 ? (
        <Text style={styles.noDataText}>Nema sačuvanih mjerenja.</Text>
      ) : (
        <FlatList
          data={filteredData}
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
  filterSection: {
    padding: 10,
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  filterButtonText: {
    color: colors.primary,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  filterCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButtonText: {
    marginLeft: 8,

    color: '#444',
    fontSize: 14,
  },
  clearDatesContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  clearDatesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    padding: 8,
    borderRadius: 6,
    paddingHorizontal: 15,
    width: 'auto',
    marginVertical: 10,
    marginBottom: 10,
  },
  clearDatesText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignSelf: 'center',
  },
  filterTypeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    flex: 0.23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTypeText: {
    color: '#444',
    fontSize: 11, // Smanjen font
    fontWeight: '600',
    textAlign: 'center',
},
  activeFilterType: {
    backgroundColor: colors.primary,
  },
  activeFilterTypeText: {
    color: 'white',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  sortIcon: {
    marginRight: 8,
  },
  sortButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default IstorijaScreen;
