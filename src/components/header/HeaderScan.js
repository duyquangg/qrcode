import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import gui from '../../lib/gui';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/MaterialIcons';
class HeaderScan extends Component {
    render() {
        let { source, titleScan, onPressRight } = this.props;
        let image = require('../../assets/images/user.png');
        return (
            <LinearGradient
                colors={gui.linearMain}
                style={styles.header}>
                <View style={styles.mainItem}>
                    <View style={styles.leftHeader}>
                        {source == null ?
                            <Image source={image} style={styles.image} resizeMode={'cover'} />
                            :
                            <Image source={{ uri: source }} style={styles.image} resizeMode={'cover'} />
                        }
                        <Text style={styles.titleTextHeader}>Xin chào {titleScan}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onPressRight}
                        style={styles.viewRight}>
                        <FontAwesome name={"add"} color={'#fff'} size={25}  />
                    </TouchableOpacity>
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
    },
    viewRight: {
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
});

export default HeaderScan;
