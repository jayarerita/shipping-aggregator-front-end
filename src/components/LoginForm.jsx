import React, { useState, useRef } from 'react';
import { postLogin, postRegister } from '../api/apiCalls';
import useApi from '../api/hooks/useApi';
import styled from 'styled-components';
import LockIcon from './LockIcon';

const SubmitButton = styled.button.attrs({
  className:"btn btn-primary group relative my-4 mx-auto flex",
})``

const InputLine = styled.div.attrs({
  className:"md:flex md:items-center mb-6",
})``

const InputLabel = styled.label.attrs({
  className:"md:w-1/3 pr-1",
})``

const InputField = styled.div.attrs({
  className:"md:w-2/3",
})``

const Message = styled.p.attrs({
  className:"text-red-500 italic text-center",
})``

function LoginForm({children}) {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const submitBtnTextRef = useRef("Log In")
  const betaTokenRef = useRef()
  const [register, setRegister] = useState(false)
  const registerUser = useApi(() => postRegister(emailRef.current.value, passwordRef.current.value, betaTokenRef.current.value, orgCodeRef.current.value))
  const loginUser = useApi(() => postLogin(emailRef.current.value, passwordRef.current.value))
  const orgCodeRef = useRef()

  async function handleSubmit(event){
    event.preventDefault();
    console.log("submitted")
    let response = null;

      if (register){
        // Check password match
        if (passwordRef.current.value === passwordConfirmRef.current.value){
          console.log("Registering new user...");
          response = await registerUser.exec(event);
          // Log user in after registering
          if (response.error === null){
            response = await loginUser.exec(event);
          }else{
            console.log("Registration failed.", response.error);
          }
          if(response.error === null){ 
            console.log("Login successful.");
          }else{
            console.log("Login failed.", response.error);
          }
        }else{
          alert("Passwords do not match!")
        }
      }else{
        await loginUser.exec(event)
        window.location.reload();
      }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="login-form"
      >
      {children}
      <InputLine>
          <InputLabel htmlFor="email" >Email</InputLabel>
          <InputField>
          <input
            id="email"
            type="email"
            ref={emailRef}
            required
            placeholder='Email'
            autoComplete='email'
          />
          </InputField>
      </InputLine>
      <InputLine>
          <InputLabel htmlFor="password" >Password</InputLabel>
          <InputField>
            <input
            id="password"
            type="password"
            ref={passwordRef}
            required
            placeholder='Password'
            autoComplete='current-password'
          />
          </InputField>
      </InputLine>
      { register ? (
        <div>
          <InputLine>
              <InputLabel htmlFor='confirmPassword'>Confirm Password</InputLabel>
            <InputField>
              <input
              id="confirmPassword"
              type="password"
              ref={passwordConfirmRef}
              required
              placeholder='Confirm Password'
              />
            </InputField>
          </InputLine>
        <InputLine>
            <InputLabel htmlFor='betaToken'>Sign Up Code</InputLabel>
          <InputField>
            <input
              id="betaToken"
              type="text"
              ref={betaTokenRef}
              required
              placeholder='Sign Up Code'
            />
          </InputField>
        </InputLine>
        <InputLine>
            <InputLabel htmlFor='orgCode'>Organization Code</InputLabel>
          <InputField>
            <input
              id="orgCode"
              type="text"
              ref={orgCodeRef}
              required
              placeholder='Organization Code'
            />
          </InputField>
        </InputLine>
      </div>
      ) : (<div></div>)}
      <div className='w-full text-center my-2 btn-secondary rounded-full p-2 hover:scale-105'>
        <a
          className='relative text-center'
          href=""
          onClick={(e) => {
            // Change the register state so that the additional fields will show/hide and change the submit btn text
            e.preventDefault();
            if (register){
              submitBtnTextRef.current = "Log In";
            }else{
              submitBtnTextRef.current = "Register";
            }
            setRegister(!register);
          }}>
            {register ? ("Already have an account?"):("Not a user yet?")}
          </a>
        </div>
      <SubmitButton
        type="submit"
        disabled={registerUser.isPending || loginUser.isPending}
      >
        <LockIcon/>
        <span>{submitBtnTextRef.current}</span>
      </SubmitButton>
      {registerUser.isPending ? <Message>Regsitering New User...</Message> : null}
      {registerUser.isError ? <Message>Registration Error!</Message> : null}
      {registerUser.isSuccess ? <Message> Successfully registered!</Message> : null}
      {loginUser.isMessageending ? <Message>Logging In...</Message> : null}
      {loginUser.isError ? <Message>Log In Error!</Message> : null}
      {loginUser.isSuccess ? <Message> Successfully logged in!</Message> : null}
    </form>
  );
}

export default LoginForm;