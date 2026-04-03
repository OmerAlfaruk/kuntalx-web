import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { AuthProvider } from './lib/auth-context';
import { AppRouter } from './app/router';

import { ThemeProvider } from './lib/theme-context';
import { I18nProvider } from './lib/i18n-context';

import { SettingsProvider } from './lib/settings-context';
import { ToastProvider } from './lib/toast-context';
import { ToastContainer } from './shared/components/Toast';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SettingsProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </QueryClientProvider>
            <ToastContainer />
          </ToastProvider>
        </SettingsProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
