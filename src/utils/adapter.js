import settings from '../settings';

const adapter = {
    Post: async function (url, content) {
        try{
            const user = JSON.parse(sessionStorage.getItem("user"))
            const apiKey = user ? user.token : settings.apiKey
        
            var response = await fetch(url, {
                    method: "POST",
                    headers: new Headers({
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json'                
                    }),
                    body: JSON.stringify(content),
                
                }
            );
            if (response.status === 401){
                window.location = settings.appLogin
            }
            return response;
        }
        catch (err){
            window.location = settings.appLogin
        }
    },
    Get: async function (url) {
        try{
            const user = JSON.parse(sessionStorage.getItem("user"))
            const apiKey = user ? user.token : settings.apiKey
            var response = await fetch(url, {
                    method: "GET",
                    headers: new Headers({
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json'                
                        }),
                }
            );
            if (response.status === 401){
                window.location = settings.appLogin
            }
            return response;
        }
        catch (err){
            window.location = settings.appLogin
        }
    }
}

export default adapter;