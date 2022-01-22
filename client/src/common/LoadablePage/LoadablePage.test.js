/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { LoadablePage } from './LoadablePage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LoadablePage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
