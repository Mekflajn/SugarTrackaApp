import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './context/UserContext';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from './config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
          header: (props) => <Header {...props} title="UNOS PODATAKA" showBackButton={true}/>,
          //animation: 'slide_from_bottom',
          animationTypeForReplace: 'pop',
        }}/>
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
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "POČETNA") {
            iconName = "home-outline";
          } else if (route.name === "LIJEKOVI") {
            iconName = "medkit-outline";
          } else if (route.name === "ISTORIJA") {
            iconName = "time-outline";
          } else if (route.name === "ISHRANA") {
            iconName = "nutrition-outline";
          } else if (route.name === "NALOG") {
            iconName = "person-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neaktivna,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name="ISTORIJA" component={IstorijaScreen} options={{ header: () => <Header title="ISTORIJA MJERENJA"/> }} />
      <Tab.Screen name="LIJEKOVI" component={LijekoviScreen} options={{ header: () => <Header title="LIJEKOVI"/> }} />
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
        const docRef = doc(FIREBASE_DB, "users", user.uid);
  
        // Dodaj listener za promene u Firestore-u
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({
              uid: user.uid,
              email: user.email,
              ...docSnap.data(),
            });
          } else {
            console.warn("Dokument ne postoji za korisnika:", user.uid);
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
      <View style={styles.screen}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar style="auto" />
        <NavigationContainer>
          {isAuthenticated ? <MainApp /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
        </NavigationContainer>
      </SafeAreaView>
      </View>
      <View style={styles.bottomBackground} />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pozadina,
  },
  tabBarStyle: {
    position: 'absolute', // Tab bar je fiksiran na dnu
    backgroundColor: colors.pozadina,
    height: 60,
    justifyContent: 'center',
    width: '80%',
    marginBottom: '5%',
    borderRadius: 20,
    marginHorizontal: '10%',
    bottom: 0, // Postavlja menije na dno ekrana
    marginTop: 110
  },
  bottomBackground: {
    backgroundColor: colors.pozadina,
    width: '100%',
  },
});