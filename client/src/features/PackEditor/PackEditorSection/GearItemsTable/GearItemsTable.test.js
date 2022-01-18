/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { GearItemsTable } from './GearItemsTable'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<GearItemsTable />, div)
  ReactDOM.unmountComponentAtNode(div)
})
