/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { LighterpackImportPage } from './LighterpackImportPage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LighterpackImportPage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
