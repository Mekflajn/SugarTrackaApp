import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, Platform, ScrollView } from 'react-native';
import { doc, collection, addDoc } from 'firebase/firestore'; 
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const UnosScreen = () => {
  const [glukoza, setGlukoza] = useState('');
  const [gornjiPritisak, setGornjiPritisak] = useState('');
  const [donjiPritisak, setDonjiPritisak] = useState('');
  const [puls, setPuls] = useState('');
  const [biljeske, setBiljeske] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    setDate(currentDate); 
  };

  const saveData = async () => {
    if (!glukoza || !gornjiPritisak || !donjiPritisak || !puls) {
      Alert.alert('Greška', 'Sva polja moraju biti popunjena!');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Greška', 'Morate biti prijavljeni!');
        return;
      }
      const uid = user.uid;

      const userDoc = doc(FIREBASE_DB, 'users', uid);
      const measurementsCollection = collection(userDoc, 'measurements');

      const newMeasurement = {
        glucose: glukoza,
        systolicPressure: gornjiPritisak,
        diastolicPressure: donjiPritisak,
        pulse: puls,
        notes: biljeske,
        timestamp: date,
      };

      await addDoc(measurementsCollection, newMeasurement);
      Alert.alert('Obavještenje', 'Podaci su uspješno sačuvani!');
      setGlukoza('');
      setGornjiPritisak('');
      setDonjiPritisak('');
      setPuls('');
      setBiljeske('');
      navigation.navigate('POČETNA_STACK');
    } catch (error) {
      console.error('Greška pri čuvanju podataka:', error);
      Alert.alert('Greška', 'Došlo je do greške prilikom čuvanja podataka!');
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.polja}>
        <Text style={styles.text}>VRIJEDNOST GLUKOZE</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/insights.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost glukoze"
            keyboardType="decimal-pad"
            value={glukoza}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) {
                setGlukoza(text);
              }
            }}
          />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>PRITISAK</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/heart.png')} style={styles.icon} />
          <TextInput
          style={styles.input}
          placeholder="Unesite vrijednost gornjeg pritiska"
          keyboardType="numeric"
          value={gornjiPritisak}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              setGornjiPritisak(text);
            }
          }}
        />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/heart.png')} style={styles.icon} />
          <TextInput
          style={styles.input}
          placeholder="Unesite vrijednost donjeg pritiska"
          keyboardType="numeric"
          value={donjiPritisak}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              setDonjiPritisak(text);
            }
          }}
        />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>PULS</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/ecg.png')} style={styles.icon} />
          <TextInput
          style={styles.input}
          placeholder="Unesite vrijednost pulsa"
          keyboardType="numeric"
          value={puls}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              setPuls(text);
            }
          }}
        />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>DODATNE BILJEŠKE</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/notes.png')} style={styles.icon} />
          <TextInput
            style={[styles.input]}
            placeholder="Unesite dodatne bilješke ukoliko imate"
            multiline={true}
            value={biljeske}
            onChangeText={setBiljeske}
          />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>DATUM I VRIJEME</Text>
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(true)}>
          <View style={styles.inputContainer}>
          <Image source={require('../assets/calendar.png')} style={styles.icon} />
            <Text style={styles.input}>{date.toLocaleDateString()}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.button}>
        <TouchableWithoutFeedback onPress={saveData}>
          <Text style={styles.editButtonText}>POTVRDI</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.pozadina,
    flex: 1, 
    paddingBottom: 120
  },
  polja: { 
    marginBottom: 10
  },
  text: { 
    fontWeight: 'bold', 
    marginTop: 10 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    height: 50,
    borderColor: colors.linija,
    textAlignVertical: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  editButtonText: { color: 'white', fontWeight: 'bold' },
});

export default UnosScreen;
