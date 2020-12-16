import cfg from '../../cfg';
//login
var loginUrl = cfg.api + "login";
var createUrl = cfg.api + "user/create";

//edit info
var getByIDUrl = cfg.api + "user/getByID";

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

    getByIDUrl(userID) {
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
                log.warn("Error in me", e);
            }
            );
    },
};

export { userApi as default };

