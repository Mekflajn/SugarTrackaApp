import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator, Image, Platform, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";  // Dodajte sendPasswordResetEmail
import { doc, getDoc } from "firebase/firestore";

import colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);  // Dodano za loading pri resetovanju

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        Alert.alert(
          "Greška",
          "Molimo popunite sva polja!"
        );
        return;
      }
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      
      // Sačuvaj token u AsyncStorage
      const token = await user.getIdToken();
      await AsyncStorage.setItem('userToken', token);
      
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
      if (userDoc.exists()) {
        setIsAuthenticated(true);
      } else {
        alert('Došlo je do greške prilikom preuzimanja podataka.');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Greška','Nalog sa ovim podacima ne postoji.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Greška','Pogrešna lozinka.');
      } else if (error.code === 'auth/invalid-credential'){
        Alert.alert('Obavještenje','Pogrešan email ili lozinka.');
      }else {
        Alert.alert('Obavješenje','Greška prilikom prijave');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsResetLoading(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Obavještenje','Poslali smo vam email za resetovanje lozinke!');
    } catch (error) {
      Alert.alert('Obavještenje','Greška prilikom slanja email-a molimo vas da upišete email u polje za unos.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image
                source={require("../assets/arrowBack.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>PRIJAVA KORISNIKA</Text>
          </View>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View style={styles.inputContainer}>
              <Image source={require('../assets/email.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
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
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(prevState => !prevState)} style={styles.iconButton}>
                <Image
                  source={isPasswordVisible ? require('../assets/visibility.png') : require('../assets/visibilitiOff.png')}
                  style={styles.iconVisibility}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>ULOGUJTE SE</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResetPassword} style={styles.forgotPasswordLink}>
            {isResetLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.footerText}>Zaboravili ste šifru?</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('REGISTER')} style={styles.footerLink}>
            <Text style={styles.footerText}>
              Nemate nalog?{' '}
              <Text style={styles.linkText}>Napravite jedan!</Text>
            </Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: colors.pozadina,
  },
  header: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: -20,
    top: 25,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 128,
    height: 128,
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
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerLink: {
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline'
  },
  forgotPasswordLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
      textDecorationLine: 'underline',
      color: colors.primary,
  },
});

export default LoginScreen;
