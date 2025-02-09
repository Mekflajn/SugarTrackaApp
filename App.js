import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider } from './context/UserContext';
import { SafeAreaView, StyleSheet, View, Image, Text, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import colors from './constants/colors';
import PocetnaScreen from './screens/PocetnaScreen';
import IstorijaScreen from './screens/IstorijaScreen';
import IshranaScreen from './screens/IshranaScreen';
import PodesavanjaNaloga from './screens/PodesavanjaNaloga';
import UnosScreen from './screens/UnosScreen';
import AuthChoiceScreen from './screens/AuthChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TableteScreen from './screens/TableteScreen';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from './config/FirebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { firebase } from '@react-native-firebase/app';
import { firebaseConfig } from './config/FirebaseConfig';
import HranaScreen from './screens/HranaScreen';
import EdukacijaScreen from './screens/EdukacijaScreen';
import PreporuceniObrociScreen from './screens/PreporuceniObrociScreen';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHome, 
  faCapsules, 
  faClockRotateLeft, 
  faUtensils, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';



if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Stack2 = createStackNavigator();

function IshranaStack() {
  return(
  <Stack.Navigator initialRouteName='ISHRANA' screenOptions={{ animation: 'fade_from_bottom', animationDuration: 300 }}>
    <Stack2.Screen name='ISHRANA' component={IshranaScreen} options={{ 
  header: (props) => <Header {...props} title="Ishrana" showBackButton={false}/> 
}}/>

    <Stack2.Screen name='HRANA' component={HranaScreen} options={{ 
  header: (props) => <Header {...props} title="Obroci" showBackButton={true}/> 
}}/>
    <Stack2.Screen name='EDUKACIJA' component={EdukacijaScreen} options={{ 
  header: (props) => <Header {...props} title="Edukacija" showBackButton={true}/> 
}}/>

<Stack2.Screen name='PREPORUCENI_OBROCI' component={PreporuceniObrociScreen} options={{ 
  header: (props) => <Header {...props} title="Preporučeni obroci" showBackButton={true}/> 
}}/>

  </Stack.Navigator>
  );
}
function AuthStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom', animationDuration: 300 }}>
      <Stack.Screen name='AUTHCHOICE' component={AuthChoiceScreen} />
      <Stack.Screen name='LOGIN'>
        {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name='REGISTER'>
        {(props) => <RegisterScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function PocetnaStack() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'fade_from_bottom', animationDuration: 300 }}>
      <Stack.Screen 
        name="POČETNA_STACK" 
        component={PocetnaScreen}
        options={{
          header: () => <Header title="SugarTrack"/>
        }}
      />
      <Stack.Screen 
        name="UNOS" 
        component={UnosScreen} 
        options={{ 
          header: (props) => <Header {...props} title="Unos podataka" showBackButton={true}/> 
        }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="POČETNA"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTitleStyle: { color: "black", fontWeight: "bold" },
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === "POČETNA") {
            icon = faHome;
          } else if (route.name === "LIJEKOVI") {
            icon = faCapsules;
          } else if (route.name === "ISTORIJA") {
            icon = faClockRotateLeft;
          } else if (route.name === "ISHRANA") {
            icon = faUtensils;
          } else if (route.name === "NALOG") {
            icon = faUser;
          }
          return <FontAwesomeIcon 
            icon={icon} 
            size={size} 
            color={focused ? colors.primary : colors.neaktivna}
          />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neaktivna,
        tabBarStyle: isKeyboardVisible ? { display: 'none' } : {
          ...styles.tabBarStyle,
          height: 70,
          transform: [{ translateY: 0 }],
          transition: 'all 0.3s ease-in-out',
        },

        tabBarLabelStyle: { 
          fontSize: 10,
          marginBottom: 0,
          opacity: 1, 
          transition: 'opacity 0.3s ease', 
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        contentContainerStyle: {
          flex: 1,
          paddingBottom: 90,
        },
      })}
    >
      <Tab.Screen name="ISTORIJA" component={IstorijaScreen} options={{ header: () => <Header title="Istorija mjerenja"/> }} />
      <Tab.Screen name="LIJEKOVI" component={TableteScreen} options={{ header: () => <Header title="Lijekovi"/> }} />
      <Tab.Screen name="POČETNA" component={PocetnaStack} options={{ headerShown: false }}  />
      <Tab.Screen name="ISHRANA" component={IshranaStack} options={{ headerShown: false }} />
      <Tab.Screen name="NALOG" component={PodesavanjaNaloga} options={{ header: () => <Header title="Nalog"/> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemNavigationBar.navigationHide()
    }
    const checkAuthStatus = async () => {
      try {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
          if (user) {
            try {
              const docRef = doc(FIREBASE_DB, 'users', user.uid);
              const docSnap = await getDoc(docRef);
              
              if (docSnap.exists()) {
                setUserData({
                  uid: user.uid,
                  email: user.email,
                  ...docSnap.data(),
                });
                setIsAuthenticated(true);
              } else {
                console.warn('Dokument ne postoji za korisnika:', user.uid);
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.error('Greška pri dohvatanju korisničkih podataka:', error);
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
            setUserData(null);
          }
          setIsLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Greška pri provjeri autentifikacije:', error);
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <UserProvider value={userData}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.primary} hidden={true}/>
          <NavigationContainer>
            {isAuthenticated ? <MainApp /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
            <View style={{alignItems: 'center', backgroundColor: colors.pozadina, marginBottom: 2}}><Text style={{fontSize: 11, fontWeight: 'bold'}}>SugarTrack©</Text></View>
          </NavigationContainer>
        </SafeAreaView>
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pozadina,
  },
  tabBarStyle: {
    backgroundColor: colors.pozadina,
    height: Platform.OS === 'android' ? 70 : 65,
    paddingBottom: 0,
    paddingTop: 5,
    width: '80%',
    borderRadius: 20,
    marginHorizontal: '10%',
    position: 'absolute',
    bottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 0,
  },
});