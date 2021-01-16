import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Toast from "../toast/Toast";
import CommonHeader from '../header/CommonHeader';
import gui from '../../lib/gui';
import userApi from '../../lib/userApi';
import Loader from '../icons/Loader';

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
class InfoUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUser: [],
        };
    }
    componentDidMount() {
        this.fetchData();
    };
    fetchData = async () => {
        let dto = {
            role: this.props.global.currentUser.role,
        }
        let resAllUser = await userApi.getAllUser(dto);
        this.setState({
            dataUser: resAllUser,
        })
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
        let { dataUser } = this.state;
        return (
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={this.fetchData.bind(this)}
                        tintColor={'#34626c'}
                    />
                }
                style={{ backgroundColor: '#fff', flex: 1 }}
                contentContainerStyle={{ marginHorizontal: 16 }}
                data={dataUser}
                renderItem={({ item, index }) => {
                    return (
                        <FlatListItem item={item} index={index}
                            doRefreshData={this.fetchData.bind(this)}
                        />
                    );
                }}
                keyExtractor={(item, index) => item.id.toString()}
                // ListFooterComponent={this.ListFooterComponent()}
                // ListHeaderComponent={() => {
                //   return (
                //     <Text>vv</Text>
                //   )
                // }}
                removeClippedSubviews={false}
                enableEmptySections
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={10}
                initialListSize={20}
                onEndReachedThreshold={0}
            // onEndReached={debounce(this.onEndReached.bind(this), 300)}
            />
        );
    }
}
class FlatListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }
    render() {
        let { item, index } = this.props;
        console.log('===> newItem', item);
        return (
            <View>
                <View style={styles.viewRow}>
                    <Text>{item.email}</Text>
                    <View style={styles.viewInfo}>
                        <TouchableOpacity>
                            <FontAwesome name={'info-circle'} size={18} color={'#34626c'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 12 }} onPress={this.onDeleteAcc.bind(this, item)}>
                            <FontAwesome name={'times'} size={18} color={'#c70039'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.viewLine} />
                <Loader loading={this.state.loading} />
            </View>
        )
    };
    onDeleteAcc = (item) => {
        Alert.alert('Thông báo', 'Bạn có muốn xoá tài khoản này?', [
            {
                text: 'Huỷ',
                onPress: () => console.info('Cancel Pressed'),
            },
            {
                text: 'OK',
                onPress: () => this.onPressDelete(item)
            }
        ],
            { cancelable: false },
        )
    };
    onPressDelete = async (item) => {
        this.setState({ loading: true });
        await userApi.deleteByID({ userID: item.id })
            .then(() => {
                Alert.alert('Thông báo', 'Xoá tài khoản thành công!');
                this.setState({ loading: false }, () => this.props.doRefreshData && this.props.doRefreshData());
            })
            .catch((e) => console.log('====> Lỗi xoá tài khoản', e));
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    viewRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    viewInfo: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    viewLine: {
        height: 1,
        marginTop: 10,
        backgroundColor: '#e8eae6',
        marginHorizontal: -16
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(InfoUser);