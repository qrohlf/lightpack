/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { DndPackContents } from './DndPackContents'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<DndPackContents />, div)
  ReactDOM.unmountComponentAtNode(div)
})
