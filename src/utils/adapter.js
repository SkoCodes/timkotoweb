const adapter = {
    Post: async function (url, content) {
        const user = JSON.parse(sessionStorage.getItem("user"))
        var response = await fetch(url, {
            method: "POST",
            headers: new Headers({
                'x-api-key': 'user.token',
                'Content-Type': 'application/json'                
            }),
            body: JSON.stringify(content)
        });
        return response;
    },
    Get: async function (url) {
        const user = JSON.parse(sessionStorage.getItem("user"))
        var response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                'x-api-key': 'user.token',
                'Content-Type': 'application/json'                
            }),
        });
        return response;
    }
}

export default adapter;