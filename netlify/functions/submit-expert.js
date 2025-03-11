const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Forward the request to Make.com
    const response = await fetch('https://hook.eu1.make.com/ax2go8kwme53tt4mswjomc82sevbk48f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Make.com responded with ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Expert submission successful' }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to submit expert information' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
}; 