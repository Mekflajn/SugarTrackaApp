import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image
                source={require("../assets/arrowBack.png")} // Putanja do tvoje slike
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>REGISTRACIJA</Text>
          </View>
          <Text>Kreirajte svoj novi nalog!</Text>
          <KeyboardAvoidingView behavior='padding'>

            <View style={styles.inputContainer}>

            <View style={styles.inputWrapper}>
            <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Ime'
                value={name}
                onChangeText={setName} />
            </View>

              <View style={styles.inputWrapper}>
              <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Prezime'
                value={surname}
                onChangeText={setSurname} />
              </View>

            <View style={styles.inputWrapper}>
            <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail} />
            </View>

              <View style={styles.inputWrapper}>
              <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Šifra'
                value={password}
                onChangeText={setPassword} />
              </View>

            <View style={styles.inputWrapper}>
            <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Visina'
                value={height}
                onChangeText={setHeight} />
              </View>
              <View style={styles.inputWrapper}>
              <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Masa'
                value={weight}
                onChangeText={setWeight} />
            </View>

            <View style={styles.inputWrapper}>
            <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Godine'
                value={age}
                onChangeText={setAge} />
              </View>
              <View style={styles.inputWrapper}>
              <Image source={require('../assets/icon.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder='Tip dijabetesa'
                value={dijabetes}
                onChangeText={setDijabetes} />
            </View>

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
    padding: 20,
    backgroundColor: colors.pozadina
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    left: -15,
    top: 33,
    padding: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',  // Svaki input uzima oko 48% širine
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    marginBottom: 10,  // Razmak između redova
  },
  inputContainer: {
    flexDirection: 'row', // Postavljamo inpute u redove
    flexWrap: 'wrap',     // Omogućavamo da se polja raspoređuju u više redova
    justifyContent: 'space-between', // Prostor između inputa
    width: '100%',   // Koristi celu širinu ekrana
    marginBottom: 20,
  },
  input: {
    flex: 1,   // Omogućava da TextInput zauzme preostali prostor
    padding: 10,
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
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
