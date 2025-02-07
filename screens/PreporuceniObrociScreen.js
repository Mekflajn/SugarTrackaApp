import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import colors from "../constants/colors";

const PreporuceniObrociScreen = () => {
  const allMeals = [
    { name: "Piletina sa povrćem", link: "https://www.coolinarika.com/recept/piletina-sa-povrcem/" },
    { name: "Losos sa brokolijem", link: "https://www.coolinarika.com/recept/losos-sa-brokolijem/" },
    { name: "Omlet sa šampinjonima", link: "https://web.coolinarika.com/recept/omlet-sa-sampinjonima-d2e26168-6182-11eb-8243-0242ac120030" },
    { name: "Zeleni smoothie", link: "https://njam.ba/recept/zeleni-smoothie/" },
    { name: "Pečeni bataci", link: "https://web.coolinarika.com/recept/peceni-bataci-1b539d30-6440-11eb-85d9-0242ac1200d1" },
    { name: "Supa od povrća", link: "https://web.coolinarika.com/recept/supa-od-povrca-2cfccef2-6446-11eb-bee8-0242ac12001d" },
    { name: "Avokado tost", link: "https://recepti.index.hr/recept/1629-avokado-tost" },
    { name: "Salata sa tunjevinom", link: "https://www.espreso.co.rs/lifestyle/zivot/1410098/recept-za-posnu-salatu-sa-tunjevinom" },
    { name: "Grilovani pileći fileti", link: "https://www.recepti.com/kuvar/glavna-jela/22790-grilovani-pileci-file-sa-bosiljkom" },
    { name: "Pasta sa paradajz sosom", link: "https://web.coolinarika.com/recept/pasta-sa-sampinjon-paradajz-sosom-79f567de-638b-11eb-8f61-0242ac120035" },
    { name: "Smoothie bowl", link: "https://www.coolinarika.com/recept/g-blue-pink-smoothie-bowl-91743864-638f-11eb-b4ec-0242ac120052" },
    { name: "Quinoa salata", link: "https://www.coolinarika.com/recept/quinoa-salata/" },
    { name: "Pečeni povrtni ražnjići", link: "https://www.coolinarika.com/blog/kuhanje/povrtni-raznjici-c8f3e8e0-610d-11eb-841c-0242ac12004e" },
    { name: "Jaja na oko sa povrćem", link: "https://lifepressmagazin.com/kulinarstvo-2/dorucak-2/jaja-na-oko-sa-povrcem/" },
    { name: "Grčki jogurt sa voćem", link: "https://njam.ba/recept/grcki-jogurt-sa-sumskim-vocem-i-muslijem/#google_vignette" },
    { name: "Salata sa piletinom", link: "https://web.coolinarika.com/recept/pileca-salata-a61753aa-6489-11eb-a789-0242ac12002a" },
    { name: "Zeleni smoothie sa spirulinom", link: "https://n1info.hr/magazin/cooking/recept-jutarnji-zeleni-smoothie-2/" },
    { name: "Pohovana riba sa povrćem", link: "https://www.nezavisne.com/zivot-stil/recept_dana/Riba-sa-povrcem/711057" },
    { name: "Grilovani tofu", link: "https://www.danas.rs/zivot/vege-recept-grilovani-tofu/" },
    { name: "Zobene pahuljice sa voćem", link: "https://njam.ba/recept/zobene-pahuljice-sa-sumskim-vocem/" }
  ];

  const [randomMeals, setRandomMeals] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const getRandomMeals = () => {
    const shuffledMeals = [...allMeals];
    for (let i = shuffledMeals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledMeals[i], shuffledMeals[j]] = [shuffledMeals[j], shuffledMeals[i]];
    }
    setRandomMeals(shuffledMeals.slice(0, 5)); 
  };

  useEffect(() => {
    getRandomMeals();
  }, []);

  const openLink = (link) => {
    Linking.openURL(link).catch((err) => console.error("Error opening link: ", err));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.pozadina, paddingBottom: 110}}>
    <FlatList
      contentContainerStyle={styles.screen}
      data={randomMeals}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Preporučeni Obroci</Text>
          <Text style={styles.description}>
            Ovde možete naći neke preporučene obroke za dijabetičare i sve one koji žele zdravu ishranu.
          </Text>
        </>
      }
      renderItem={({ item, index }) => (
        <TouchableOpacity key={index} onPress={() => openLink(item.link)}>
          <View style={styles.mealCard}>
            <Text style={styles.mealText}>{item.name}</Text>
            <Text style={styles.linkText}>{item.link}</Text>
          </View>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <>
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text style={styles.showAllText}>{showAll ? "Sakrijte" : "Prikaži sve recepte"}</Text>
          </TouchableOpacity>

          {showAll && (
            <FlatList
              data={allMeals}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openLink(item.link)}>
                  <View style={styles.mealCard}>
                    <Text style={styles.mealText}>{item.name}</Text>
                    <Text style={styles.linkText}>{item.link}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </>
      }
    />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.pozadina,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  mealCard: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  mealText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: 'center'
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
    textAlign: 'center'
  },
  showAllText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
    marginVertical: 10,
    textDecorationLine: "underline",
  },
});

export default PreporuceniObrociScreen;
