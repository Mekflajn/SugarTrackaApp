import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import colors from '../constants/colors';

const LoginScreen = ({navigation, setIsAuthenticated}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    try {
        console.log('Pokušaj prijave...');
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        console.log('Korisnik prijavljen:', userCredential.user);

        const user = userCredential.user;
        console.log('Preuzimanje podataka korisnika...');
        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Podaci korisnika:', userData);

            setIsAuthenticated(true);
        } else {
            console.error('Podaci korisnika nisu pronađeni.');
            alert('Došlo je do greške prilikom preuzimanja podataka.');
        }
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            alert('Nalog sa ovim podacima ne postoji.');
        } else if (error.code === 'auth/wrong-password') {
            alert('Pogrešna lozinka.');
        } else {
            console.error('Greška: ', error.message);
            alert('Greška prilikom prijave: ' + error.message);
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
          {/* Header sa strelicom i naslovom */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image
                source={require("../assets/arrowBack.png")} // Putanja do tvoje slike
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>PRIJAVA KORISNIKA</Text>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={require('../assets/icon.png')} style={styles.logo} />
          </View>

          {/* Formular za prijavu */}
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            {/* Email input sa ikonom */}
            <View style={styles.inputContainer}>
              <Image source={require('../assets/email.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password input sa ikonom */}
            <View style={styles.inputContainer}>
              <Image source={require('../assets/password.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Šifra"
                autoCapitalize="none"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </KeyboardAvoidingView>

          {/* Dugme za prijavu */}
          <TouchableOpacity onPress={handleLogin} style={styles.editButton}>
            <Text>ULOGUJTE SE</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Poravnanje prema vrhu
    padding: 20,
    backgroundColor: colors.pozadina,
  },
  header: {
    flexDirection: 'row', // Poravnanje strelice i naslova u horizontalnom pravcu
    width: '100%',
    height: 100,
    paddingTop: 20, // Pomeranje od vrha ekrana
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute', // Strelica je apsolutno pozicionirana
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
    marginLeft: 40, // Razmak između strelice i naslova
    textAlign: 'center',
    flex: 1, // Obezbeđuje centriranje naslova
  },
  logoContainer: {
    marginBottom: 40, // Razmak između logotipa i forme
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    borderColor: colors.primary
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    height: 50,
    borderColor: colors.linija
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
});

export default LoginScreen;
