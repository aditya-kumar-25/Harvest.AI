import axios from "axios";

export const getChatResponse = async (query: string) => {
  console.log('Query = ', query);

  // Create Chat Session API
  let data = JSON.stringify({
    "pluginIds": [
      "plugin-1717443567", "plugin-1717467138","plugin-1717418212","plugin-1717443567","plugin-1717400660","plugin-1712327325","plugin-1713962163"
    ],
    "externalUserId": "1"
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.on-demand.io/chat/v1/sessions',
    headers: { 
      'apikey': 'SyuuzaftNhzKZoZNFZz33xxMZblRer4p', 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const sessionResponse = await axios.request(config);
    console.log(JSON.stringify(sessionResponse.data));
    const sessionId = sessionResponse.data.data.id;
    console.log('Session ID = ', sessionId);

    // Step 2: Answer Query using the session ID
    const queryResponse = await fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
      method: 'POST',
      headers: {
        'apikey': 'SyuuzaftNhzKZoZNFZz33xxMZblRer4p',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "endpointId": "predefined-openai-gpt4o",
        "query": `${query}`,
        "pluginIds": ["plugin-1717443567", "plugin-1717467138","plugin-1717418212","plugin-1717443567","plugin-1717400660","plugin-1712327325","plugin-1713962163"],
        "responseMode": "sync"
      })
    });

    const queryData = await queryResponse.json();
    console.log(queryData);
    return queryData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};