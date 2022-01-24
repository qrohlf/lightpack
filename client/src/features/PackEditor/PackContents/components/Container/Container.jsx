import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Handle, Remove } from '../Item'

import styles from './Container.module.scss'

export const Container = forwardRef(
  (
    {
      children,
      columns = 1,
      handleProps,
      hover,
      onClick,
      onRemove,
      label,
      style,
      shadow,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        {...props}
        ref={ref}
        style={{
          ...style,
          '--columns': columns,
        }}
        className={classNames(
          styles.Container,
          hover && styles.hover, // used to indicate this section is the  current drop target
          shadow && styles.shadow, // used by the drag overlay to convey height
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className={styles.Header}>
            {label}
            <div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        <ul>{children}</ul>
      </div>
    )
  },
)
