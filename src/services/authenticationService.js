import settings from '../settings';
import adapter from '../utils/adapter';

export const authenticationService = {
    loginUser,
    logoutUser,
    getCurrentUser
}

async function loginUser(email, password) {
    const url = `${settings.apiRoot}/api/registration/v1/user/authenticate`;

    const content = {
        email,
        password,
    };

    const response = await adapter.Post(url, content);

    if (!response.ok) {
        return null;
    } else {
        const result = await response.json();

        const user = {
            userName: result.data.user.userName,
            role : result.data.user.userType,
            token: result.data.idToken, 
            id: result.data.user.id           
        };

        sessionStorage.setItem("user", JSON.stringify(user));

        return user;
    }
}

function logoutUser() {
    sessionStorage.removeItem('user');
}

function getCurrentUser() {
    const currentUser = sessionStorage.getItem('user');
    if (currentUser !== null) {
        return JSON.parse(currentUser);
    }
    return null;
}

