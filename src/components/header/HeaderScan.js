import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import gui from '../../lib/gui';
import LinearGradient from 'react-native-linear-gradient';
class HeaderScan extends Component {
    render() {
        let { source, titleHome } = this.props;
        return (
            <LinearGradient
                colors={gui.linearMain}
                style={styles.header}>
                <View style={styles.mainItem}>
                    <View style={styles.leftHeader}>
                        <Image source={{ uri: source }} style={styles.image} resizeMode={'cover'} />
                        <Text style={styles.titleTextHeader}>Xin chào {titleHome}</Text>
                    </View>
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: gui.navBarHeight,
        width: gui.screenWidth,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: gui.marginTop,
        paddingHorizontal: 16,
        backgroundColor: '#d86602'
    },
    mainItem: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleTextHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10
    },
    image: {
        height: 30,
        width: 30,
        borderRadius: 15,
    }
});

export default HeaderScan;
