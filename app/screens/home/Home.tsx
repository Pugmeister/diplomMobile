import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';

type HomeScreenNavigationProp = StackNavigationProp<any, 'Главная'>;

const Home = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return (
        <ImageBackground 
            source={require('../../images/home-background.jpg')} 
            style={styles.backgroundImage}
        >
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Animatable.Text animation="fadeInDown" style={styles.welcomeText}>
                    РАДЫ ПРИВЕТСТВОВАТЬ В НАШЕМ СПА-САЛОНЕ
                </Animatable.Text>
                <Animatable.View animation="fadeInUp" style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('Услуги')}
                    >
                        <Text style={styles.buttonText}>Записаться</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        backgroundColor: '#3CB371',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#3CB371',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
});

export default Home;
