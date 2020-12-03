import AsyncStorage from '@react-native-community/async-storage';

var storageKeys = {
    LOGIN_INFO: '@QR:LOGIN_INFO'
};

class LocalStorage {
    setLoginInfo(loginObj) {
        return AsyncStorage.setItem(storageKeys.LOGIN_INFO, JSON.stringify(loginObj));
    };
    getLoginInfo() {
        return AsyncStorage.getItem(storageKeys.LOGIN_INFO).then(result => {
            // console.log('===> rs',result);
            return JSON.parse(result);
        })
    }
    removeLogin() {
        AsyncStorage.removeItem(storageKeys.LOGIN_INFO);
    }
}


let localStorage = new LocalStorage();

export default localStorage;
