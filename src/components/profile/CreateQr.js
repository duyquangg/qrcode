import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import Modal from "react-native-modalbox";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
        let dataError = [
            {
                name: 'L',
                id: 1,
            },
            {
                name: 'M',
                id: 2,
            },
            {
                name: 'Q',
                id: 3,
            },
            {
                name: 'H',
                id: 4,
            },
        ];
        let dataMode = [
            {
                key: 'numeric',
                name: 'Kiểu số',
            },
            {
                key: 'alphanumeric',
                name: 'Kiểu chuỗi',
            },
            {
                key: 'byte',
                name: 'Kiểu nhị phân',
            },
            {
                key: 'kanji',
                name: 'Kiểu Nhật ngữ',
            },
        ];

        this.state = {
            value: '',
            showModal: false,
            dataError: dataError,
            selectedError: null,
            version: '',
            selectedMode: null,
            showModalMode: false,
            dataMode: dataMode,

            check: false
        };
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderBody()}
                {this._renderModal()}
                {this._renderModalMode()}
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
        let { value, selectedError, selectedMode, check, version } = this.state;
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity style={[styles.viewRow, { marginTop: 15 }]} onPress={() => this.setState({ showModalMode: true })}>
                    <Text>Chọn bộ chỉ chế độ: </Text>
                    <View style={[styles.viewChooseModal, { width: 'auto' }]}>
                        {selectedMode ? <Text>{selectedMode.name}</Text> : null}
                        <FontAwesome name={'angle-down'} size={18} style={{ marginLeft: 5 }} />
                    </View>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder='Nhập chuỗi giá trị cần tạo...'
                    // multiline
                    // numberOfLines={3}
                    placeholderTextColor="#a6a9b6"
                    onChangeText={(value) => this.setState({ value })}
                    value={this.state.value}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, { marginTop: 0 }]}
                    placeholder='Nhập phiên bản tạo mã (VD: 01-40)...'
                    placeholderTextColor="#a6a9b6"
                    onChangeText={(version) => this.setState({ version })}
                    value={this.state.version}
                    keyboardType={'numeric'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.viewRow} onPress={() => this.setState({ showModal: true })}>
                    <Text>Chọn mức độ sửa lỗi: </Text>
                    <View style={styles.viewChooseModal}>
                        {selectedError ? <Text>{selectedError.name}</Text> : null}
                        <FontAwesome name={'angle-down'} size={18} style={{ marginLeft: 5 }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewButton} onPress={this.createQRCode.bind(this)}>
                    <Text style={styles.footerText}>Tạo mã </Text>
                </TouchableOpacity>
                {check  && value.trim() !== '' ?
                    <View style={styles.viewQR}>
                        <QRCode
                            value={[
                                {
                                    data: value.trim(),
                                    mode: selectedMode.key,
                                    versions: 3
                                }
                            ]}
                            size={250}
                            ecl={selectedError.name}
                            onError={() => Alert.alert('Thông báo',`Chuỗi nhập vào không đúng định dạng là ${selectedMode.name}`)}
                        />
                    </View>
                    : null
                }
            </KeyboardAwareScrollView>
        );
    }
    createQRCode = () => {
        let { value, selectedError, selectedMode, version } = this.state;
        console.log('-===> version',version)
        if (!selectedMode) {
            return this.refs.toastTop.show('Bộ chỉ chế độ không được để trống!');
        };
        if (value == '') {
            return this.refs.toastTop.show('Chuỗi của bạn không được để trống!');
        };
        // if (!version) {
        //     return this.refs.toastTop.show('Phiên bản không được để trống!');
        // };
        if (!selectedError) {
            return this.refs.toastTop.show('Mức độ sửa lỗi không được để trống!');
        };
        this.setState({ check: true });
    }
    _renderModal = () => {
        let { showModal, dataError } = this.state;
        return (
            <Modal
                style={{
                    height: "auto",
                    width: gui.screenWidth - 16,
                    borderRadius: 10,
                }}
                position={"center"}
                isOpen={showModal}
                swipeToClose={true}
                backdropPressToClose={true}
                onClosed={() => {
                    this.setState({ showModal: false });
                }}
            >
                <View style={{ height: "auto" }}>
                    <FlatList
                        data={dataError}
                        renderItem={this._renderError.bind(this)}
                        keyExtractor={(item) => "_renderError" + item.name.toString()}
                    />
                </View>
            </Modal>
        );
    };
    _renderError = (item, index) => {
        let { selectedError } = this.state;
        let child = item.item;
        let check = selectedError && selectedError.id === child.id;
        let backgroundColor = check ? '#34626c' : '#fff';
        let color = check ? '#fff' : '#242833';
        return (
            <TouchableOpacity
                style={[{ backgroundColor, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 }]}
                onPress={() => {
                    this.setState({
                        showModal: false, selectedError: child,
                    });
                }}
            >
                <Text style={{ color, fontSize: 14 }}>{child.name}</Text>
            </TouchableOpacity>
        );
    };
    _renderModalMode = () => {
        let { showModalMode, dataMode } = this.state;
        return (
            <Modal
                style={{
                    height: "auto",
                    width: gui.screenWidth - 16,
                    borderRadius: 10,
                }}
                position={"center"}
                isOpen={showModalMode}
                swipeToClose={true}
                backdropPressToClose={true}
                onClosed={() => {
                    this.setState({ showModalMode: false });
                }}
            >
                <View style={{ height: "auto" }}>
                    <FlatList
                        data={dataMode}
                        renderItem={this._renderMode.bind(this)}
                        keyExtractor={(item) => "_renderMode" + item.name.toString()}
                    />
                </View>
            </Modal>
        );
    };
    _renderMode = (item, index) => {
        let { selectedMode } = this.state;
        let child = item.item;
        let check = selectedMode && selectedMode.key == child.key;
        let backgroundColor = check ? '#34626c' : '#fff';
        let color = check ? '#fff' : '#242833';
        return (
            <TouchableOpacity
                style={[{ backgroundColor, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 }]}
                onPress={() => {
                    this.setState({
                        showModalMode: false, selectedMode: child,
                    });
                }}
            >
                <Text style={{ color, fontSize: 14 }}>{child.name}</Text>
            </TouchableOpacity>
        );
    };
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
        marginTop: 15,
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