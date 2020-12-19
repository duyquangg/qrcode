import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import gui from '../../lib/gui';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
class HeaderScan extends Component {
    render() {
        let { source, titleScan } = this.props;
        let image = require('../../assets/images/user.png');
        return (
            <LinearGradient
                colors={gui.linearMain}
                style={styles.header}>
                <View style={styles.mainItem}>
                    <View style={styles.leftHeader}>
                        {source == '' ?
                            <Image source={image} style={styles.image} resizeMode={'cover'} />
                            :
                            <Image source={{ uri: source }} style={styles.image} resizeMode={'cover'} />
                        }
                        <Text style={styles.titleTextHeader}>Xin chào {titleScan}</Text>
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
        fontWeight: '700',
        color: '#fff',
        marginLeft: 15
    },
    image: {
        height: 32,
        width: 32,
        borderRadius: 16,
    }
});

export default HeaderScan;
