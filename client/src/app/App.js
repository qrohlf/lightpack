import './reset.css'
import 'lib/openColor.css'
import './variables.css'
import './App.css'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'app/queryClient'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from 'hooks/useAuth'
import { Router } from './Router'

export const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
