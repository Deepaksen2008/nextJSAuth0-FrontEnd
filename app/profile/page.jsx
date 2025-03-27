'use client';

import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Highlight from '../../components/Highlight';

const sendTokenToBackend = async () => {
  try {
    const res = await fetch('/api/auth/token'); // Fetch access token from API route
    const { accessToken } = await res.json();

    if (!accessToken) {
      throw new Error('Access token not available');
    }

    const response = await fetch('http://localhost:5000/auth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: accessToken })
    });

    if (!response.ok) {
      throw new Error(`Failed to send token: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from backend:', data);
  } catch (error) {
    console.error('Error sending token:', error);
  }
};

function Profile() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      sendTokenToBackend(); // Send token after user logs in
    }
  }, [user]);

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          <Row data-testid="profile-json">
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </Row>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
