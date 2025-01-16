import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './context/UserContext';
import { SafeAreaView, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/Ionicons";
import colors from './constants/colors';
import PocetnaScreen from './screens/PocetnaScreen';
import LijekoviScreen from './screens/LijekoviScreen';
import IstorijaScreen from './screens/IstorijaScreen';
import IshranaScreen from './screens/IshranaScreen';
import PodesavanjaNaloga from './screens/PodesavanjaNaloga';
import UnosScreen from './screens/UnosScreen';
import AuthChoiceScreen from './screens/AuthChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TableteScreen from './screens/TableteScreen';
import PodsjetniciScreen from './screens/PodsjetniciScreen';
import UpozorenjaScreen from './screens/UpozorenjaScreen';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from './config/FirebaseConfig'; // Importuj iz FirebaseConfig
import { doc, getDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { firebase } from '@react-native-firebase/app';
import { firebaseConfig } from '../SugarTrackApp/config/FirebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);  // Inicijalizacija Firebase-a
} else {
  firebase.app(); // Koristi već inicijalizovanu instancu
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Stack1 = createStackNavigator();

function LijekoviStack() {
  return(
    <Stack.Navigator initialRouteName='LIJEKOVI'>
      <Stack1.Screen name = "LIJEKOVI" component={LijekoviScreen} options={{ 
  header: (props) => <Header {...props} title="LIJEKOVI" showBackButton={true}/> 
}}/>
      <Stack1.Screen name = "TABLETE" component={TableteScreen} options={{ 
  header: (props) => <Header {...props} title="TABLETE" showBackButton={true}/> 
}}/>
      <Stack1.Screen name = "UPOZORENJA" component={UpozorenjaScreen} options={{ 
  header: (props) => <Header {...props} title="UPOZORENJA" showBackButton={true}/> 
}}/>
      <Stack1.Screen name = "PODSJETNICI" component={PodsjetniciScreen} options={{ 
  header: (props) => <Header {...props} title="PODSJETNICI" showBackButton={true}/> 
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
          header: () => <Header title="SUGARTRACK"/>
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
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen name="ISTORIJA" component={IstorijaScreen} options={{ header: () => <Header title="ISTORIJA MJERENJA"/> }} />
      <Tab.Screen name="LIJEKOVI" component={LijekoviStack} options={{ headerShown: false }} />
      <Tab.Screen name="POČETNA" component={PocetnaStack} options={{ headerShown: false }}  />
      <Tab.Screen name="ISHRANA" component={IshranaScreen} options={{ header: () => <Header title="ISHRANA"/> }} />
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

        // Dodaj listener za promene u Firestore-u
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({
              uid: user.uid,
              email: user.email,
              ...docSnap.data(),
            });
            setIsAuthenticated(true); // Kada se korisnik autentifikuje
          } else {
            console.warn('Dokument ne postoji za korisnika:', user.uid);
          }
        });

        return unsubscribeSnapshot; // Clean-up za listener
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    });

    return unsubscribe; // Clean-up za onAuthStateChanged
  }, []);

  return (
    <UserProvider value={userData}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <NavigationContainer>
            {isAuthenticated ? <MainApp /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
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
    marginTop: 110
  },
  icon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});
