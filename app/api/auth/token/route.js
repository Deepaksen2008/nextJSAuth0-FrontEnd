import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async function handler(req) {
  try {
    const { accessToken } = await getAccessToken(req, {
      scopes: ['openid', 'profile', 'email'] // Include these scopes
    });

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'No access token found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    return new Response(JSON.stringify({ error: 'Failed to get access token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
