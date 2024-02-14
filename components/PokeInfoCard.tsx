import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PokeCardProps {
    id: string;
    name: string;
    imageUrl: string;
    onPress: () => void;
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: "#fff8dc",
        opacity: 1,
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        elevation: 3,
        borderColor: "red",
        borderWidth: 1,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        maxWidth: '50%',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    textContainer: {
        padding: 5,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

const PokeInfoCard = React.memo<PokeCardProps>(({ id, name, imageUrl, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
});

export default PokeInfoCard;
