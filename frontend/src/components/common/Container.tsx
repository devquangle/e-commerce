import React from 'react'


interface Props{
    children?: React.ReactNode,
    className?: string
}

function Container({children,className=""}:Props) {
  return (
    <div className={`mx-auto w-full ${className}`}>{children}</div>
  )
}

export default Container