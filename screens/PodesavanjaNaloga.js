import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ScrollView, SafeAreaView, Modal, FlatList } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import colors from "../constants/colors";
import { useUser } from "../context/UserContext";
import { launchImageLibrary } from "react-native-image-picker";
import Card from "../components/Card";

const PodesavanjaNaloga = () => {
const [profileImage, setProfileImage] = useState(null);
const user = useUser();
const [isEditing, setIsEditing] = useState(false);
const [updatedData, setUpdatedData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    gender: user?.gender || "",
  });
const [isModalVisible, setIsModalVisible] = useState(false); // State za modal

const db = getFirestore(); // Koristimo Firestore

const getDefaultProfileImage = (gender) => {
  if (gender === "Žensko") {
    return require("../assets/female_account.png");
  } else if (gender === "Muško") {
    return require("../assets/male_account.png");
  } else {
    return require("../assets/nalog.png"); // Ako nije Muško ni Žensko, vraća nalog.png
  }
};
const maleImages = [
  {id: "1", source: require("../assets/male1.png")},
  {id: "2", source: require("../assets/male2.png") },
  {id: "3", source: require("../assets/male3.png") },
  {id: "4", source: require("../assets/male_account.png") },
];

const femaleImages = [
  {id: "1", source: require("../assets/female1.png") },
  {id: "2", source: require("../assets/female2.png") },
  {id: "3", source: require("../assets/female3.png") },
  {id: "4", source: require("../assets/female_account.png") },
];

const handleProfileImageChange = async (image) => {
  setProfileImage(image);
  setIsModalVisible(false); // Zatvori modal

  // Spremanje linka do slike u Firestore
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid; // Koristi UID korisnika za putanju
    const userRef = doc(db, "users", userId);

    try {
      // Dodaj sliku u podatke korisnika
      await setDoc(userRef, { profileImage: image }, { merge: true });
      console.log("Slika je uspešno sačuvana.");
    } catch (error) {
      console.log("Greška pri čuvanju slike:", error);
      Alert.alert("Greška", "Došlo je do greške prilikom čuvanja slike.");
    }
  }
};


  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser; // Dobijamo trenutnog korisnika

      if (user) {
        const userId = user.uid; // Uzimaš UID korisnika
        const userRef = doc(db, "users", userId); // Koristimo Firestore doc() umesto ref()

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
              // Ako nema spremljene slike, postavi default sliku
              setProfileImage(getDefaultProfileImage(data.gender));
            }
            
          } else {
            Alert.alert("Greška", "Podaci nisu pronađeni.");
          }
        } catch (error) {
          console.log("Greška pri čitanju podataka:", error);
          Alert.alert("Greška", "Došlo je do greške prilikom čitanja podataka.");
        }
      } else {
        Alert.alert("Greška", "Korisnik nije ulogovan.");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    console.log("Dugme je pritisnuto!");
    const auth = getAuth();
    const user = auth.currentUser; // Dobijamo trenutnog korisnika

    if (user) {
      const userId = user.uid; // Koristi UID korisnika za putanju
      const userRef = doc(db, "users", userId); // Koristi Firestore doc() umesto ref()

      const age = parseInt(updatedData.age, 10);
      const weight = parseFloat(updatedData.weight.replace(',', '.')); // Zameni zapetu sa tačkom za decimalne brojeve
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
        ...updatedData, // uključuje ime, prezime, pol, itd.
        dijabetes: updatedData.dijabetes, // dodajemo godine
      };

      try {
        await setDoc(userRef, updatedData, { merge: true }); // Spremanje podataka sa merge za ažuriranje postojećih podataka
        console.log("Podaci za čuvanje:", updatedData);
        Alert.alert("Uspešno", "Podaci su sačuvani.");
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
    Alert.alert("Poništeno", "Izmjene su odbačene.");
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut(); // Odjavite korisnika
      Alert.alert('Odjavili ste se', 'Uspešno ste se odjavili sa naloga.');
    } catch (error) {
      console.log("Greška pri odjavi:", error);
      Alert.alert('Greška', 'Došlo je do greške pri odjavi.');
    }
  };

  const imagesToDisplay = user?.gender === "Muško" ? maleImages :
  user?.gender === "Žensko" ? femaleImages :
  [{ id: "1", source: require("../assets/nalog.png") }];
  useEffect(() => {
    const defaultImage = getDefaultProfileImage();
    setProfileImage(defaultImage);
  }, []);

  useEffect(() => {
    const defaultImage = getDefaultProfileImage(user?.gender);
    setProfileImage(defaultImage);
  }, [user?.gender]);

  return (
    <ScrollView style={styles.scrollContainer}>
    <View style={styles.screen}>
      <TouchableOpacity style={styles.imageContainer} onPress={() => setIsModalVisible(true)}>
        <Image source={profileImage || getDefaultProfileImage(user?.gender)} style={styles.image} />
        <Text style={styles.editImageText}>Promijeni sliku</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.backButton}>
              <Image source={require("../assets/arrowBack.png")} style={styles.backArrow} />
            </TouchableOpacity>
            <FlatList
              data={imagesToDisplay}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleProfileImageChange(item.source)}>
                  <Image source={item.source} style={styles.modalImage} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Korišćenje Card komponente */}
      <Card style={styles.card}>
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
                // Provera da li je unos samo broj
                if (/^\d+$/.test(text)) {
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
                // Provera da li je unos validan broj
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
                // Provera da li je unos validan broj
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
      </Card>

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
    paddingBottom: 120,
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
    borderRadius: 20
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 12,
  },
  inputHalf: {
    width: "48%",
    marginRight: "4%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderContainer: {
    marginBottom: 20,
    flexDirection: 'row',  // Postavi dugmadi u horizontalni red 
    alignItems: 'center',
    justifyContent: 'center'
  },
  genderButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginHorizontal: 10, // Razmak između dugmadi
    width: 48,
  },
  selectedGenderButton: {
    backgroundColor: colors.primary,
  },
  genderIcon: {
    width: 36,  // Manje dimenzije za ikone
    height: 36,
    marginRight: 0, // Razmak između ikone i teksta
  },
  genderButtonText: {
    fontSize: 12, // Možda želiš smanjiti tekst da bude proporcionalan
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
    width: "80%",  // Modal širi širinu
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
});

export default PodesavanjaNaloga;
