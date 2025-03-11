const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ 
        success: false,
        message: 'Method Not Allowed' 
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Forward the request to Make.com
    const response = await fetch('https://hook.eu1.make.com/ax2go8kwme53tt4mswjomc82sevbk48f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.text();
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(responseData);
    } catch (e) {
      // If Make.com doesn't return JSON, create a default response
      parsedResponse = { 
        success: response.ok,
        message: responseData || 'Submission received'
      };
    }

    if (!response.ok) {
      throw new Error(parsedResponse.message || `Make.com responded with ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Expert submission successful',
        data: parsedResponse
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        message: 'Failed to submit expert information',
        error: error.message
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}; 