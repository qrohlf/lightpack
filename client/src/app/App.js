import './reset.css'
import './variables.css'
import './App.css'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './queryClient'
import { PackEditor } from 'features/PackEditor'

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PackEditor />
    </QueryClientProvider>
  )
}
