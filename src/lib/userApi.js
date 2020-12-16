var loginUrl = "http://localhost:3000/login";

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
};

export { userApi as default };

