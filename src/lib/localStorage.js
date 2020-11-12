import AsyncStorage from '@react-native-community/async-storage';

var storageKeys = {
    LOGIN_INFO : '@RELAND:LOGIN_INFO',
    SETTING : '@RELAND:SETTING',
    TOKEN_ID : '@RELAND:TOKEN_ID',
};

class LocalStorage {
    /*
     setting: {
     autoLoadAds : false,
     maxAdsInMapView: 25
     }
     */
    setSetting(setting) {
        return AsyncStorage.setItem(storageKeys.SETTING, JSON.stringify(setting));
    }

    getSetting() {
        return AsyncStorage.getItem(storageKeys.SETTING);
    }

    setTokenID(tokenID) {
        return AsyncStorage.setItem(storageKeys.TOKEN_ID, JSON.stringify(tokenID));
    }

    getTokenID() {
        return AsyncStorage.getItem(storageKeys.TOKEN_ID).then(ret => {
            return JSON.parse(ret);
        });
    }

    //{username, password, sessionCookie}
    setLoginInfo(loginObj) {
        return AsyncStorage.setItem(storageKeys.LOGIN_INFO, JSON.stringify(loginObj));
    }
    getLoginInfo() {
        return AsyncStorage.getItem(storageKeys.LOGIN_INFO).then(ret => {
            return JSON.parse(ret);
        });
    }
    removeLogin(){
        AsyncStorage.removeItem(storageKeys.LOGIN_INFO);
    }
}


let localStorage = new LocalStorage();

export default localStorage;