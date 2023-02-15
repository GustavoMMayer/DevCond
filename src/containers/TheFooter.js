import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="" target="_blank" >Gustavo </a>
        <span className="ml-1">&copy; 2023 FronEnd Dev</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by Gustavo Mayer com base no </span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">CoreUI for React</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
