import settings from '../settings';
import Cookies from 'universal-cookie';

const adapter = {
    Post: async function (url, content) {
        try{
            var userSession = sessionStorage.getItem("user")
            var user = null
            if (userSession != 'undefined')
            {
                user = JSON.parse(sessionStorage.getItem("user"))
            }
            const apiKey = user ? user.token : settings.apiKey
        
            var response = await fetch(url, {
                    method: "POST",
                    headers: new Headers({
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json'                
                    }),
                    body: JSON.stringify(content),
                    credentials: 'same-origin',
                    mode:'cors',
                }
            );
            if (response.status === 401){
                sessionStorage.removeItem('user');
                const cookies = new Cookies();
                cookies.remove('user', {domain: '.timkoto.com', path: '/' }) 
                document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
                window.location = settings.appLogin
            }
            return response;
        }
        catch (err){
            sessionStorage.removeItem('user');
            const cookies = new Cookies();
            cookies.remove('user', {domain: '.timkoto.com', path: '/' })  
            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location = settings.appLogin
        }
    },
    Get: async function (url) {
        try{
            var userSession = sessionStorage.getItem("user")
            var user = null
            if (userSession != 'undefined')
            {
                user = JSON.parse(sessionStorage.getItem("user"))
            }
            const apiKey = user ? user.token : settings.apiKey
            var response = await fetch(url, {
                    method: "GET",
                    headers: new Headers({
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json'                
                        }),
                    credentials: 'same-origin',
                    mode:'cors',
                }
            );
            if (response.status === 401){
                sessionStorage.removeItem('user');
                const cookies = new Cookies();
                cookies.remove('user', {domain: '.timkoto.com', path: '/' })  
                document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location = settings.appLogin
            }
            return response;
        }
        catch (err){
            sessionStorage.removeItem('user');
            const cookies = new Cookies();
            cookies.remove('user', {domain: '.timkoto.com', path: '/' })  
            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location = settings.appLogin
        }
    }
}

export default adapter;