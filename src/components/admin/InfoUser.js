import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';
import userApi from '../../lib/userApi';

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
        this.fetchData();
    };
    fetchData = async () => {
        let resAllUser = await userApi.getAllUser({role: this.props.global.currentUser.role,});
        console.log('====> resAllUser',resAllUser);
    };
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
                title={"Thông tin thành viên"}
                leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
                onPressLeft={() => Actions.pop()}
                rightContent={<FontAwesome name={'plus'} color={'#fff'} size={20} />}
                onPressRight={() => Actions.AddUser()}
            />
        );
    }
    _renderBody() {
        let image = require('../../assets/images/ptit.png');
        let { value, selectedError } = this.state;
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="handled"
            >
               <Text>asdasd</Text>
            </KeyboardAwareScrollView>
        );
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
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: gui.screenWidth - 32,
        marginLeft: 16,
        marginTop: 20,
    },
    input: {
        height: 46,
        width: gui.screenWidth - 32,
        marginLeft: 16,
        borderRadius: 5,
        overflow: 'hidden',
        color: '#000',
        borderWidth: 1,
        borderColor: '#34626c',
        backgroundColor: 'white',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 16
    },
    viewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
        width: gui.screenWidth - 32,
    },
    viewChooseModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 40,
        height: 30,
        marginLeft: 10,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#34626c',
    },
    viewButton: {
        height: 40,
        width: gui.screenWidth - 32,
        marginLeft: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34626c'
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewQR: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(CreateQr);