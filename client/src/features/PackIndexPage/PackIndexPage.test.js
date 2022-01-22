/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { PackIndexPage } from './PackIndexPage'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PackIndexPage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
