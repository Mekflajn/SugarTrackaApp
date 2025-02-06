import React, { useState, useEffect, useCallback  } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ScrollView, Modal, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, onSnapshot  } from "firebase/firestore";
import colors from "../constants/colors";
import { useUser } from "../context/UserContext";
import Card from "../components/Card";
import strings from "../constants/Strings";
import { setLogLevel } from "firebase/app";
import { useFocusEffect } from "@react-navigation/native";

setLogLevel('silent');
const PodesavanjaNaloga = () => {
const [profileImage, setProfileImage] = useState(null);
const user = useUser();
const [isEditing, setIsEditing] = useState(false);
const [updatedData, setUpdatedData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    gender: user?.gender || "",
  });
const [isInfoVisible, setIsInfoVisible] = useState(false);

const handleInfoPress = () => {
  setIsInfoVisible(true);
}

const handleCloseInfo = () => {
  setIsInfoVisible(false);
}

const db = getFirestore();

const getDefaultProfileImage = (gender) => {
  if (gender === "Žensko") {
    return require("../assets/female_account.png");
  } else if (gender === "Muško") {
    return require("../assets/male_account.png");
  } else {
    return require("../assets/nalog.png");
  }
};



useEffect(() => {
  const fetchUserData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    if (user) {
      const userId = user.uid;
      const userRef = doc(db, "users", userId);

      try {
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUpdatedData({
            name: data.name || "",
            surname: data.surname || "",
            gender: data.gender || "",
            age: data.age || "",
            dijabetes: data.dijabetes || "",
            weight: data.weight || "",
            height: data.height || ""
          });

          if (data.profileImage) {
            setProfileImage(data.profileImage);
          } else {
            setProfileImage(getDefaultProfileImage(data.gender));
          }

        } else {
          Alert.alert("Greška", "Podaci nisu pronađeni.");
        }
      } catch (error) {
        console.log("Greška pri čitanju podataka:", error);
        Alert.alert("Greška", "Došlo je do greške prilikom čitanja podataka.");
      }
    }
  };

  fetchUserData();
}, []);

useFocusEffect(
  useCallback(() => {
    return () => {
      setIsEditing(false);
    };
  }, [])
);

useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser?.uid), (snapshot) => {
  });

  return () => unsubscribe();
}, []);

  const handleSave = async () => {
    console.log("Dugme je pritisnuto!");
    const auth = getAuth();
    const user = auth.currentUser; 

    if (user) {
      const userId = user.uid;
      const userRef = doc(db, "users", userId); 

      const age = parseInt(updatedData.age, 10);
      const weight = parseFloat(updatedData.weight.replace(',', '.'));
      const height = parseFloat(updatedData.height.replace(',', '.'));

      if (isNaN(age) || age <= 0) {
        Alert.alert("Greška", "Unesite validne godine.");
        return;
      }

      if (isNaN(weight) || weight <= 0) {
        Alert.alert("Greška", "Unesite validnu masu.");
        return;
      }

      if (isNaN(height) || height <= 0) {
        Alert.alert("Greška", "Unesite validnu visinu.");
        return;
      }

      if (updatedData.dijabetes !== "1" && updatedData.dijabetes !== "2") {
        Alert.alert("Greška", "Tip dijabetesa mora biti 1 ili 2.");
        return;
      }

      const updatedUserData = {
        ...updatedData,
        dijabetes: updatedData.dijabetes,
      };

      try {
        await setDoc(userRef, updatedData, { merge: true });
        console.log("Podaci za čuvanje:", updatedData);
        Alert.alert("Obavještenje", "Podaci su uspješno sačuvani.");
        setIsEditing(false);
      } catch (error) {
        console.log("Greška pri čuvanju podataka:", error);
        Alert.alert("Greška", "Podaci nisu sačuvani. Pokušajte ponovo.");
      }
    } else {
      Alert.alert("Greška", "Nema ulogovanog korisnika.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    Alert.alert("Obavještenje", "Izmjene su odbačene.");
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      Alert.alert('Odjavili ste se', 'Uspješno ste se odjavili sa naloga.');
    } catch (error) {
      console.log("Greška pri odjavi:", error);
      Alert.alert('Greška', 'Došlo je do greške pri odjavi.');
    }
  };

  useEffect(() => {
    const defaultImage = getDefaultProfileImage(user?.gender);
    setProfileImage(defaultImage);
  }, [user?.gender]);

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: colors.pozadina, paddingBottom: 110}} behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
    <ScrollView style={styles.scrollContainer}>
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={getDefaultProfileImage(user?.gender)} style={styles.image} />
      </View>

      <TouchableOpacity style={styles.infoIconContainer} onPress={handleInfoPress}>
          <Image source={require('../assets/info.png')} style={styles.infoIcon} />
      </TouchableOpacity>

      <Modal
          visible={isInfoVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={setIsInfoVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleCloseInfo} style={styles.closeButton}>
                <Image source={require("../assets/arrowBack.png")} style={styles.backArrow} />
              </TouchableOpacity>
              <Image source={require("../assets/logo96.png")}/>
              <ScrollView style={styles.modalTextContainer}>                
                <Text style={styles.modalTitle}>Autorska prava (Copy Rights)</Text>
                <Text style={styles.modalText}>{strings.modalText3}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.modalTitle}>Uslovi korišćenja (Terms of Use)</Text>
                <Text style={styles.modalText}>{strings.modalText1}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.modalTitle}>Politika privatnosti (Privacy Policy)</Text>
                <Text style={styles.modalText}>{strings.modalText2}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Ime i prezime</Text>
          {isEditing ? (
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                value={updatedData.name}
                placeholder="Ime"
                onChangeText={(text) => setUpdatedData({ ...updatedData, name: text.charAt(0).toUpperCase() + text.slice(1) })}
              />
              <TextInput
                style={[styles.input, styles.inputHalf]}
                value={updatedData.surname}
                placeholder="Prezime"
                onChangeText={(text) => setUpdatedData({ ...updatedData, surname: text.charAt(0).toUpperCase() + text.slice(1) })}
              />
            </View>
          ) : (
            <Text style={styles.infoValue}>{user?.name || "N/A"} {user?.surname || "N/A"}</Text>
          )}

          <Text style={styles.infoLabel}>Pol</Text>
          {isEditing ? (
            <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, updatedData.gender === "Muško" && styles.selectedGenderButton]}
              onPress={() => setUpdatedData({ ...updatedData, gender: "Muško" })}>
              <Image source={require('../assets/male.png')} style={styles.genderIcon} />
              <Text style={styles.genderButtonText}>M</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, updatedData.gender === "Žensko" && styles.selectedGenderButton]}
                onPress={() => setUpdatedData({ ...updatedData, gender: "Žensko" })}>
              <Image source={require('../assets/female.png')} style={styles.genderIcon} />
              <Text style={styles.genderButtonText}>Ž</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, updatedData.gender === "Nije navedeno" && styles.selectedGenderButton]}
                onPress={() => setUpdatedData({ ...updatedData, gender: "Nije navedeno" })}>
              <Image source={require('../assets/person.png')} style={styles.genderIcon} />
              <Text style={styles.genderButtonText}>NN</Text>
            </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.infoValue}>{user?.gender || "N/A"}</Text>
          )}

          <Text style={styles.infoLabel}>Godine</Text>
          {isEditing ? (
          <TextInput
              style={styles.input}
              value={updatedData.age}
              placeholder="Godine"
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setUpdatedData({ ...updatedData, age: text });
                }
              }}
              keyboardType="numeric"
          />
          ) : (
          <Text style={styles.infoValue}>{user?.age || "N/A"}</Text>
          )}

          <Text style={styles.infoLabel}>Tip dijabetesa</Text>
          {isEditing ? (
          <TextInput
              style={styles.input}
              value={updatedData.dijabetes}
              placeholder="Tip dijabetesa"
              onChangeText={(text) => setUpdatedData({ ...updatedData, dijabetes: text })}
              keyboardType="numeric"
          />
          ) : (
          <Text style={styles.infoValue}>{user?.dijabetes || "N/A"}</Text>
          )}

          <Text style={styles.infoLabel}>Masa</Text>
          {isEditing ? (
          <TextInput
              style={styles.input}
              value={updatedData.weight}
              placeholder="Masa"
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setUpdatedData({ ...updatedData, weight: text });
                }
              }}
              keyboardType="numeric"
          />
          ) : (
          <Text style={styles.infoValue}>{user?.weight || "N/A"} kg</Text>
          )}

          <Text style={styles.infoLabel}>Visina</Text>
          {isEditing ? (
          <TextInput
              style={styles.input}
              value={updatedData.height}
              placeholder="Visina"
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setUpdatedData({ ...updatedData, height: text });
                }
              }}
              keyboardType="numeric"
          />
          ) : (
          <Text style={styles.infoValue}>{user?.height || "N/A"} cm</Text>
          )}
        </View>
      </View>

      {!isEditing ? (
        <View style={styles.editDugmad}>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Uredi</Text>
        </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Image
              source={require('../assets/logout.png')}
              style={styles.logoutIcon}/>
        </TouchableOpacity>
            </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Sačuvaj</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Poništi</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.pozadina,
    paddingBottom: 110
  },
  screen: {
    padding: 20,
    flex: 1,
    paddingBottom: 150,
    alignItems: 'center'
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editImageText: {
    marginTop: 10,
    color: colors.primary,
  },
  card: {
    marginBottom: 20,
    width: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    flexDirection: 'column',
    marginHorizontal: '5%',
    backgroundColor: 'white',
    padding: 15,
    // Elevation for Android
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 12,
  },
  inputHalf: {
    width: '48%',
    marginRight: '4%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary, // Replace with your primary color
    borderRadius: 5,
    marginHorizontal: 10,
    width: 48,
  },
  selectedGenderButton: {
    backgroundColor: colors.primary, // Replace with your primary color
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
  editButton: {
    width: 80,
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 10
  },
  saveButton: {
    width: 80,
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 10
  },
  cancelButton: {
    width: 80,
    backgroundColor: "#f44336",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
    width: 80,
    backgroundColor: "#f44336",
    padding: 15,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 10
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: 'white'
  },
  editDugmad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    maxHeight: "80%"
  },
  modalImage: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
  backArrow: {
    width: 30,
    height: 30,
    tintColor: 'black',
  },
  infoIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  infoIcon: {
    width: 32,
    height: 32,
  },
  modalTextContainer: {
    marginTop: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center'
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },

});

export default PodesavanjaNaloga;
