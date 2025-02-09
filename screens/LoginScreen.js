import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator, Image, Platform, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faChevronLeft,
  faCheckSquare,
  faSquare
} from '@fortawesome/free-solid-svg-icons';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false); 
  const [previousLogins, setPreviousLogins] = useState([]);

  useEffect(() => {
    loadSavedCredentials();
    loadPreviousLogins();
  }, []);


  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      const savedRememberMe = await AsyncStorage.getItem('rememberMe');
      
      if (savedRememberMe === 'true') {
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Greška pri učitavanju kredencijala:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('savedEmail', email);
        await AsyncStorage.setItem('savedPassword', password);
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
        await AsyncStorage.removeItem('rememberMe');
      }
    } catch (error) {
      console.error('Greška pri čuvanju kredencijala:', error);
    }
  };

  const loadPreviousLogins = async () => {
    try {
      const savedLogins = await AsyncStorage.getItem('previousLogins');
      if (savedLogins) {
        const logins = JSON.parse(savedLogins);
        setPreviousLogins(logins);
        if (logins.length > 0) {
          setEmail(logins[logins.length - 1].email);
          setPassword(logins[logins.length - 1].password);
        }

      }
    } catch (error) {
      console.error('Greška pri učitavanju prethodnih prijava:', error);
    }
  };

  const savePreviousLogin = async () => {
    try {
      let logins = [...previousLogins];

      const existingIndex = logins.findIndex(login => login.email === email);
      if (existingIndex !== -1) {
        logins[existingIndex] = { email, password };
      } else {
        logins.push({ email, password });
        if (logins.length > 5) {
          logins = logins.slice(-5);
        }
      }
      
      await AsyncStorage.setItem('previousLogins', JSON.stringify(logins));
      setPreviousLogins(logins);
    } catch (error) {
      console.error('Greška pri čuvanju prijave:', error);
    }
  };

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
      
      const token = await user.getIdToken();
      await AsyncStorage.setItem('userToken', token);
      
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
      if (userDoc.exists()) {
        await saveCredentials();
        await savePreviousLogin();
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
    <KeyboardAvoidingView 
      style={[styles.screen, { backgroundColor: colors.pozadina }]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesomeIcon icon={faChevronLeft} size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>PRIJAVA KORISNIKA</Text>
          </View>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <KeyboardAvoidingView behavior="padding" style={styles.form}>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                autoComplete="email"
                textContentType="emailAddress"
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size={20} color={colors.primary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Šifra"
                autoCapitalize="none"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                autoComplete="password"
                textContentType="password"
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(prevState => !prevState)} style={styles.iconButton}>
                <FontAwesomeIcon 
                  icon={isPasswordVisible ? faEye : faEyeSlash} 
                  size={20} 
                  color={colors.primary}
                />

              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>ULOGUJTE SE</Text>
          </TouchableOpacity>

          <View style={styles.bottomContainer}>
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
          </View>


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
    paddingHorizontal: 20,
    backgroundColor: colors.pozadina,
    minHeight: '100%',
  },
  header: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
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
  },
  icon: {
    marginRight: 10,
    width: 24,
  },
  iconButton: {
    padding: 8,
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
    width: '90%',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  footerLink: {
    marginTop: 10,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  forgotPasswordLink: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  linkText: {
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: colors.pozadina,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  }
});

export default LoginScreen;
