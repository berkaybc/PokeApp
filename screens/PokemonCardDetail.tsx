import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, SafeAreaView, Dimensions, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../routeParams';

interface CardDetails {
    id: string;
    name: string;
    types: string[];
    hp: string;
    abilities: [{ name: string; text: string }];
    images: { large: string };
}
type PokemonCardDetailRouteProp = RouteProp<RootStackParamList, 'PokemonCardDetail'>;
interface PokemonCardDetailProps {
    route: PokemonCardDetailRouteProp;
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    backButton: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        fontSize: 24
    },
    container: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        width: width * 0.45,
        height: width * 0.6,
        resizeMode: 'contain',
    },
    text: {
        fontSize: width < 768 ? 18 : 24,
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    abilitiesContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
    },
});

const PokemonCardDetail: React.FC<PokemonCardDetailProps> = ({ route }) => {
    const navigation = useNavigation();
    const { cardId } = route.params;
    const [card, setCard] = useState<CardDetails | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const fetchCardDetails = async () => {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`);
        const data = await response.json();
        setCard(data.data);
        checkCardSaved(data.data.id);
    };

    const checkCardSaved = async (id: string) => {
        const savedCards = await AsyncStorage.getItem('savedCards');
        setIsSaved(savedCards ? savedCards.split(',').includes(id) : false);
    };

    const toggleSaveCard = async () => {
        const savedCards = await AsyncStorage.getItem('savedCards');
        let newSavedCards = savedCards ? savedCards.split(',') : [];
        if (isSaved) {
            newSavedCards = newSavedCards.filter((savedCardId) => savedCardId !== card?.id);
        } else {
            if (card?.id) {
                newSavedCards.push(card?.id);
            }
        }
        await AsyncStorage.setItem('savedCards', newSavedCards.join(','));
        setIsSaved(!isSaved);
    };

    useEffect(() => {
        fetchCardDetails();
    }, [cardId]);

    if (!card) return <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
    </View>;
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.backButton}>
                    <Button title="Back" onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: card.images.large }} style={styles.image} />
                    <Text style={styles.text}>Name: {card.name}</Text>
                    <Text style={styles.text}>Type: {card.types.join(', ')}</Text>
                    <Text style={styles.text}>HP: {card.hp}</Text>
                    {card.abilities && (
                        <View style={styles.abilitiesContainer} >
                            {card.abilities.map((ability, index) => (
                                <Text key={index} style={styles.text}>{ability.name}: {ability.text}</Text>
                            ))}
                        </View>
                    )}
                    <View style={styles.button}>
                        <Button title={isSaved ? 'Remove Card' : 'Save Card'} onPress={toggleSaveCard} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PokemonCardDetail;
