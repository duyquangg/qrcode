import React, { Component } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import gui from '../../lib/gui';
import Loader from '../icons/Loader';
import Toast from '../toast/Toast';
import CommonHeader from '../header/CommonHeader';
import moment from 'moment';
import * as globalActions from '../../reducers/global/globalActions';
import userApi from '../../lib/userApi';

class AddReason extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            reason: '',
            typeReason: 'leave',
            showDate1: false,
            valueDate1: new Date().getTime(),
            showDate2: false,
            valueDate2: new Date().getTime(),
        }
    }
    _renderHeader = () => {
        return (
            <CommonHeader
                title={"Báo nghỉ / Đi muộn"}
                leftContent={<FontAwesome name={'chevron-left'} color={'#fff'} size={20} />}
                onPressLeft={() => Actions.pop()}
            />
        )
    };
    _renderBody = () => {
        let { typeReason } = this.state;
        let oval = require('../../assets/images/oval-copy.png');
        let ovalNone = require('../../assets/images/ovalNone.png');
        let _renderTypeReason = (type, title) => {
            return (
                <TouchableOpacity
                    style={styles.viewChooseSex}
                    onPress={() => {
                        this.setState({ typeReason: type });
                    }}
                >
                    {typeReason == type
                        ? <Image source={oval} />
                        : <Image source={ovalNone} />}
                    <Text style={styles.sexText}>{title}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.labelText}>Chọn lý do</Text>
                <View style={styles.viewChoose}>
                    {_renderTypeReason('leave', 'Báo nghỉ')}
                    {_renderTypeReason('late', 'Đi muộn')}
                    <View />
                </View>
                <Text style={styles.labelText}>Từ ngày</Text>
                {this._renderFrom()}
                <Text style={[styles.labelText, { marginTop: -10 }]}>Đến ngày</Text>
                {this._renderTo()}
                <Text style={[styles.labelText, { marginTop: -10 }]}>Lý do</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#a6a9b6"
                    placeholder='Lý do...'
                    multiline
                    numberOfLines={3}
                    onChangeText={(reason) => this.setState({ reason })}
                    value={this.state.reason}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </KeyboardAwareScrollView>
        )
    }
    _renderFrom() {
        const { showDate1, valueDate1 } = this.state;
        let calendar = require('../../assets/images/calendar.png');
        return (
            <View style={styles.viewChooseDate}>
                <TouchableOpacity
                    style={styles.viewChooseBOD}
                    onPress={this.datepicker1.bind(this)}
                >
                    <Text style={styles.titleTextBody}>{moment(valueDate1).format('DD/MM/YYYY')}</Text>
                    <Image source={calendar} />
                </TouchableOpacity>
                <DateTimePickerModal
                    headerTextIOS={'Chọn ngày'}
                    confirmTextIOS={'Lưu'}
                    isDarkModeEnabled
                    locale="vn-VN" // Use "en_GB" here
                    cancelTextIOS={'Huỷ'}
                    isVisible={showDate1}
                    mode="date"
                    onConfirm={this.setDate1.bind(this)}
                    onCancel={() => this.setState({ showDate1: false })}
                />
            </View>
        );
    }
    setDate1 = (valueDate) => {
        let checkDate = moment(valueDate).format("DD/MM/YYYY");
        let now = moment(Date.now()).format('DD/MM/YYYY');
        if (checkDate < now) {
            this.refs.toastTop.show('Không được chọn nhỏ hơn ngày hiện tại!');
            return;
        };
        this.setState({
            valueDate1: checkDate ? valueDate : valueDate,
            showDate1: false
        });
    };

    datepicker1 = () => {
        this.setState({ showDate1: true })
    };
    _renderTo() {
        const { showDate2, valueDate2 } = this.state;
        let calendar = require('../../assets/images/calendar.png');
        return (
            <View style={styles.viewChooseDate}>
                <TouchableOpacity
                    style={styles.viewChooseBOD}
                    onPress={this.datepicker2.bind(this)}
                >
                    <Text style={styles.titleTextBody}>{moment(valueDate2).format('DD/MM/YYYY')}</Text>
                    <Image source={calendar} />
                </TouchableOpacity>
                <DateTimePickerModal
                    headerTextIOS={'Chọn ngày'}
                    confirmTextIOS={'Lưu'}
                    locale="vn-VN" // Use "en_GB" here
                    isDarkModeEnabled
                    cancelTextIOS={'Huỷ'}
                    isVisible={showDate2}
                    mode="date"
                    onConfirm={this.setDate2.bind(this)}
                    onCancel={() => this.setState({ showDate2: false })}
                />
            </View>
        );
    }
    setDate2 = (valueDate) => {
        let checkDate = moment(valueDate).format("DD/MM/YYYY");
        if (checkDate < this.state.valueDate1) {
            this.refs.toastTop.show('Không được chọn ngày nhỏ hơn ngày bắt đầu!');
            return;
        }
        this.setState({
            valueDate2: checkDate ? valueDate : valueDate,
            showDate2: false
        });
    };

    datepicker2 = () => {
        this.setState({ showDate2: true })
    };
    _renderFooter() {
        return (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.viewButton}
                    onPress={this.onSend.bind(this)}
                >
                    <Text style={styles.footerText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        )
    }
    onSend = () => {
        let { typeReason, reason, valueDate1, valueDate2 } = this.state;
        let start = new Date();

        // time start date
        let a = new Date(valueDate1);
        var year1 = a.getUTCFullYear();
        var month1 = a.getUTCMonth();
        var day1 = a.getUTCDate();
        var startHour1 =Date.UTC(year1,month1,day1,0,0,0,0); //onDate di muon

        //time end date
        let b = new Date(valueDate2);
        var year2 = b.getUTCFullYear();
        var month2 = b.getUTCMonth();
        var day2 = b.getUTCDate();
        var startHour2 =Date.UTC(year2,month2,day2,0,0,0,0);
        var endHour2 = startHour2 + 86400000 - 1;

        console.log('====> startHour1',startHour1);
        console.log('====> endHour2',endHour2);
        console.log('====> start',start);
        let check = typeReason == 'leave' ? 1 : 2;
        if (!reason) {
            this.refs.toastTop.show('Lý do không được để trống!');
            return;
        };
        this.setState({ loading: true });
        if (check == 1) {
            let dtoCreate = {
                userID: this.props.global.currentUser.userID,
                reason: check,
                note: reason.trim(),
                fromDate: startHour1,
                toDate: endHour2,
            }
            userApi.timeCreate(dtoCreate).then(e => {
                console.log('====> bao nghi', e);
                this.setState({
                    loading: false,
                }, () => {
                    Actions.pop();
                    this.props.doRefresh && this.props.doRefresh();
                })
            });
        } else {
            let dtoCreate = {
                userID: this.props.global.currentUser.userID,
                reason: check,
                note: reason.trim(),
                onDate: startHour1
            }
            userApi.timeCreate(dtoCreate).then(e => {
                console.log('====> den muon', e);
                this.setState({
                    loading: false,
                }, () => {
                    Actions.pop();
                    this.props.doRefresh && this.props.doRefresh();
                })
            });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderBody()}
                {this._renderFooter()}
                <Loader loading={this.state.loading} />
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    labelText: {
        fontSize: 12,
        color: '#627792',
        marginLeft: 16,
        marginTop: 20,
    },
    viewChoose: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    viewChooseSex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sexText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4b515d',
        marginLeft: 8,
    },
    input: {
        width: gui.screenWidth - 32,
        height: 100,
        color: '#000',
        marginHorizontal: 16,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#34626c',
        marginTop: 10,
    },
    viewChooseDate: {
        marginHorizontal: 16,
        height: 48,
        borderColor: '#34626c',
    },
    viewChooseBOD: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 14,
        justifyContent: 'space-between',
    },
    footer: {
        height: 68,
        width: gui.screenWidth,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        paddingTop: 8,
        backgroundColor: '#fff'
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewButton: {
        height: 48,
        width: gui.screenWidth - 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34626c'
    },
})

const actions = [
    globalActions
];
const mapDispatchToProps = dispatch => {
    const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddReason)