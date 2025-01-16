import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { doc, collection, addDoc } from 'firebase/firestore'; // Za rad sa Firestore
import { FIREBASE_DB } from '../config/FirebaseConfig'; // Tvoj Firebase DB objekat
import { getAuth } from 'firebase/auth'; // Za rad sa Firebase Authentication
import colors from '../constants/colors';

const UnosScreen = () => {
  const [glukoza, setGlukoza] = useState('');
  const [gornjiPritisak, setGornjiPritisak] = useState('');
  const [donjiPritisak, setDonjiPritisak] = useState('');
  const [puls, setPuls] = useState('');
  const [biljeske, setBiljeske] = useState('');

  const saveData = async () => {
    if (!glukoza || !gornjiPritisak || !donjiPritisak || !puls) {
      Alert.alert('Greška', 'Sva polja moraju biti popunjena!');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser; // Uzmi trenutno prijavljenog korisnika
      if (!user) {
        Alert.alert('Greška', 'Morate biti prijavljeni!');
        return;
      }
      const uid = user.uid; // Uzmi UID korisnika

      const userDoc = doc(FIREBASE_DB, 'users', uid);
      const measurementsCollection = collection(userDoc, 'measurements');

      const newMeasurement = {
        glucose: glukoza,
        systolicPressure: gornjiPritisak,
        diastolicPressure: donjiPritisak,
        pulse: puls,
        notes: biljeske,
        timestamp: new Date(),
      };

      await addDoc(measurementsCollection, newMeasurement); // Dodavanje novog dokumenta u Firestore
      Alert.alert('Uspešno sačuvano', 'Podaci su uspešno sačuvani!');
      // Resetovanje unosa nakon što su podaci sačuvani
      setGlukoza('');
      setGornjiPritisak('');
      setDonjiPritisak('');
      setPuls('');
      setBiljeske('');
    } catch (error) {
      console.error('Greška pri čuvanju podataka:', error);
      Alert.alert('Greška', 'Došlo je do greške prilikom čuvanja podataka!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Unos glukoze */}
      <View style={styles.polja}>
        <Text style={styles.text}>VRIJEDNOST GLUKOZE</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/insights.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost glukoze"
            keyboardType="numeric"
            value={glukoza}
            onChangeText={setGlukoza}
          />
        </View>
      </View>

      {/* Unos pritiska */}
      <View style={styles.polja}>
        <Text style={styles.text}>PRITISAK</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/heart.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost gornjeg pritiska"
            keyboardType="numeric"
            value={gornjiPritisak}
            onChangeText={setGornjiPritisak}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/heart.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost donjeg pritiska"
            keyboardType="numeric"
            value={donjiPritisak}
            onChangeText={setDonjiPritisak}
          />
        </View>
      </View>

      {/* Unos pulsa */}
      <View style={styles.polja}>
        <Text style={styles.text}>PULS</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/ecg.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost pulsa"
            keyboardType="numeric"
            value={puls}
            onChangeText={setPuls}
          />
        </View>
      </View>

      {/* Dodatne bilješke */}
      <View style={styles.polja}>
        <Text style={styles.text}>DODATNE BILJEŠKE</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/notes.png')} style={styles.icon} />
          <TextInput
            style={[styles.input]} // Povećana visina za bilješke
            placeholder="Unesite dodatne bilješke ukoliko imate"
            multiline={true}
            value={biljeske}
            onChangeText={setBiljeske}
          />
        </View>
      </View>

      {/* Potvrda */}
      <View style={styles.button}>
        <TouchableWithoutFeedback onPress={saveData}>
          <Text style={styles.editButtonText}>POTVRDI</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.pozadina,
    flex: 1, 
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
    borderWidth: 1, // Dodajemo border oko inputContainer-a
    borderColor: '#ccc', // Boja bordera
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    flex: 1, // Da TextInput popuni preostali prostor
    height: 50, // Smanjena visina za sve inpute
    borderColor: colors.linija
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10, // Dodajemo razmak između slike i inputa
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: { color: 'white', fontWeight: 'bold' },
});

export default UnosScreen;
