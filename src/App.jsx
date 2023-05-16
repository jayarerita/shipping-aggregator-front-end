import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';

import Dashboard from './components/Dashboard';
import { RequireAuth } from './components/RequireAuth';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Layout } from './components/Layout';
import thrilTheme from './assets/customTheme.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider theme={thrilTheme}>
    <Authenticator.Provider>
      <MyRoutes />
    </Authenticator.Provider>
    </ThemeProvider>
  );
}

export default App;