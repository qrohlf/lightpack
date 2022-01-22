/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { Popover } from './Popover'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Popover />, div)
  ReactDOM.unmountComponentAtNode(div)
})
