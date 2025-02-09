import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faSearch, faFilter, faExternalLink, faRandom } from '@fortawesome/free-solid-svg-icons';
import colors from "../constants/colors";
import Card from '../components/Card';

const allMeals = [
    // Doručak
    { name: "Omlet sa šampinjonima", link: "https://web.coolinarika.com/recept/omlet-sa-sampinjonima-d2e26168-6182-11eb-8243-0242ac120030", type: "doručak" },
    { name: "Avokado tost", link: "https://recepti.index.hr/recept/1629-avokado-tost", type: "doručak" },
    { name: "Jaja na oko sa povrćem", link: "https://lifepressmagazin.com/kulinarstvo-2/dorucak-2/jaja-na-oko-sa-povrcem/", type: "doručak" },
    { name: "Zobene pahuljice sa voćem", link: "https://njam.ba/recept/zobene-pahuljice-sa-sumskim-vocem/", type: "doručak" },
    { name: "Grčki jogurt sa voćem", link: "https://njam.ba/recept/grcki-jogurt-sa-sumskim-vocem-i-muslijem/", type: "doručak" },

    // Ručak
    { name: "Piletina sa povrćem", link: "https://www.coolinarika.com/recept/piletina-sa-povrcem/", type: "ručak" },
    { name: "Pečeni bataci", link: "https://web.coolinarika.com/recept/peceni-bataci-1b539d30-6440-11eb-85d9-0242ac1200d1", type: "ručak" },
    { name: "Grilovani pileći fileti", link: "https://www.recepti.com/kuvar/glavna-jela/22790-grilovani-pileci-file-sa-bosiljkom", type: "ručak" },
    { name: "Pasta sa paradajz sosom", link: "https://web.coolinarika.com/recept/pasta-sa-sampinjon-paradajz-sosom-79f567de-638b-11eb-8f61-0242ac120035", type: "ručak" },
    { name: "Pohovana riba sa povrćem", link: "https://www.nezavisne.com/zivot-stil/recept_dana/Riba-sa-povrcem/711057", type: "ručak" },

    // Večera
    { name: "Losos sa brokolijem", link: "https://www.coolinarika.com/recept/losos-sa-brokolijem/", type: "večera" },
    { name: "Supa od povrća", link: "https://web.coolinarika.com/recept/supa-od-povrca-2cfccef2-6446-11eb-bee8-0242ac12001d", type: "večera" },
    { name: "Salata sa tunjevinom", link: "https://www.espreso.co.rs/lifestyle/zivot/1410098/recept-za-posnu-salatu-sa-tunjevinom", type: "večera" },
    { name: "Grilovani tofu", link: "https://www.danas.rs/zivot/vege-recept-grilovani-tofu/", type: "večera" },
    { name: "Quinoa salata", link: "https://www.coolinarika.com/recept/quinoa-salata/", type: "večera" },

    // Užina
    { name: "Zeleni smoothie", link: "https://njam.ba/recept/zeleni-smoothie/", type: "užina" },
    { name: "Smoothie bowl", link: "https://www.coolinarika.com/recept/g-blue-pink-smoothie-bowl-91743864-638f-11eb-b4ec-0242ac120052", type: "užina" },
    { name: "Zeleni smoothie sa spirulinom", link: "https://n1info.hr/magazin/cooking/recept-jutarnji-zeleni-smoothie-2/", type: "užina" },
    { name: "Proteinske energetske kuglice", link: "https://www.coolinarika.com/recept/proteinske-energetske-kuglice-bez-secera-7c0c5286-6440-11eb-85d9-0242ac1200d1", type: "užina" },
    { name: "Voćna salata sa jogurtom", link: "https://www.coolinarika.com/recept/vocna-salata-s-jogurtom-9e1b1a76-63f2-11eb-b6df-0242ac120059", type: "užina" }
];

const PreporuceniObrociScreen = () => {
    const [selectedType, setSelectedType] = useState('sve');
    const [showAll, setShowAll] = useState(false);

    const getFilteredMeals = () => {
        if (selectedType === 'sve') {
            return allMeals;
        }
        return allMeals.filter(meal => meal.type === selectedType);
    };

    const openLink = (link) => {
        Linking.openURL(link).catch((err) => console.error("Error opening link: ", err));
    };

    const renderMealCard = ({ item }) => (
        <TouchableOpacity onPress={() => openLink(item.link)}>
            <Card style={styles.mealCard}>
                <View style={styles.mealHeader}>
                    <FontAwesomeIcon icon={faUtensils} size={20} color={colors.primary} style={styles.mealIcon} />
                    <Text style={styles.mealText}>{item.name}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.linkButton}
                        onPress={() => openLink(item.link)}
                    >
                        <Text style={styles.linkButtonText}>Pogledaj recept</Text>
                        <FontAwesomeIcon icon={faExternalLink} size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.title}>Preporučeni Obroci</Text>
            </View>

            <View style={styles.filterSection}>
                <View style={styles.typeButtons}>
                    {['sve', 'doručak', 'ručak', 'večera', 'užina'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.typeButton,
                                selectedType === type && styles.selectedTypeButton
                            ]}
                            onPress={() => setSelectedType(type)}
                        >
                            <Text style={[
                                styles.typeButtonText,
                                selectedType === type && styles.selectedTypeText
                            ]}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={getFilteredMeals()}
                renderItem={renderMealCard}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pozadina,
    padding: 15,
    paddingBottom: 100,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    alignSelf: 'center',
  },
  filterSection: {
    marginBottom: 15,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeText: {
    color: 'white',
  },
  mealCard: {
    padding: 15,
    marginBottom: 12,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    width: '100%',
  },
  mealIcon: {
    marginRight: 10,
  },
  mealText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    minWidth: 160,
  },
  linkButtonText: {
    color: 'white',
    marginRight: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  showAllButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  showAllButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default PreporuceniObrociScreen;
