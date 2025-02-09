import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAppleAlt, faCarrot, faEgg, faBreadSlice } from '@fortawesome/free-solid-svg-icons';

const EdukacijaScreen = () => {

  const allLinks = [
    { text: 'Srpska asocijacija dijabetes', url: 'https://www.srpskadiabetes.org.rs/' },
    { text: 'Dijabetes info Srbija', url: 'https://www.dijabetes.rs/' },
    { text: 'Ministarstvo zdravlja Srbije', url: 'https://www.zdravlje.gov.rs/' },
    { text: 'Medicinske novosti', url: 'https://www.medicalnews.rs/' },
    { text: 'Dijabetologija Srbija', url: 'https://www.dijabetologija.rs/' },
    { text: 'Srpska dijabetološka društva', url: 'https://www.diabetes.org.rs/' },
    { text: 'Medicinska saveta', url: 'https://www.medicinas.rs/' },
    { text: 'Zdravstveni portal Srbije', url: 'https://www.srpskadiabetes.rs/' },
    { text: 'Savetodavni centar', url: 'https://www.savetodavnice.rs/' },
    { text: 'Dijabetološki centar', url: 'https://www.dijabetescentar.rs/' },

    { text: "Zdravstveni saveti za dijabetes u BiH", url: "https://www.diabetes.ba/" },
    { text: "Baza edukativnih resursa o dijabetesu", url: "https://www.zdravlje.gov.ba/" },
    { text: "Saveti za zdravu ishranu", url: "https://www.nutrition.gov.ba/" },
    { text: "Diabetes Info - BiH", url: "https://www.diabetesinfo.ba/" },
    { text: "Program za prevenciju dijabetesa u BiH", url: "https://www.prevencija.ba/" },
    { text: "Informacije o lečenju dijabetesa", url: "https://www.dijabetes.ba/" },
    { text: "Mreža podrške za osobe sa dijabetesom u BiH", url: "https://www.dijabetes-mreza.ba/" },
    { text: "Institut za zdravlje BiH - Resursi", url: "https://www.institutzdravlja.ba/" },
    { text: "Udruženje dijabetičara Bosne i Hercegovine", url: "https://www.udruzenjedijabeticara.ba/" },
    { text: "Web stranica za podršku pacijentima sa dijabetesom", url: "https://www.pacijenti.ba/" },

    { text: "Savetovalište za dijabetes u Srbiji", url: "https://www.dijabetes.org.rs/" },
    { text: "Zdravstveni resursi za dijabetičare u Srbiji", url: "https://www.zdravlje.gov.rs/" },
    { text: "Edukacija i resursi za zdravu ishranu", url: "https://www.zdravahrana.rs/" },
    { text: "Srbija bez dijabetesa - kampanja", url: "https://www.srbijabezdijabetesa.rs/" },
    { text: "Program prevencije dijabetesa", url: "https://www.prevencija.rs/" },
    { text: "Udruženje dijabetičara Srbije", url: "https://www.udruzenjedijabeticara.rs/" },
    { text: "Portal za edukaciju o dijabetesu", url: "https://www.dijabetes-portal.rs/" },
    { text: "Informacije o lečenju dijabetesa i terapijama", url: "https://www.lecenjedijabetesa.rs/" },
    { text: "Zdravlje i dijabetes u Srbiji", url: "https://www.zdravljeidijabetes.rs/" },
    { text: "Saveti i preporuke za osobe sa dijabetesom", url: "https://www.savetidijabetes.rs/" },
  ];

  const tips = [
    "Pijte dovoljno vode – Preporučuje se piti barem 8 čaša vode dnevno kako bi tijelo bilo hidrirano.",
    "Uzmite više vlakana – Povrće, voće, integralne žitarice su bogate vlaknima koja poboljšavaju varenje.",
    "Redovno mjerite nivo šećera – Redovno praćenje nivoa glukoze u krvi je ključno za osobe s dijabetesom.",
    "Izbjegavajte previše prerađene hrane – Smanjite unos prerađene hrane bogate šećerom i transmastima.",
    "Vježbajte svakodnevno – Aktivnosti poput šetnje, vožnje bicikla ili joge mogu pomoći u kontroliranju nivoa šećera.",
    "Obavezno se konsultujte s ljekarom – Redovne posjete ljekaru i praćenje zdravlja su od ključne važnosti.",
    "Smanjite unos alkohola – Alkohol može utjecati na nivo šećera u krvi, pa ga konzumirajte umjereno.",
    "Jedite manje porcije – Umjesto da jedete tri velika obroka dnevno, pokušajte s manjim, češćim obrocima.",
    "Održavajte zdravu tjelesnu masu – Kontrola težine može smanjiti rizik od razvoja dijabetesa tipa 2.",
    "Spavajte dovoljno – Nedostatak sna može utjecati na nivo šećera u krvi, zato se trudite da spavate 7-8 sati svake noći.",
    "Održavajte stres pod kontrolom – Stres može povisiti nivo šećera u krvi, pa praktikujte tehnike opuštanja.",
    "Kuvajte kod kuće – Samostalno pripremanje obroka omogućava vam bolju kontrolu nad sastojcima.",
    "Oduprite se iskušenju – Kada osjetite želju za nečim slatkim, pokušajte da izbjegnete grickalice i zamijenite ih voćem.",
    "Obratite pažnju na etikete hrane – Provjerite nutritivne vrijednosti i izbjegavajte hranu bogatu zasićenim mastima.",
    "Dodajte više omega-3 masnih kiselina u ishranu – Omega-3 masne kiseline, koje se nalaze u ribi i orašastim plodovima, mogu poboljšati zdravlje srca.",
    "Koristite manje soli – Prekomjeran unos soli može doprinijeti hipertenziji, pa se trudite da je konzumirate umjereno.",
    "Nosite udobnu obuću – Ako imate dijabetes, dobro je nositi obuću koja je udobna i koja ne izaziva povrede.",
    "Slušajte svoje tijelo – Ako osjetite bilo kakve simptome povezane s dijabetesom, obavezno se obratite ljekaru.",
    "Naučite se mjerenju krvnog pritiska – Redovno mjerenje krvnog pritiska može pomoći u prevenciji komplikacija.",
    "Podržite mentalno zdravlje – Posvetite pažnju i svom mentalnom zdravlju; meditacija, čitanje i razgovor s prijateljima mogu puno značiti."
  ];
  const books = [
    "Živjeti sa dijabetesom – Dr. Jane Doe",
    "Dijabetes i ishrana – John Smith",
    "Vodič kroz zdravu prehranu – Sarah Connor",
    "Kontrola šećera – Dr. Emily Green",
    "Zdrav život za dijabetičare – David Black",
  ];

  const stories = [
    "Kako sam naučila kontrolisati dijabetes - Marija",
    "Inspirativna priča: Povratak zdravom načinu života",
    "Život sa dijabetesom nije prepreka za sreću",
  ];

  const [randomTip, setRandomTip] = useState("");

  useEffect(() => {
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const [randomLinks, setRandomLinks] = useState([]);

  useEffect(() => {
    const getRandomLinks = (links, count) => {
      const shuffled = links.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    setRandomLinks(getRandomLinks(allLinks, 5));
  }, []);

  const foodCategories = [
    {
      title: 'Voće',
      icon: faAppleAlt,
      items: [
        { name: 'Jabuka', gi: 'Nizak GI (38)', info: 'Bogata vlaknima' },
        { name: 'Borovnice', gi: 'Nizak GI (53)', info: 'Antioksidansi' },
        { name: 'Kruška', gi: 'Nizak GI (38)', info: 'Dobar izvor vlakana' },
        { name: 'Narandža', gi: 'Srednji GI (43)', info: 'Vitamin C' },
        { name: 'Malina', gi: 'Nizak GI (25)', info: 'Antioksidansi' },
        { name: 'Jagoda', gi: 'Nizak GI (40)', info: 'Vitamin C' },
        { name: 'Breskva', gi: 'Nizak GI (42)', info: 'Vlakna' },
        { name: 'Šljiva', gi: 'Nizak GI (39)', info: 'Antioksidansi' },
        { name: 'Grejpfrut', gi: 'Nizak GI (25)', info: 'Vitamin C' },
        { name: 'Trešnja', gi: 'Nizak GI (22)', info: 'Antioksidansi' }
      ]
    },
    {
      title: 'Povrće',
      icon: faCarrot,
      items: [
        { name: 'Brokoli', gi: 'Vrlo nizak GI (15)', info: 'Bogat vitaminima' },
        { name: 'Karfiol', gi: 'Vrlo nizak GI (15)', info: 'Nizak CH' },
        { name: 'Zelena salata', gi: 'Vrlo nizak GI (15)', info: 'Niska kalorijska vrednost' },
        { name: 'Paradajz', gi: 'Nizak GI (30)', info: 'Likopen' },
        { name: 'Krastavac', gi: 'Vrlo nizak GI (15)', info: 'Hidratacija' },
        { name: 'Paprika', gi: 'Vrlo nizak GI (15)', info: 'Vitamin C' },
        { name: 'Šargarepa', gi: 'Nizak GI (35)', info: 'Beta karoten' },
        { name: 'Tikvice', gi: 'Vrlo nizak GI (15)', info: 'Nizak CH' },
        { name: 'Spanać', gi: 'Vrlo nizak GI (15)', info: 'Gvožđe' },
        { name: 'Kupus', gi: 'Vrlo nizak GI (15)', info: 'Vitamin K' }
      ]
    },
    {
      title: 'Proteini',
      icon: faEgg,
      items: [
        { name: 'Piletina', gi: 'Nema GI', info: 'Mršavo meso' },
        { name: 'Riba', gi: 'Nema GI', info: 'Omega-3' },
        { name: 'Jaja', gi: 'Nema GI', info: 'Kompletan protein' },
        { name: 'Ćuretina', gi: 'Nema GI', info: 'Nizak sadržaj masti' },
        { name: 'Tofu', gi: 'Vrlo nizak GI', info: 'Biljni protein' },
        { name: 'Sočivo', gi: 'Nizak GI (32)', info: 'Vlakna i protein' },
        { name: 'Grčki jogurt', gi: 'Nizak GI', info: 'Probiotici' },
        { name: 'Skuša', gi: 'Nema GI', info: 'Omega-3' },
        { name: 'Pasulj', gi: 'Nizak GI (29)', info: 'Vlakna' },
        { name: 'Leblebije', gi: 'Nizak GI (28)', info: 'Biljni protein' }
      ]
    },
    {
      title: 'Žitarice',
      icon: faBreadSlice,
      items: [
        { name: 'Ovas', gi: 'Srednji GI (55)', info: 'Bogat vlaknima' },
        { name: 'Kinoa', gi: 'Nizak GI (53)', info: 'Kompletan protein' },
        { name: 'Ječam', gi: 'Nizak GI (28)', info: 'Vlakna' },
        { name: 'Raž', gi: 'Nizak GI (34)', info: 'Vlakna' },
        { name: 'Heljda', gi: 'Nizak GI (54)', info: 'Bez glutena' },
        { name: 'Proso', gi: 'Srednji GI (71)', info: 'Minerali' },
        { name: 'Amarant', gi: 'Nizak GI (35)', info: 'Protein' },
        { name: 'Spelta', gi: 'Nizak GI (54)', info: 'Vitamin B' },
        { name: 'Kamut', gi: 'Nizak GI (45)', info: 'Protein' },
        { name: 'Bulgur', gi: 'Nizak GI (48)', info: 'Vlakna' }
      ]
    }
  ];

  const getRandomItems = (items) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.pozadina, paddingBottom: 100}}>
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Edukacija o Dijabetesu</Text>

        <Text style={styles.description}>Kliknite na linkove za korisne informacije:</Text>
        {randomLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkContainer}
            onPress={() => Linking.openURL(link.url)}>
            <Text style={styles.linkText}>{link.text}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.subtitle}>Nasumičan savjet:</Text>
        <Text style={styles.tip}>{randomTip}</Text>

        <Text style={styles.subtitle}>Knjige za edukaciju:</Text>
        <ScrollView horizontal style={styles.horizontalScroll}>
          {books.map((book, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>{book}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.subtitle}>Inspirativne priče:</Text>
        <ScrollView horizontal style={styles.horizontalScroll}>
          {stories.map((story, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>{story}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.subtitle}>Preporučene Namirnice:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {foodCategories.map((category, index) => (
            <View key={index} style={styles.foodCategoryCard}>
              <View style={styles.categoryHeader}>
                <FontAwesomeIcon icon={category.icon} size={20} color={colors.primary} />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              {getRandomItems(category.items).map((item, itemIndex) => (
                <View key={itemIndex} style={styles.foodItem}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodGi}>{item.gi}</Text>
                  <Text style={styles.foodInfo}>{item.info}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.pozadina,
  },

  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  linkContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: '600',
    textAlign: 'center'
  },
  tip: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    width: 200,
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
  },
  foodCategoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    width: 250,
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: colors.primary,
  },
  foodItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  foodGi: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  foodInfo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default EdukacijaScreen;
