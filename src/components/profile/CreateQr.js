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
                {/* <TextInput
                    style={[styles.input, { marginTop: 0 }]}
                    placeholder='Nhập phiên bản tạo mã (VD: 01-40)...'
                    placeholderTextColor="#a6a9b6"
                    onChangeText={(version) => this.setState({ version })}
                    value={this.state.version}
                    keyboardType={'numeric'}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                /> */}
                <TouchableOpacity style={styles.viewRow} onPress={() => this.setState({ showModal: true })}>
                    <Text>Chọn mức độ sửa lỗi: </Text>
                    <View style={[styles.viewChooseModal, { width: 'auto' }]}>
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
                                    // version: 3
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



// import React, { Component } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
// } from 'react-native';
// import { Actions } from 'react-native-router-flux';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { QRCode, Canvas } from 'easyqrcode-react-native';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { Map } from 'immutable';

// import Toast from "../toast/Toast";
// import CommonHeader from '../header/CommonHeader';
// import gui from '../../lib/gui';

// import * as globalActions from '../../reducers/global/globalActions';

// const actions = [
//     globalActions
// ];

// function mapStateToProps(state) {
//     return {
//         ...state
//     };
// }

// function mapDispatchToProps(dispatch) {
//     const creators = Map()
//         .merge(...actions)
//         .filter(value => typeof value === 'function')
//         .toObject();

//     return {
//         actions: bindActionCreators(creators, dispatch),
//         dispatch
//     };
// }
// class CreateQr extends Component {
//     constructor(props) {
//         super(props);


//         this.state = {

//         };
//     }
//     generateQRCode = (canvas) => {
//         if (canvas !== null) {
//             // QRCode options
//             var options = {
//                 // ====== Basic
//                 text: "CHECKIN AT PTIT",
//                 width: 256,
//                 height: 256,
//                 colorDark: "#000000",
//                 colorLight: "#ffffff",
//                 correctLevel: QRCode.CorrectLevel.H, // L, M, Q, H

//                 // ====== dotScale
//                 dotScale: 1, // For body block, must be greater than 0, less than or equal to 1. default is 1

//                 dotScaleTiming: 1, // Dafault for timing block , must be greater than 0, less than or equal to 1. default is 1
//                 dotScaleTiming_H: undefined, // For horizontal timing block, must be greater than 0, less than or equal to 1. default is 1
//                 dotScaleTiming_V: undefined, // For vertical timing block, must be greater than 0, less than or equal to 1. default is 1

//                 dotScaleA: 1, // Dafault for alignment block, must be greater than 0, less than or equal to 1. default is 1
//                 dotScaleAO: undefined, // For alignment outer block, must be greater than 0, less than or equal to 1. default is 1
//                 dotScaleAI: undefined, // For alignment inner block, must be greater than 0, less than or equal to 1. default is 1

//                 // ====== Quiet Zone
//                 quietZone: 0,
//                 quietZoneColor: "rgba(0,0,0,0)",

//                 // ====== Logo
//                 logo: "https://portal.ptit.edu.vn/wp-content/uploads/2016/04/ptit-logo.png",  //  support: Static Image Resources, Network Images, Base64 Uri Data Images
//                 logoWidth: 80, // width. default is automatic width
//                 logoHeight: 80, // height. default is automatic height
//                 logoBackgroundColor: '#fffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
//                 logoBackgroundTransparent: false, // Whether use transparent image, default is false

//                 // ====== Backgroud Image
//                 backgroundImage: '', // support: Static Image Resources, Network Images, Base64 Uri Data Images
//                 backgroundImageAlpha: 1, // Background image transparency, value between 0 and 1. default is 1. 
//                 autoColor: false, // Automatic color adjustment(for data block)
//                 autoColorDark: "rgba(0, 0, 0, .6)", // Automatic color: dark CSS color
//                 autoColorLight: "rgba(255, 255, 255, .7)", // Automatic color: light CSS color

//                 // ====== Colorful
//                 // === Posotion Pattern(Eye) Color
//                 PO: '#e1622f', // Global Posotion Outer color. if not set, the defaut is `colorDark`
//                 PI: '#aa5b71', // Global Posotion Inner color. if not set, the defaut is `colorDark`
//                 PO_TL: '', // Posotion Outer color - Top Left 
//                 PI_TL: '', // Posotion Inner color - Top Left 
//                 PO_TR: '', // Posotion Outer color - Top Right 
//                 PI_TR: '', // Posotion Inner color - Top Right 
//                 PO_BL: '', // Posotion Outer color - Bottom Left 
//                 PI_BL: '', // Posotion Inner color - Bottom Left 
//                 // === Alignment Color
//                 AO: '', // Alignment Outer. if not set, the defaut is `colorDark`
//                 AI: '', // Alignment Inner. if not set, the defaut is `colorDark`
//                 // === Timing Pattern Color
//                 timing: '#e1622f', // Global Timing color. if not set, the defaut is `colorDark`
//                 timing_H: '', // Horizontal timing color
//                 timing_V: '', // Vertical timing color

//                 // ====== Title
//                 title: 'Test QR Code', // content 
//                 titleFont: "bold 18px Arial", //font. default is "bold 16px Arial"
//                 titleColor: "#004284", // color. default is "#000"
//                 titleBackgroundColor: "#fff", // background color. default is "#fff"
//                 titleHeight: 70, // height, including subTitle. default is 0
//                 titleTop: 25, // draws y coordinates. default is 30

//                 // ====== SubTitle
//                 subTitle: 'CHECKIN AT PTIT', // content
//                 subTitleFont: "14px Arial", // font. default is "14px Arial"
//                 subTitleColor: "#004284", // color. default is "4F4F4F"
//                 subTitleTop: 45, // draws y coordinates. default is 0

//                 // ===== Event Handler
//                 onRenderingStart: undefined,
//                 onRenderingEnd: undefined,

//                 // ===== Versions
//                 version: 2, // The symbol versions of QR Code range from Version 1 to Version 40. default 0 means automatically choose the closest version based on the text length.

//                 // ===== Binary(hex) data mode
//                 binary: false // Whether it is binary mode, default is text mode. 
//             }
//             // Create QRCode Object
//             var qrCode = new QRCode(canvas, options);
//         }
//     }

//     render() {
//         return (
//             <View style={styles.container}>
//                 {this._renderHeader()}
//                 {this._renderBody()}
//                 <Toast
//                     ref="toastTop"
//                     position='top'
//                     positionValue={70}
//                     fadeInDuration={1000}
//                     fadeOutDuration={2000}
//                     opacity={0.85}
//                     textStyle={{ color: 'white', fontWeight: '600', textAlign: 'center' }}
//                 />
//             </View>
//         );
//     }
//     _renderHeader() {
//         return (
//             <CommonHeader
//                 title={"Tạo mã QR"}
//                 leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
//                 onPressLeft={() => Actions.pop()}
//             />
//         );
//     }
//     _renderBody() {
//         let { value, selectedError, selectedMode, check, version } = this.state;
//         return (
//             <KeyboardAwareScrollView
//                 style={{ flex: 1, width: '100%' }}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <Canvas ref={this.generateQRCode} />

//             </KeyboardAwareScrollView>
//         );
//     }

// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     body: {
//         flex: 1,
//     },
//     viewRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: gui.screenWidth - 32,
//         marginLeft: 16,
//         marginTop: 20,
//     },
//     input: {
//         height: 46,
//         width: gui.screenWidth - 32,
//         marginLeft: 16,
//         borderRadius: 5,
//         overflow: 'hidden',
//         color: '#000',
//         borderWidth: 1,
//         borderColor: '#34626c',
//         backgroundColor: 'white',
//         marginTop: 20,
//         marginBottom: 10,
//         paddingHorizontal: 16
//     },
//     viewRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginLeft: 16,
//         width: gui.screenWidth - 32,
//     },
//     viewChooseModal: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         width: 40,
//         height: 30,
//         marginLeft: 10,
//         padding: 5,
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: '#34626c',
//     },
//     viewButton: {
//         height: 40,
//         width: gui.screenWidth - 32,
//         marginLeft: 16,
//         marginTop: 15,
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#34626c'
//     },
//     footerText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     viewQR: {
//         marginTop: 50,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
// });
// export default connect(mapStateToProps, mapDispatchToProps)(CreateQr);


