import React from 'react';
import {calcCalendarDates} from '../assets/calendarData.js';
import { useState, useEffect} from 'react';
import Shipment from '/src/components/Shipment';
import Calendar from '/src/components/Calendar';
import styled from 'styled-components';
import Loading from '/src/components/Loading';

const Container = styled.div.attrs({
    className: '',
})``

const numOfWeeks = 2; // # of weeks the calendar will display
const startingWeek = 1; // The weeks # where today should be located

export default function TwoWeekCalendar (props) {
    
    const [calendarDates, setCalendarDates] = useState(calcCalendarDates(numOfWeeks, startingWeek));
    const [dayShipmentElements, setDayShipmentElements] = useState(undefined);


    // Sum pallets for each day to display on Calendar, when shipments array is filled in
    useEffect(() => {
        if(!props.shipments || props.shipments.length === 0) {
            return;
        }
        updatePallets();
        console.log("shipments: ", props.shipments);
    },[props.shipments])

    function updatePallets() {
        let calendar = calendarDates.map(day => ({...day, pallets: sumPallets(day)}));
        setCalendarDates(calendar);
    }

    function sumPallets(day) {
        let dayTotal =0;
        let dayShipments = [];
        dayShipments = props.shipments.filter(shipment => shipment.est_delivery === day.date);

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
        if (!Array.isArray(props.shipments)) { //If there are no shipments at all, exit
            return;
        }
        dayShipments = props.shipments.filter(shipment => shipment.est_delivery === daySelected[0].date);


        if (dayShipments.length === 0) {
            setDayShipmentElements(<div className='my-8 mx-auto w-64 text-center text-sm md:text-md'><h2 className='no-shipments'>No shipments scheduled to arrive on this date.</h2></div>); 
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

    return( 
        <Container>
            {/* If the shipments array is empty or undefined (no shipments), display a message saying so. Otherwise, display the calendar and shipments. */}
            {props.shipments === undefined ? (<Loading/>): props.shipments.length === 0 ? (
            <div className='my-8 mx-auto text-center'>
                <h2 className='no-shipments'>No shipments scheduled to arrive in the next two weeks.</h2>
            </div>) : (
            <div className='px-2 md:w-[700px] mx-auto md:mt-8'>
                <Calendar 
                    calendarRows = {calendarRows}
                    handleClick = {(i) => handleClick(i)}
                    apiIsLoaded = {true}
                />
                {dayShipmentElements}
            </div>)}
        </Container>
    )
}