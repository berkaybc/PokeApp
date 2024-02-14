import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, SafeAreaView } from 'react-native';
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

    if (!card) return <Text>Loading...</Text>;
    return (
        <SafeAreaView>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <View>
                <Image source={{ uri: card.images.large }} style={{ width: 200, height: 280 }} />
                <Text>Name: {card.name}</Text>
                <Text>Type: {card.types.join(', ')}</Text>
                <Text>HP: {card.hp}</Text>
                {card.abilities && (
                    <View>
                        <Text>Abilities:</Text>
                        {card.abilities.map((ability, index) => (
                            <Text key={index}>{ability.name}: {ability.text}</Text>
                        ))}
                    </View>
                )}
                <Button title={isSaved ? 'Remove Card' : 'Save Card'} onPress={toggleSaveCard} />
            </View>
        </SafeAreaView>
    );
};

export default PokemonCardDetail;
