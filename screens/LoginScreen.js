import React, {useState} from 'react';
import { View, Text, StyleSheet, Button, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
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
      <Text style={styles.title}>PRIJAVA KORISNIKA</Text>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput
            style={styles.input}
            placeholder='Email'
            autoCapitalize='none'
            value={email}
            onChangeText={(email) => setEmail(email)}/>
        
        <TextInput
            style={styles.input}
            placeholder='Šifra'
            autoCapitalize='none'
            secureTextEntry={true}
            value={password}
            onChangeText={(password) => setPassword(password)}/>
      </KeyboardAvoidingView> 
      <Button title='ULOGUJTE SE' onPress={handleLogin}/>
      </>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: colors.primary,
    borderRadius: 5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default LoginScreen;
