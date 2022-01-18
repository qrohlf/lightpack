/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { LayoutFixed } from './LayoutFixed'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LayoutFixed />, div)
  ReactDOM.unmountComponentAtNode(div)
})
