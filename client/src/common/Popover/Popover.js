import React from 'react'
import styles from './Popover.module.css'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Button } from 'common/Button'
// use https://github.com/radix-ui/website/blob/main/components/demos/Popover.jsx
// as inspiration

export const Popover = ({ trigger, buttonProps, children }) => {
  return (
    <PopoverPrimitive.Root>
      <Button {...buttonProps} element={<PopoverPrimitive.Trigger />}>
        {trigger}
      </Button>
      <PopoverPrimitive.Content sideOffset={5} className={styles.Content}>
        {children}
        {/*<PopoverPrimitive.Arrow className={styles.Arrow} />*/}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
}
