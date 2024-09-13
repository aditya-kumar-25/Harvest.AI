export const getChatResponse = async (query: string) => {
    console.log('Query = ' , query);
  
// Create Chat Session API
return fetch('https://api-dev.on-demand.io/chat/v1/sessions', {
    method: 'POST',
    headers: {
        'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "pluginIds": [],
        "externalUserId": "1"
    })
})
.then(response => response.json())
.then(data => {
    // Extract session ID from the response
    const sessionId = data.chatSession.id;

    // Step 2: Answer Query using the session ID
    return fetch(`https://api-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
        method: 'POST',
        headers: {
            'apikey': 'zVzRjg2Lg2S2QI0dwIWjjOGc1RrofWjt',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "endpointId": "predefined-openai-gpt4o",
            "query": `${query}`,
            "pluginIds": ["plugin-1713962163", "plugin-1713965172"],
            "responseMode": "sync"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    })
        
    .catch(error => {
        console.error('Error:', error);
    });
})
.catch(error => {
    console.error('Error:', error);
});
}
