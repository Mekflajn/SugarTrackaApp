import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ScrollView, SafeAreaView } from "react-native";
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

const db = getFirestore(); // Koristimo Firestore

const defaultProfileImage =
    user?.gender === "Žensko"
      ? require("../assets/female_account.png")
      : user?.gender === "Muško"
      ? require("../assets/male_account.png")
      : require("../assets/nalog.png");

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

  return (
    <ScrollView style={styles.scrollContainer}>
    <View style={styles.screen}>
      <TouchableOpacity style={styles.imageContainer}>
        <Image source={defaultProfileImage} style={styles.image} />
        <Text style={styles.editImageText}>Promijeni sliku</Text>
      </TouchableOpacity>

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
                onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
              />
              <TextInput
                style={[styles.input, styles.inputHalf]}
                value={updatedData.surname}
                placeholder="Prezime"
                onChangeText={(text) => setUpdatedData({ ...updatedData, surname: text })}
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
                onPress={() => setUpdatedData({ ...updatedData, gender: "Muško" })}
              >
                <Text style={styles.genderButtonText}>Muško</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, updatedData.gender === "Žensko" && styles.selectedGenderButton]}
                onPress={() => setUpdatedData({ ...updatedData, gender: "Žensko" })}
              >
                <Text style={styles.genderButtonText}>Žensko</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, updatedData.gender === "Nije navedeno" && styles.selectedGenderButton]}
                onPress={() => setUpdatedData({ ...updatedData, gender: "Nije navedeno" })}
              >
                <Text style={styles.genderButtonText}>Ne želim da navodim</Text>
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
              onChangeText={(text) => setUpdatedData({ ...updatedData, age: text })}
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
              onChangeText={(text) => setUpdatedData({ ...updatedData, weight: text })}
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
              onChangeText={(text) => setUpdatedData({ ...updatedData, height: text })}
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  genderButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  genderButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedGenderButton: {
    backgroundColor: colors.primary,
  },
  editButton: {
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 10
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
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
    backgroundColor: "#ff9800",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 10
  },
  logoutIcon: {
    width: 20,
    height: 20,
  },
  editDugmad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default PodesavanjaNaloga;
