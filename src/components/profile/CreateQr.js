import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';

import * as globalActions from '../../reducers/global/globalActions';

const actions = [
    globalActions
];

function mapStateToProps(state) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch) {
    const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}
class CreateQr extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderBody()}
                <Toast
                    ref="toastTop"
                    position='top'
                    positionValue={70}
                    fadeInDuration={1000}
                    fadeOutDuration={2000}
                    opacity={0.85}
                    textStyle={{ color: 'white', fontWeight: '600', textAlign: 'center' }}
                />
            </View>
        );
    }
    _renderHeader() {
        return (
            <CommonHeader
                title={"Tạo mã QR"}
                leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
                onPressLeft={() => Actions.pop()}
            />
        );
    }
    _renderBody() {
        let image = require('../../assets/images/ptit.png');
        return (
            <View style={styles.body}>
                <View style={styles.viewQR}>
                    <QRCode
                        value="HELLO WORLD"
                        size={200}
                        ecl={'Q'}
                        // logo={image}
                        // logoSize={50}
                        getRef={(c) => (this.svg = c)}
                    />
                </View>
            </View>
        );
    }
    getDataURL() {
        this.svg.toDataURL(this.callback.bind(this));
    }

    callback(dataURL) {
        console.log(dataURL);
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        flex: 1,
    },
    viewQR: {
        marginTop:100,
        marginLeft:50
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateQr);