/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { FormControl } from './FormControl'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<FormControl />, div)
  ReactDOM.unmountComponentAtNode(div)
})
