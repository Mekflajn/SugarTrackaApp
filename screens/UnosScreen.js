import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { doc, collection, addDoc } from 'firebase/firestore'; 
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faHeart, faNoteSticky, faHeartbeat, faDroplet } from '@fortawesome/free-solid-svg-icons';



const UnosScreen = () => {
  const [glukoza, setGlukoza] = useState('');
  const [gornjiPritisak, setGornjiPritisak] = useState('');
  const [donjiPritisak, setDonjiPritisak] = useState('');
  const [puls, setPuls] = useState('');
  const [biljeske, setBiljeske] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

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

    let upozorenje = "";

  if (parseInt(gornjiPritisak) > 140) {
    upozorenje += "Povišen gornji pritisak!";
  }
  if (parseInt(donjiPritisak) > 100) {
    upozorenje += "Povišen donji pritisak!";
  }
  if (parseInt(puls) > 100) {
    upozorenje += "Povišen puls!";
  }

  let noveBiljeske = biljeske;
  if (upozorenje) {
    noveBiljeske = biljeske ? `${biljeske}\n${upozorenje}` : upozorenje;
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
        notes: noveBiljeske,
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
    <View style={{flex: 1, backgroundColor: colors.pozadina, paddingBottom: 100}}>
    <KeyboardAvoidingView 
      style={[styles.screen, { backgroundColor: colors.pozadina }]} 
      behavior={"padding"} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.polja}>

        <Text style={styles.text}>VRIJEDNOST GLUKOZE</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faDroplet} size={24} color={colors.primary}  style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost glukoze"
            keyboardType="decimal-pad"
            value={glukoza}


            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text) && (text === "" || parseFloat(text) <= 33.3)) {
                setGlukoza(text);
              }
            }}
          />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>PRITISAK</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHeart} size={24} color={colors.primary}  style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Unesite vrijednost gornjeg pritiska"
            keyboardType="numeric"
            value={gornjiPritisak}

            onChangeText={(text) => {
              if (/^\d*$/.test(text) && (text === "" || parseInt(text) <= 200)) {
                setGornjiPritisak(text);
              }
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHeart} size={24} color={colors.primary}  style={styles.icon}/>
          <TextInput
          style={styles.input}
          placeholder="Unesite vrijednost donjeg pritiska"
          keyboardType="numeric"
          value={donjiPritisak}

          onChangeText={(text) => {
            if (/^\d*$/.test(text) && (text === "" || parseInt(text) <= 120)) {
              setDonjiPritisak(text);
            }
          }}
        />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>PULS</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faHeartbeat} size={24} color={colors.primary}  style={styles.icon}/>
          <TextInput
          style={styles.input}
          placeholder="Unesite vrijednost pulsa"
          keyboardType="numeric"
          value={puls}


          onChangeText={(text) => {
            if (/^\d*$/.test(text) && (text === "" || parseInt(text) <= 200)) {
              setPuls(text);
            }
          }}
        />
        </View>
      </View>

      <View style={styles.polja}>
        <Text style={styles.text}>DODATNE BILJEŠKE</Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faNoteSticky} size={24} color={colors.primary}  style={styles.icon}/>
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
              <FontAwesomeIcon icon={faCalendar} size={24} color={colors.primary}  style={styles.icon}/>
              <Text style={styles.input}>{formatDate(date)}</Text>
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
    </KeyboardAvoidingView>
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
   input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
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
