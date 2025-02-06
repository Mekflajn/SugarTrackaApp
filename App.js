import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './context/UserContext';
import { SafeAreaView, StyleSheet, View, Image, Text, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
import { firebaseConfig } from '../SugarTrackApp/config/FirebaseConfig';
import HranaScreen from './screens/HranaScreen';
import EdukacijaScreen from './screens/EdukacijaScreen';
import PreporuceniObrociScreen from './screens/PreporuceniObrociScreen';



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
  <Stack.Navigator initialRouteName='ISHRANA'>
    <Stack2.Screen name='ISHRANA' component={IshranaScreen} options={{ 
  header: (props) => <Header {...props} title="ISHRANA" showBackButton={false}/> 
}}/>
    <Stack2.Screen name='HRANA' component={HranaScreen} options={{ 
  header: (props) => <Header {...props} title="HRANA" showBackButton={true}/> 
}}/>
    <Stack2.Screen name='EDUKACIJA' component={EdukacijaScreen} options={{ 
  header: (props) => <Header {...props} title="EDUKACIJA" showBackButton={true}/> 
}}/>

<Stack2.Screen name='PREPORUCENI_OBROCI' component={PreporuceniObrociScreen} options={{ 
  header: (props) => <Header {...props} title="PREPORUČENI OBROCI" showBackButton={true}/> 
}}/>

  </Stack.Navigator>
  );
}
function AuthStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    <Stack.Navigator>
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
          header: (props) => <Header {...props} title="UNOS PODATAKA" showBackButton={true}/> 
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
          let iconSource;
          if (route.name === "POČETNA") {
            iconSource = require('../SugarTrackApp/assets/home.png');
          } else if (route.name === "LIJEKOVI") {
            iconSource = require('../SugarTrackApp/assets/medkit.png');
          } else if (route.name === "ISTORIJA") {
            iconSource = require('../SugarTrackApp/assets/history.png');
          } else if (route.name === "ISHRANA") {
            iconSource = require('../SugarTrackApp/assets/food.png');
          } else if (route.name === "NALOG") {
            iconSource = require('../SugarTrackApp/assets/account.png');
          }
          return <Image
            source={iconSource}
            style={[styles.icon, { tintColor: focused ? colors.primary : colors.neaktivna, width: size, height: size }] }
          />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neaktivna,
        tabBarStyle: isKeyboardVisible ? { display: 'none' } : styles.tabBarStyle,
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen name="ISTORIJA" component={IstorijaScreen} options={{ header: () => <Header title="ISTORIJA MJERENJA"/> }} />
      <Tab.Screen name="LIJEKOVI" component={TableteScreen} options={{ header: () => <Header title="LIJEKOVI"/> }} />
      <Tab.Screen name="POČETNA" component={PocetnaStack} options={{ headerShown: false }}  />
      <Tab.Screen name="ISHRANA" component={IshranaStack} options={{ headerShown: false }} />
      <Tab.Screen name="NALOG" component={PodesavanjaNaloga} options={{ header: () => <Header title="NALOG"/> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        const docRef = doc(FIREBASE_DB, 'users', user.uid);

        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({
              uid: user.uid,
              email: user.email,
              ...docSnap.data(),
            });
            setIsAuthenticated(true);
          } else {
            console.warn('Dokument ne postoji za korisnika:', user.uid);
          }
        });

        return unsubscribeSnapshot;
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserProvider value={userData}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <NavigationContainer>
            {isAuthenticated ? <MainApp /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
            {/*<View style={{alignItems: 'center', backgroundColor: colors.pozadina, marginBottom: 5}}><Text style={{fontSize: 10, fontWeight: 'bold'}}>SugarTrack©</Text></View>*/}
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
    position: 'absolute',
    backgroundColor: colors.pozadina,
    height: 60,
    justifyContent: 'center',
    width: '80%',
    marginBottom: '5%',
    borderRadius: 20,
    marginHorizontal: '10%',
    bottom: 0,
    marginTop: 110,
  },
  icon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});