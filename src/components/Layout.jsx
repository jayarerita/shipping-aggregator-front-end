// components/Layout.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, View } from '@aws-amplify/ui-react';
import styled from 'styled-components';
import LockIcon from './LockIcon';

const VersionInfo = styled.div.attrs({
  className: 'text-xs text-center text-gray-500 absolute bottom-0 right-0 mr-2 mb-2',
})``

const NavBar = styled.nav.attrs({
  className: 'flex justify-center items-center p-4',
})``;

const ButtonStart = styled.button.attrs({
  className: 'btn-secondary rounded-l-md py-2 px-8 border-0 hover:scale-105 shadow-lg text-sm md:text-lg',
})``;
const ButtonMiddle = styled.button.attrs({
  className: 'btn-secondary mx-1 py-2 px-4 border-0 hover:scale-105 shadow-lg text-sm md:text-lg',
})``;
const ButtonEnd = styled.button.attrs({
  className: 'btn-secondary rounded-r-md py-2 pl-6 pr-8 border-0 hover:scale-105 shadow-lg inline-flex items-center text-sm md:text-lg',
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
        <ButtonStart
          key="home"
          onClick={() => navigate('/')}
          >
            Home
          </ButtonStart>
        <ButtonMiddle key="dasboard" onClick={() => navigate('/dashboard')}>
          Dashboard
        </ButtonMiddle>
        {route !== 'authenticated' ? (
          <ButtonEnd key="login" onClick={() => navigate('/login')}><LockIcon/>Login</ButtonEnd>
        ) : (
          <ButtonEnd key="logout" onClick={() => logOut()}><LockIcon/>Logout</ButtonEnd>
        )}
      </NavBar>

      <Outlet />
      <VersionInfo>
          {import.meta.env.PROD ? `Production v${import.meta.env.APP_VERSION}` : `Development v0.0.0`}
      </VersionInfo>
    </>
  );
}