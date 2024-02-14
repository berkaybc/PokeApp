import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../routeParams';

interface Card {
    id: string;
    name: string;
    images: { small: string };
}

const PokemonCardsList = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const fetchCards = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=10`);
            const data = await response.json();
            setCards([...cards, ...data.data]);
            setPage(page + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    return (
        <SafeAreaView>
            <FlatList
                data={cards}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('PokemonCardDetail', { cardId: item.id })}>
                        <View>
                            <Image source={{ uri: item.images.small }} style={{ width: 200, height: 200 }} />
                            <Text style={{ fontSize: 24 }}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                onEndReached={fetchCards}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
            />
        </SafeAreaView>
    );
};

export default PokemonCardsList;
