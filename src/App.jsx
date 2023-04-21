import React from 'react';
import {calcCalendarDates} from './assets/calendarData.js';
import { useState, useEffect} from 'react';
import Shipment from '/src/components/Shipment';
import Calendar from '/src/components/Calendar';
import logo from '/src/assets/logo.png';
import LoginForm from '/src/components/LoginForm';
import Modal from './components/Modal'
import { getCookie, eraseCookie } from './assets/CookieManager.js';
import useApi from "./api/hooks/useApi";
import { postRefreshToken, getShipments } from './api/apiCalls';
import styled from 'styled-components';
import LockIcon from "./components/LockIcon";
import demoData from './assets/example_data.js';

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

const Container = styled.div.attrs({
    className: 'py-4',
})``

const VersionInfo = styled.div.attrs({
    className: 'text-xs text-center text-gray-500 absolute bottom-0 right-0 mr-2 mb-2',
})``

const numOfWeeks = 2; // # of weeks the calendar will display
const startingWeek = 1; // The weeks # where today should be located

function App () {
    const [calendarDates, setCalendarDates] = useState(calcCalendarDates(numOfWeeks, startingWeek));
    const [shipments, setShipments] = useState(undefined);
    const [demoShipments, setDemoShipments] = useState(demoData);
    const [accessToken, setAccessToken] = useState(getCookie("accessToken"));
    const [refreshToken, setRefreshToken] = useState(getCookie("refreshToken"));
    const apiRefreshToken = useApi(() => postRefreshToken(refreshToken));
    const [dayShipmentElements, setDayShipmentElements] = useState(undefined);
    const firstCalendarDate = calendarDates[0].date;
    const lastCalendarDate = calendarDates[calendarDates.length -1].date;
    const apiShipmentData = useApi(() => getShipments(firstCalendarDate, lastCalendarDate, accessToken))
    const [isOpen, setIsOpen] = useState(false);
    const [viewDemo, setViewDemo] = useState(false);

    console.log(demoData);

    //Authenticate with API
    useEffect(() => {

        const fetchTokens = async () => {
            const response = await apiRefreshToken.exec();
            setAccessToken(response.data.access);
            setRefreshToken(response.data.refresh);
        }

        if (accessToken === null && refreshToken === null) return;
        // If the accessToken cookie is expired it will return null, try to use refreshToken to get a new accessToken
        if (accessToken === null) {
            fetchTokens();
        }
    },[refreshToken])

    //Call API to grab all shipments in the Calendar's range upon load, once token is updated
    useEffect(() => {

        async function fetchShipments() {
            const response = await apiShipmentData.exec(firstCalendarDate, lastCalendarDate, accessToken);
            if (response.error) {
                console.log("Get Shipments error:", response.error);
            }else{
                setShipments(response.data);
            }
        }

        if(!accessToken) return;   

        fetchShipments();
        setDayShipmentElements(<> </>);
    }, [accessToken])

    // Sum pallets for each day to display on Calendar, when shipments array is filled in
    useEffect(() => {
        if(!shipments & !demoShipments) return;
        updatePallets();
    },[shipments, demoShipments])

    function updatePallets() {
        let calendar = calendarDates.map(day => ({...day, pallets: sumPallets(day)}));
        setCalendarDates(calendar);
    }

    function sumPallets(day) {
        let dayTotal =0;
        let dayShipments = [];

        if(refreshToken && shipments){
            dayShipments = shipments.filter(shipment => shipment.est_delivery === day.date);
        }else{
            dayShipments = demoShipments.filter(shipment => shipment.est_delivery === day.date);
        }

        dayShipments.forEach(shipment => {
            shipment.items.forEach(item => {
                dayTotal += item.pallets;
            });
        });
        return dayTotal;
    }

    function handleClick(i) {
        let calendar = calendarDates.map(day => ({...day, isClicked: false}));
        let day = {...calendar[i]};
        day.isClicked = true;
        calendar[i] = day;
        setCalendarDates(calendar);
    }
   
    // Update shipments when selected date changes
    useEffect(() => {
        let daySelected = calendarDates.filter(day => day.isClicked === true);
        let dayShipments = [];
        if (daySelected.length === 0) { //If no day is clicked, exit
            return;
        }
        if (refreshToken) {
            if (!Array.isArray(shipments)) { //If there are no shipments at all, exit
                return;
            }
            dayShipments = shipments.filter(shipment => shipment.est_delivery === daySelected[0].date);
        }else{
            dayShipments = demoShipments.filter(shipment => shipment.est_delivery === daySelected[0].date);
        }

        if (dayShipments.length === 0) {
            setDayShipmentElements(<div className='my-8 mx-auto text-center'><h2 className='no-shipments'>No shipments scheduled to arrive on this date.</h2></div>); 
        } else {
            setDayShipmentElements(
                dayShipments.map((shipment, idx) => (
                    <Shipment
                    key = {shipment.id}
                    {...shipment}
                    />
                ))
            );
        }
    }, [calendarDates])


    const rows = [...Array( Math.ceil(calendarDates.length / 5) )]; // Number of calendar rows needed
    const calendarRows = rows.map( (row, idx) => calendarDates.slice(idx * 5, idx * 5 + 5) ); // Chunk the days into the array of rows

    function logout(){
        setAccessToken(null);
        setRefreshToken(null);
        setShipments(undefined);
        eraseCookie("accessToken");
        eraseCookie("refreshToken");
    }

    return( 
        <>
        {refreshToken !== null ? (
            <Container>
                <div className='w-max mx-auto py-4'>
                    <div>
                        <img className='thril-logo w-48 md:w-96 mx-auto' src={logo} alt="Thril Logo" />
                    </div>
                    <div className='text-center'>
                        <h1>Incoming Shipments</h1>
                    </div>
                </div>
                <button
                    onClick={() => logout()}
                    className="btn btn-primary group relative left-1/2 mt-4 -translate-x-1/2 flex"
                >
                    <LockIcon/>
                    <span>Log out</span>
                </button>
                <div className='px-2 md:w-[700px] mx-auto mt-8'>
                    <Calendar 
                        calendarRows = {calendarRows}
                        handleClick = {(i) => handleClick(i)}
                        apiIsLoaded = {apiShipmentData.isSuccess}
                    />
                    {dayShipmentElements}
                    {apiRefreshToken.isLoading ? <Alert heading="Alert">Refreshing token...</Alert> : null}
                    {apiRefreshToken.isError ? <Alert heading="Error">Token failed to refresh...</Alert> : null}
                    {apiShipmentData.isLoading ? <Alert heading="Alert">Loading shipments...</Alert> : null}
                    {apiShipmentData.isError ? <Alert heading="Error">Shipments failed to load...</Alert> : null}
                </div>
            </Container>) : (
                <Container>
                <div className='w-max mx-auto py-4'>
                    <img className='thril-logo w-48 md:w-96 mx-auto' src={logo} alt="Thril Logo" />
                    <h1 className='text-center'>Welcome to the Thril Shipping Aggregator</h1>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary group relative left-1/2 mt-4 -translate-x-1/2 flex"
                >
                    <LockIcon/>
                    <span>Log In</span>
                </button>
                <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                    <LoginForm>
                    </LoginForm>
                </Modal>

                <div className='px-2 md:w-[700px] mx-auto mt-8'>
                    <button
                        onClick={() => setViewDemo(!viewDemo)}
                        className="btn btn-secondary group relative left-1/2 -translate-x-1/2 flex my-4"
                    >
                        {viewDemo ? "Hide Demo" : "View Demo"}
                    </button>
                    {viewDemo && <><Calendar 
                        calendarRows = {calendarRows}
                        handleClick = {(i) => handleClick(i)}
                        apiIsLoaded = {true}
                    />
                    {dayShipmentElements}</>
                    }
                </div>
                <VersionInfo>
                    {import.meta.env.PROD ? `Production v${import.meta.env.APP_VERSION}` : `Development v0.0.0`}
                </VersionInfo>
            </Container>)
        }
        </>
    )
}

export default App