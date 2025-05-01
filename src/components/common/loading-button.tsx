import React from 'react'
import { Button, ButtonProps } from './button'
import { Spinner } from './spinner'

export default function LoadingButton({ isLoading, disabled, children, onClick, icon, ...props }: ButtonProps & { isLoading?: boolean, icon?: React.ReactNode }) {
  return (
    <Button onClick={!isLoading ? onClick : () => { }} {...props}>
      <div className='flex items-center gap-1 space-x-2'>
        {
          isLoading ? <Spinner />
            : icon
        }
        {children}
      </div>
    </Button>
  )
}
