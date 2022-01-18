import './reset.css'
import 'lib/openColor.css'
import './variables.css'
import './App.css'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './queryClient'
import { PackEditor } from 'features/PackEditor'
import { LayoutFixed } from 'common/LayoutFixed'

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutFixed>
        <PackEditor />
      </LayoutFixed>
    </QueryClientProvider>
  )
}
