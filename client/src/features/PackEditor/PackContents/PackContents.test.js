/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { PackContents } from './PackContents'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PackContents />, div)
  ReactDOM.unmountComponentAtNode(div)
})
