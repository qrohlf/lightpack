/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { LoadingPage } from './LoadingPage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LoadingPage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
