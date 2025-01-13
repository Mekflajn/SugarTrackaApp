import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const Card = props => {
    return(
        <View style={{...styles.container, ...props.style}}>
            <Text>{props.text} {props.children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: 'black',
        shadowOffset:{
            width: 0,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        backgroundColor: 'white',
        elevation: 5,
        padding: 20,
        borderRadius: 10,
    }
});

export default Card;