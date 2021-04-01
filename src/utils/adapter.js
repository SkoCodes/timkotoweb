const adapter = {
    Post: async function (url, content) {
        try{
            const user = JSON.parse(sessionStorage.getItem("user"))
            const apiKey = user ? user.token : "jVq8KNLxQ52I7cWrmnDDT5bCTx3BDmza1l3MeTFJ"
        
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
                window.location = 'https://timkoto.com'
            }
            return response;
        }
        catch (err){
            window.location = 'https://timkoto.com'
        }
    },
    Get: async function (url) {
        try{
            const user = JSON.parse(sessionStorage.getItem("user"))
            const apiKey = user ? user.token : "jVq8KNLxQ52I7cWrmnDDT5bCTx3BDmza1l3MeTFJ"
            var response = await fetch(url, {
                    method: "GET",
                    headers: new Headers({
                        'x-api-key': apiKey,
                        'Content-Type': 'application/json'                
                        }),
                }
            );
            if (response.status === 401){
                window.location = 'https://timkoto.com'
            }
            return response;
        }
        catch (err){
            window.location = 'https://timkoto.com'
        }
    }
}

export default adapter;