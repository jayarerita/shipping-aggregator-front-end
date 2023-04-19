import React from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'

const ModalCard = styled.div.attrs({
  className:"fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 z-50 rounded-xl bg-thril-grey-dark shadow-lg w-10/12 sm:w-6/12 md:w-max",
})``

const ModalBackground = styled.div.attrs({
  className:"fixed top-0 left-0 right-0 bottom-0 z-50 bg-thril-grey-dark/70",
})``

const CloseButton = styled.div.attrs({
  className:"btn btn-secondary mx-auto my-2 text-center hover:cursor-pointer",
})``

export default function Modal({ open, children, onClose }) {
  if (!open) return null

  return ReactDom.createPortal(
    <>
      <ModalBackground/>
      <ModalCard>
        {children}
        <CloseButton
            onClick={onClose}
            >
                Cancel
        </CloseButton>
      </ModalCard>
    </>,
    document.getElementById('portal')
  )
}