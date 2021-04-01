import settings from '../settings';
import adapter from '../utils/adapter';
import Cookies from 'universal-cookie';

export const authenticationService = {
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshLogin,
    getUserFromCookie
}

async function loginUser(email, password) {
    const url = `${settings.apiRoot}/api/registration/v1/user/authenticate`;

    const content = {
        email,
        password,
    };
    sessionStorage.removeItem('user');
    const response = await adapter.Post(url, content);

    if (!response.ok) {
        return null;
    } else {
        const result = await response.json();
        
        const user = {
            userName: result.data.user.userName,
            role : result.data.user.userType,
            id: result.data.user.id,
            operatorId: result.data.user.operatorId,
            token: result.data.idToken, 
            agentId: result.data.user.agentId           
        };

        const cookies = new Cookies();
        cookies.set('user', user, { maxAge: 86400 });
        sessionStorage.setItem("user", JSON.stringify(user));

        return user;
    }
}

async function refreshLogin() {
    
    const url = `${settings.apiRoot}/api/registration/v1/user/refreshToken`;

    const content = {
    };
    sessionStorage.removeItem('user');
    const response = await adapter.Post(url, content);

    if (!response.ok) {
        return null;
    } else {
        const result = await response.json();
        
        const user = {
            userName: result.data.user.userName,
            role : result.data.user.userType,
            id: result.data.user.id,
            operatorId: result.data.user.operatorId,
            token: result.data.idToken, 
            agentId: result.data.user.agentId           
        };

        sessionStorage.setItem("user", JSON.stringify(user));

        return user;
    }
}

function getUserFromCookie() {
    const cookies = new Cookies();
    const user = cookies.get('user');
    sessionStorage.setItem("user", JSON.stringify(user));
    return user;
}

function logoutUser() {
    sessionStorage.removeItem('user');
    const cookies = new Cookies();
    cookies.remove('user');
}

function getCurrentUser() {
    const currentUser = sessionStorage.getItem('user');
    if (currentUser !== null) {
        return JSON.parse(currentUser);
    }
    return null;
}

