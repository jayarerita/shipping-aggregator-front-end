import React from 'react'
import styled from 'styled-components'

const AlertHeader = styled.div.attrs({
  className: "bg-thril-red text-white font-bold rounded-t-md px-4 py-2"
})``
const ErrorMessage = styled.div.attrs({
  className:"border border-t-0 border-thril-red rounded-b-md bg-red-100 px-4 py-3 text-thril-red-dark",
})``
function Alert(props) {
  return(
      <div role="alert" className='py-8 md:w-96'>
          <AlertHeader>
              {props.heading}
          </AlertHeader>
          <ErrorMessage>
              {props.children}
          </ErrorMessage>
      </div>
  )
}

export default Alert