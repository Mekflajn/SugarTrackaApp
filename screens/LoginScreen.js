import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ActivityIndicator, Image } from 'react-native';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import colors from '../constants/colors';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));

      if (userDoc.exists()) {
        setIsAuthenticated(true);
      } else {
        alert('Došlo je do greške prilikom preuzimanja podataka.');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('Nalog sa ovim podacima ne postoji.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Pogrešna lozinka.');
      } else {
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image
                source={require("../assets/arrowBack.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={styles.title}>PRIJAVA KORISNIKA</Text>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          {/* Login Form */}
          <KeyboardAvoidingView behavior="padding" style={styles.form}>
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
          </KeyboardAvoidingView>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.buttonText}>ULOGUJTE SE</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity onPress={() => navigation.navigate('REGISTER')} style={styles.footerLink}>
            <Text style={styles.footerText}>
              Nemate nalog?{' '}
              <Text style={styles.linkText}>Napravite jedan!</Text>
            </Text>
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
    color: colors.text,
  },
  linkText: {
      textDecorationLine: 'underline',
      color: colors.primary,
  },
});

export default LoginScreen;
