// Loading.js
import React from 'react'

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Firebase from '../firebase/FirebaseConfig';

export default class Loading extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            user ? Actions.Home() : Actions.Login();
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})