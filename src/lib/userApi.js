import cfg from '../../cfg';
//login
var loginUrl = cfg.api + "login";
var createUrl = cfg.api + "user/create";

//info user
var getByIDUrl = cfg.api + "user/getByID";
var updateByIDUrl = cfg.api + "user/updateByID";
var deleteByIDUrl = cfg.api + "user/deleteByID";

//timeLine
var timeCreateUrl = cfg.api + "timeLine/create";
var timeGetByUserIDUrl = cfg.api + "timeLine/getByUserID";
var timeUpdateByIDUrl = cfg.api + "timeLine/updateByID";
var getHistoryUrl = cfg.api + "timeLine/getHistory";

//admin
var getAllUserURL = cfg.api + "user/search";

var userApi = {
    login(email, password) {
        var params = {
            'email': email,
            'password': password,
        };
        // console.log("fetch =======  loginUrl", loginUrl, params);

        return fetch(`${loginUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in login", e);
            });
    },
    register(email, password, fullName) {
        return fetch(`${createUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, fullName }),
        })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log('Error in register:' + e)
            });
    },

    getByID(userID) {
        // console.log('========= CALL getByIDUrl======', userID);
        return fetch(getByIDUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userID
                },
                body: JSON.stringify(userID)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in getByID", e);
            }
            );
    },
    updateByID(id) {
        // console.log('========= CALL updateByIDUrl======', userID);
        return fetch(updateByIDUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + id
                },
                body: JSON.stringify(id)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in updateByID", e);
            }
            );
    },
    timeGetByUserID(userID) {
        // console.log('========= CALL timeGetByUserIDUrl======', userID);
        return fetch(timeGetByUserIDUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userID
                },
                body: JSON.stringify(userID)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in timeGetByUserID", e);
            }
            );
    },
    timeCreate(userID) {
        // console.log('========= CALL timeCreateUrl======', userID);
        return fetch(timeCreateUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userID
                },
                body: JSON.stringify(userID)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in timeCreate", e);
            }
            );
    },
    timeUpdateByID(id) {
        // console.log('========= CALL timeUpdateByIDUrl======', userID);
        return fetch(timeUpdateByIDUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + id
                },
                body: JSON.stringify(id)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in timeUpdateByID", e);
            }
            );
    },
    getHistory(id) {
        // console.log('========= CALL getHistoryUrl======', userID);
        return fetch(getHistoryUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + id
                },
                body: JSON.stringify(id)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in getHistory", e);
            }
            );
    },
    getAllUser(dto) {
        // console.log('========= CALL getAllUserURL======', userID);
        return fetch(getAllUserURL,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + dto
                },
                body: JSON.stringify(dto)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in getAllUser", e);
            }
            );
    },
    deleteByID(dto) {
        // console.log('========= CALL deleteByIDUrl======', userID);
        return fetch(deleteByIDUrl,
            {
                method: 'POST',
                headers: {
                    "Accept": "*/*",
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + dto
                },
                body: JSON.stringify(dto)
            })
            .then(response => {
                return response.json()
            })
            .catch(e => {
                console.log("Error in deleteByID", e);
            }
            );
    },
};

export { userApi as default };

