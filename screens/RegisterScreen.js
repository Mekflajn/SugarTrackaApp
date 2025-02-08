import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from '../config/FirebaseConfig';
import { FIREBASE_AUTH } from '../config/FirebaseConfig';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import colors from '../constants/colors';
import strings from '../constants/Strings';
import zxcvbn from 'zxcvbn';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faUser, 
  faRuler, 
  faWeightScale,
  faCake,
  faDroplet,
  faEye,
  faEyeSlash,
  faChevronLeft,
  faMars,
  faVenus,
  faGenderless
} from '@fortawesome/free-solid-svg-icons';

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
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const toggleTermsModal = () => setTermsModalVisible(!isTermsModalVisible);
  const togglePrivacyModal = () => setPrivacyModalVisible(!isPrivacyModalVisible);

  // Funkcija za validaciju email formata
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !height || !weight || !age || !dijabetes || !gender) {
      Alert.alert('Obavještenje',"Molimo vas unesite sve potrebne podatke.");
      return;
    }

    // Validacija email formata
    if (!isValidEmail(email)) {
      Alert.alert(
        "Greška",
        "Unesite email adresu u ispravnom formatu!"
      );
      return;

    }

    if (password.length < 8) {
      Alert.alert(
        "Greška",
        "Šifra mora sadržati najmanje 8 karaktera!"
      );
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
        Alert.alert('Obavještenje','Nalog sa ovom email adresom već postoji. Preusmjeravanje na prijavu...');
        navigation.navigate('LOGIN');
      } else {
        console.error('Greška: ', error.message);
        Alert.alert('Obavještenje','Greška prilikom registracije.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Dodajemo keyboard listener
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView 
        style={styles.screen} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('AUTHCHOICE')} style={styles.backButton}>
                  <FontAwesomeIcon icon={faChevronLeft} size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>REGISTRACIJA</Text>
                <Text>Kreirajte svoj novi nalog!</Text>
              </View>
              <Image
                source={require("../assets/logo.png")}
                style={styles.centeredLogo}
              />

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ime"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize='words'
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Prezime"
                    value={surname}
                    onChangeText={setSurname}
                    autoCapitalize='words'
                  />
                </View>

                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faEnvelope} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(input) => {
                      setEmail(input);
                      if (input === '') {
                        setEmailError('');
                      } else if (emailRegex.test(input)) {
                        setEmailError('');
                      } else {
                        setEmailError('Unesite validnu email adresu');
                      }
                    }}
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
                  />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(prevState => !prevState)} style={styles.iconButton}>
                    <FontAwesomeIcon 
                      icon={isPasswordVisible ? faEye : faEyeSlash} 
                      size={20} 
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              <View style={styles.red}>
                <View style={styles.inputContainerHalf}>
                  <FontAwesomeIcon icon={faRuler} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Visina"
                    keyboardType="numeric"
                    value={height}
                    onChangeText={(input) => {
                      if (/^[0-9]*$/.test(input)) {
                        setHeight(input);
                      } else {
                        setHeight(height);
                      }
                    }}
                  />
                </View>

                <View style={styles.inputContainerHalf}>
                  <FontAwesomeIcon icon={faWeightScale} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Masa"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={(input) => {
                      if (/^[0-9]*$/.test(input)) {
                        setWeight(input);
                      } else {
                        setWeight(weight);
                      }
                    }}
                  />
                </View>
                </View>

              <View style={styles.red}>
                <View style={styles.inputContainerHalf}>
                  <FontAwesomeIcon icon={faCake} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Godine"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={(input) => {
                      if (/^[0-9]*$/.test(input)) {
                        setAge(input);
                      } else {
                        setAge(age);
                      }
                    }}
                  />
                </View>

                <View style={styles.inputContainerHalf}>
                  <FontAwesomeIcon icon={faDroplet} size={20} color={colors.primary} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Tip dijabetesa"
                    value={dijabetes}
                    onChangeText={(text) => {
                      if (text === '1' || text === '2' || text === '') {
                        setDijabetes(text);
                      } else {
                        Alert.alert('Obavještenje','Unesite samo "1" za Tip 1 ili "2" za Tip 2');
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
                  <FontAwesomeIcon icon={faMars} size={24} color={colors.primary} />
                  <Text style={styles.genderButtonText}>Muško</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderButton, gender === 'Žensko' && styles.selectedGenderButton]}
                  onPress={() => setGender('Žensko')}>
                  <FontAwesomeIcon icon={faVenus} size={24} color={colors.primary} />
                  <Text style={styles.genderButtonText}>Žensko</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderButton, gender === 'Nije navedeno' && styles.selectedGenderButton]}
                  onPress={() => setGender('Nije navedeno')}>
                  <FontAwesomeIcon icon={faGenderless} size={24} color={colors.primary} />
                  <Text style={styles.genderButtonText}>Ne navodi</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                  <Text style={styles.registerButtonText}>REGISTRUJTE SE</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('LOGIN')} style={styles.footerLink}>
                <Text style={styles.footerText}>
                  Već imate nalog?{' '}
                  <Text style={styles.linkText}>Ulogujte se</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink} onPress={toggleTermsModal}>
                <Text style={styles.footerText}>
                  Registracijom prihvatate naše{' '}
                  <Text style={styles.linkText}>Uslove korišćenja</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerLink} onPress={togglePrivacyModal}>
                <Text style={styles.footerText}>
                  i <Text style={styles.linkText}>Politiku privatnosti</Text>.
                </Text>
              </TouchableOpacity>
            </>
          )}
          <Modal
            visible={isTermsModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleTermsModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.backButton1} onPress={toggleTermsModal}>
                  <FontAwesomeIcon icon={faChevronLeft} size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Uslovi korišćenja</Text>
                <Image
                source={require('../assets/logo96.png')}/>
                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.modalText}>
                    {strings.modalText1}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </Modal>

          <Modal
            visible={isPrivacyModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={togglePrivacyModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.backButton1} onPress={togglePrivacyModal}>
                  <FontAwesomeIcon icon={faChevronLeft} size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Politika privatnosti</Text>
                <Image
                source={require('../assets/logo96.png')}/>
                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.modalText}>
                    {strings.modalText2}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.pozadina,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.pozadina,
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 'auto',
    backgroundColor: colors.pozadina,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
    width: 128,
    height: 128,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: -20,
    top: 5,
    padding: 10,
  },
  backButton1: {
    position: 'absolute',
    left: 0,
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
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainerHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    padding: 12,
    width: '48%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tekst: {
    marginBottom: 20,
    fontSize: 16
  },
  genderButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '31%',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: "#0f00",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedGenderButton: {
    backgroundColor: `${colors.primary}40`,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  genderIcon: {
    width: 36, 
    height: 36,
    marginRight: 0,
  },
  genderButtonText: {
    fontSize: 12,
    color: 'black',
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    maxHeight: 400,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 15,
  },
  errorText: {
    color: colors.primary,
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center'
  }
});

export default RegisterScreen;
