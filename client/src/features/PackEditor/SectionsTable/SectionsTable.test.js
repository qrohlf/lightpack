/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { SectionsTable } from './SectionsTable'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<SectionsTable />, div)
  ReactDOM.unmountComponentAtNode(div)
})
