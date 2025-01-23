import React from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { useState } from 'react';
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !height || !weight || !age || !dijabetes || !gender) {
      alert("Molimo unesite sve obavezne podatke.");
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
        navigation.navigate('LOGIN');
      } else {
        console.error('Greška: ', error.message);
        alert('Greška prilikom registracije: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('AUTHCHOICE')} style={styles.backButton}>
              <Image
                source={require("../assets/arrowBack.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>REGISTRACIJA</Text>
            <Text>Kreirajte svoj novi nalog!</Text>
          </View>
          <Image
            source={require("../assets/logo.png")} // Zamenite sa stvarnim nazivom slike logotipa
            style={styles.centeredLogo}
            />

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Image source={require('../assets/person.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Ime"
                value={name}
                onChangeText={setName}
                autoCapitalize='words'
              />
            </View>

            <View style={styles.inputContainer}>
              <Image source={require('../assets/person.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Prezime"
                value={surname}
                onChangeText={setSurname}
                autoCapitalize='words'
              />
            </View>

            <View style={styles.inputContainer}>
              <Image source={require('../assets/email.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image source={require('../assets/password.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Šifra"
                autoCapitalize="none"
                secureTextEntry={!isPasswordVisible}  // Prikazivanje/skrivanje lozinke
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(prevState => !prevState)} style={styles.iconButton}>
                <Image
                  source={isPasswordVisible ? require('../assets/visibility.png') : require('../assets/visibilitiOff.png')} // Ikona za otvaranje/zatvaranje oka
                  style={styles.iconVisibility}
                />
              </TouchableOpacity>
            </View>
          <View style={styles.red}>
            <View style={styles.inputContainerHalf}>
              <Image source={require('../assets/ruler.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Visina"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            <View style={styles.inputContainerHalf}>
              <Image source={require('../assets/weight.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Masa"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            </View>

          <View style={styles.red}>
            <View style={styles.inputContainerHalf}>
              <Image source={require('../assets/cake.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Godine"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>

            <View style={styles.inputContainerHalf}>
              <Image source={require('../assets/blood.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Tip dijabetesa"
                value={dijabetes}
                onChangeText={(text) => {
                  // Dozvoliti samo unos 1 ili 2
                  if (text === '1' || text === '2' || text === '') {
                    setDijabetes(text); // Ažuriraj stanje samo ako je unos validan
                  } else {
                    alert('Unesite samo "1" za Tip 1 ili "2" za Tip 2'); // Prikazivanje greške
                  }
                }}
                keyboardType="numeric"
              />
            </View>
            </View>
          </View>

          <Text style={styles.tekst}>Izaberite pol:</Text>
          <View style={styles.genderContainer}>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'Muško' && styles.selectedGenderButton]}
              onPress={() => setGender('Muško')}>
              <Image source={require('../assets/male.png')} style={styles.genderIcon} />
              <Text style={styles.genderButtonText}>Muško</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'Žensko' && styles.selectedGenderButton]}
              onPress={() => setGender('Žensko')}>
              <Image source={require('../assets/female.png')} style={styles.genderIcon} />
              <Text style={styles.genderButtonText}>Žensko</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'Nije navedeno' && styles.selectedGenderButton]}
              onPress={() => setGender('Nije navedeno')}>
              <Image source={require('../assets/person.png')} style={styles.genderIcon} />
              <Text style={styles.genderButtonText}>Ne navodi</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTRUJTE SE</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LOGIN')} style={styles.footerLink}>
            <Text style={styles.footerText}>
              Već imate nalog?{' '}
              <Text style={styles.linkText}>Ulogujte se</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerText}>
              Pročitajte naše{' '}
              <Text style={styles.linkText}>Uslove korišćenja</Text>
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.pozadina
  },
  header: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  centeredLogo: {
    width: 128, // Širina logotipa
    height: 128, // Visina logotipa
    resizeMode: 'contain', // Prilagođavanje slike unutar okvira
    alignSelf: 'center', // Centriranje slike horizontalno
    marginTop: 10, // Razmak između teksta i slike
    marginBottom: 20
  },
  backButton: {
    position: 'absolute',
    left: -20,
    top: 5,
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
    marginBottom: 20,
    fontWeight: 'bold'
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    height: 50,
    borderColor: colors.linija,
    textAlignVertical: 'center', // Vertikalno centriranje teksta u inputu
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  iconVisibility: {
    width: 24,
    height: 24,
    marginRight: 5,
    marginLeft: 5
  },
  red: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainerHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 5,
    width: '49%', // Ograničava širinu na polovinu
    marginBottom: 20
  },
  genderContainer: {
    marginBottom: 20,
    flexDirection: 'row',  // Postavi dugmadi u horizontalni red 
    alignItems: 'center',
  },
  tekst: {
    marginBottom: 20,
    fontSize: 16
  },
  genderButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginHorizontal: 10, // Razmak između dugmadi
    width: 80
  },
  selectedGenderButton: {
    backgroundColor: colors.primary,
  },
  genderIcon: {
    width: 36,  // Manje dimenzije za ikone
    height: 36,
    marginRight: 0, // Razmak između ikone i teksta
  },
  genderButtonText: {
    fontSize: 12, // Možda želiš smanjiti tekst da bude proporcionalan
    color: 'black',
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginRedirect: {
    marginTop: 20,
  },
  loginRedirectText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  footerLink: {
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.text,
  },
    linkText: {
    textDecorationLine: 'underline',
    color: colors.primary,
  },
});

export default RegisterScreen;
