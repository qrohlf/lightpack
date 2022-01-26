/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { MinimalDnd } from './MinimalDnd'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<MinimalDnd />, div)
  ReactDOM.unmountComponentAtNode(div)
})
