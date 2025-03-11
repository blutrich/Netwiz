const fetch = require('node-fetch');

// CORS headers for development
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async function(event, context) {
  console.log('Function started');
  console.log('Request method:', event.httpMethod);
  console.log('Request headers:', event.headers);
  
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        message: 'Method Not Allowed' 
      })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    // Forward the request to Make.com
    console.log('Sending request to Make.com...');
    
    try {
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
        headers: corsHeaders,
        body: JSON.stringify(successResponse)
      };
    } catch (makeError) {
      console.error('Make.com request error:', makeError);
      throw new Error(`Failed to submit to Make.com: ${makeError.message}`);
    }
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
      headers: corsHeaders,
      body: JSON.stringify(errorResponse)
    };
  }
}; 