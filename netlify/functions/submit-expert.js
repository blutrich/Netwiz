const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Function started');
  
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
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
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    // Forward the request to Make.com
    console.log('Sending request to Make.com...');
    const makeResponse = await fetch('https://hook.eu1.make.com/ax2go8kwme53tt4mswjomc82sevbk48f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('Make.com response status:', makeResponse.status);
    console.log('Make.com response headers:', makeResponse.headers);
    
    const responseText = await makeResponse.text();
    console.log('Make.com raw response:', responseText);

    // Always return a valid JSON response
    const successResponse = {
      success: makeResponse.ok,
      message: makeResponse.ok ? 'Expert submission successful' : 'Failed to submit to Make.com',
      status: makeResponse.status,
      makeResponse: responseText || null
    };
    
    console.log('Sending response:', JSON.stringify(successResponse, null, 2));
    return {
      statusCode: makeResponse.ok ? 200 : 422,
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
      message: 'Failed to process expert submission',
      error: error.message || 'Unknown error'
    };
    
    console.log('Sending error response:', JSON.stringify(errorResponse, null, 2));
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