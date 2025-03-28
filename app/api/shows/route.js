import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:shows']
    });
    sendTokenToBackend(accessToken);
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/shows`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const shows = await response.json();

    return NextResponse.json(shows, res);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});

export const sendTokenToBackend = async token => {
  console.log('Sending token to backend:', token);
  try {
    const response = await fetch('https://next-js-auth0-backend.vercel.app/auth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();
    console.log('Response from backend:', data);
  } catch (error) {
    console.error('Error sending token:', error);
  }
};
