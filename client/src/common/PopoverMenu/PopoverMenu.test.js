/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { PopoverMenu } from './PopoverMenu'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PopoverMenu />, div)
  ReactDOM.unmountComponentAtNode(div)
})
