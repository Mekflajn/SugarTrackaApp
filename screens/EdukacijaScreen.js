import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../constants/colors';

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

  return (
    <View style={{flex: 1, backgroundColor: colors.pozadina, paddingBottom: 110}}>
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
});

export default EdukacijaScreen;
