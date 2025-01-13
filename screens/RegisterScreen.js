import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import colors from '../constants/colors';

const RegisterScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [dijabetes, setDijabetes] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!gender) {
      alert("Molimo izaberite pol.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('Korisnik registrovan:', userCredential.user);
      const user = userCredential.user;

      await setDoc(doc(FIREBASE_DB, "users", user.uid), {
        name: name,
        surname: surname,
        email: email,
        weight: weight,
        height: height,
        age: age,
        dijabetes: dijabetes,
        gender: gender
      });

      console.log('Podaci korisnika sačuvani');
      setIsAuthenticated(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Ova email adresa je već registrovana. Preusmeravanje na prijavu...');
        navigation.navigate('LOGIN'); // Preusmerava na ekran za prijavu
      } else {
        console.error('Greška: ', error.message);
        alert('Greška prilikom registracije: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>REGISTRACIJA KORISNIKA</Text>
          <KeyboardAvoidingView behavior='padding'>
            <TextInput
              style={styles.input}
              placeholder='Email'
              value={email}
              onChangeText={setEmail} />
            <TextInput
              style={styles.input}
              placeholder='Šifra'
              value={password}
              onChangeText={setPassword} />
            <TextInput
              style={styles.input}
              placeholder='Ime'
              value={name}
              onChangeText={setName} />
            <TextInput
              style={styles.input}
              placeholder='Prezime'
              value={surname}
              onChangeText={setSurname} />
            <TextInput
              style={styles.input}
              placeholder='Godine'
              value={age}
              onChangeText={setAge} />
            <TextInput
              style={styles.input}
              placeholder='Visina'
              value={height}
              onChangeText={setHeight} />
            <TextInput
              style={styles.input}
              placeholder='Masa'
              value={weight}
              onChangeText={setWeight} />
            <TextInput
              style={styles.input}
              placeholder='Tip dijabetesa'
              value={dijabetes}
              onChangeText={setDijabetes} />

            <View style={styles.genderContainer}>
              <Text style={styles.genderText}>Izaberite pol:</Text>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Muško' && styles.selectedGenderButton]}
                onPress={() => setGender('Muško')}>
                <Text style={styles.genderButtonText}>Muško</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderButton, gender === 'Žensko' && styles.selectedGenderButton]}
                onPress={() => setGender('Žensko')}>
                <Text style={styles.genderButtonText}>Žensko</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderButton, gender === 'Nije navedeno' && styles.selectedGenderButton]}
                onPress={() => setGender('Nije navedeno')}>
                <Text style={styles.genderButtonText}>Ne zelim da navodim</Text>
              </TouchableOpacity>
              
            </View>
          </KeyboardAvoidingView>

          <Button title='REGISTRUJTE SE' onPress={handleRegister} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary
  },
  genderContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  genderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  genderButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  selectedGenderButton: {
    backgroundColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default RegisterScreen;
