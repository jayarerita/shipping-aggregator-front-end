import React, { Suspense } from 'react'
import TwoWeekCalendar from './TwoWeekCalendar'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react';
import { Amplify, API, Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports.js';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { calcCalendarDates } from '../assets/calendarData.js';
import Loading from './Loading';
import logo from '../assets/logo.png';

Amplify.configure(awsExports);
Auth.configure(awsExports);
const Container = styled.div.attrs({
  className: 'py-4',
})``

const numOfWeeks = 2; // # of weeks the calendar will display
const startingWeek = 1; // The weeks # where today should be located
const calendarDates = calcCalendarDates(numOfWeeks, startingWeek);
const firstCalendarDate = calendarDates[0].date;
const lastCalendarDate = calendarDates[calendarDates.length -1].date;

function Dashboard() {
  const [shipments, setShipments] = useState(undefined);
  const { route } = useAuthenticator((context) => [
    context.route,
  ]);

  async function fetchShipments() {
    // Defin a user const to get the user's JWT token
    const user = await Auth.currentAuthenticatedUser();
    //const accessToken = user.signInUserSession.accessToken.jwtToken;
    const token = user.signInUserSession.idToken.jwtToken

    // Add the token as the authorization header in the API call and add the start and end dates as query parameters
    const requestPayload = {
        headers: {
            Authorization: token,
        },
        queryStringParameters: {
            start_date: firstCalendarDate,
            end_date: lastCalendarDate,
        },
    };

    // Call the API to get the shipments
    try {
      const response = await API.get('shipapi', `/items`, requestPayload);
      setShipments(response);
      // Log shipments to console wiht label
      console.log("Get Shipments response:", response);
    } catch (error) {
      console.log("Get Shipments error:", error);
      setShipments([]);
    }
  }

  useEffect(() => {
    fetchShipments();
  }, [])

  return (
    <Container>
      <Suspense fallback={<Loading/>}>
        <div className='w-max mx-auto'>
            <img className='thril-logo w-48 md:w-96 mx-auto flex' src={logo} alt="Thril Logo" />
            <h2 className='text-center'>Incoming Shipments</h2>
        </div>
        <TwoWeekCalendar shipments={shipments} />
      </Suspense>
    </Container>
  )
}

export default Dashboard