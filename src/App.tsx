/**
 * Clean App - Fresh Start with Working Design System
 */

import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import { tokens } from './design-system/tokens';

// Setup React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Setup Material-UI theme using our design tokens
const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary[500],
    },
    background: {
      default: tokens.colors.background,
    },
  },
  typography: {
    fontFamily: tokens.typography.fontFamily,
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
            </div>
          </Route>
        </Switch>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;