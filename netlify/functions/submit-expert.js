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
    console.log('Received data:', data);
    
    // Forward the request to Make.com
    console.log('Sending request to Make.com...');
    const response = await fetch('https://hook.eu1.make.com/ax2go8kwme53tt4mswjomc82sevbk48f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('Make.com response status:', response.status);
    const responseData = await response.text();
    console.log('Make.com response data:', responseData);
    
    let parsedResponse;
    try {
      parsedResponse = responseData ? JSON.parse(responseData) : { success: response.ok };
    } catch (e) {
      console.log('Failed to parse Make.com response as JSON:', e);
      parsedResponse = { 
        success: response.ok,
        message: responseData || 'Submission received'
      };
    }

    if (!response.ok) {
      console.error('Make.com error response:', response.status, parsedResponse);
      throw new Error(parsedResponse.message || `Make.com responded with ${response.status}`);
    }

    const successResponse = {
      success: true,
      message: 'Expert submission successful',
      data: parsedResponse
    };
    
    console.log('Sending success response:', successResponse);
    return {
      statusCode: 200,
      body: JSON.stringify(successResponse),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Submission error:', error);
    const errorResponse = { 
      success: false,
      message: 'Failed to submit expert information',
      error: error.message || 'Unknown error'
    };
    
    console.log('Sending error response:', errorResponse);
    return {
      statusCode: 500,
      body: JSON.stringify(errorResponse),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}; 