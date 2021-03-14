const adapter = {
    Post: async function (url, content) {
        var response = await fetch(url, {
            method: "POST",
            headers: new Headers({
                'X-Api-Key': 'jVq8KNLxQ52I7cWrmnDDT5bCTx3BDmza1l3MeTFJ',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(content)
        });
        return response;
    }
}

export default adapter;