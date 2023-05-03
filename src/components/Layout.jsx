// components/Layout.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, View } from '@aws-amplify/ui-react';
import styled from 'styled-components';

const NavBar = styled.nav.attrs({
  className: 'flex justify-center items-center p-4',
})``;

const Button = styled.button.attrs({
  className: 'btn-secondary rounded-full mx-4 py-2 px-4 border-0 hover:scale-105 shadow-lg',
})``;

export function Layout() {
  const { route, signOut } = useAuthenticator((context) => [
    context.route,
    context.signOut,
  ]);
  const navigate = useNavigate();

  function logOut() {
    signOut();
    navigate('/login');
  }
  return (
    <>
      <NavBar>
        <Button
          key="home"
          onClick={() => navigate('/')}
          >
            Home
          </Button>
        <Button key="dasboard" onClick={() => navigate('/dashboard')}>
          Your Dashboard
        </Button>
        {route !== 'authenticated' ? (
          <Button key="login" onClick={() => navigate('/login')}>Login</Button>
        ) : (
          <Button key="logout" onClick={() => logOut()}>Logout</Button>
        )}
      </NavBar>

      <Outlet />
    </>
  );
}