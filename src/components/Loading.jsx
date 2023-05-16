import React from 'react'
import styled from 'styled-components';

const Shell = styled.div.attrs({
    className:"rounded-full h-6 w-36 p-1 border-white bg-white border-2 opacity-70"
})``;

const Bean = styled.div.attrs({
    className:"rounded-full h-full my-auto w-6 bg-thril-grey-dark"
})`
  animation: 1s infinite alternate ease-in-out movingBean;

  @keyframes movingBean {
    /* translate from left align to right align */
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(480%);
    }
  }
  
  `;

const Text = styled.div.attrs({
  className:"text-thril-grey-dark text-2xl font-bold"
})``;

const Container = styled.div.attrs({
  className:"flex flex-col items-center justify-center"
})``;

function Loading() {
  return (
    <Container>
      <Text>Loading...</Text>
      <Shell>
          <Bean/>
      </Shell>
    </Container>
  )
}

export default Loading