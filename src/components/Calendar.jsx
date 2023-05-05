import React from 'react';
import CalendarDay from './CalendarDay';

export default function Calendar (props) {
    
    return(
        <div className='grid gap-2 grid-cols-5 md:pt-8 content-center'>
            {/* map the calendar rows as div.row */}
            {props.calendarRows.map((row, week) => (
                row.map( (day, dayNum) => <CalendarDay
                        key = {day.id}
                        id = {day.id}
                        dayName = {day.dayName}
                        month = {day.month}
                        day = {day.day}
                        pallets = {day.pallets}
                        packages = {day.packages}
                        isClicked = {day.isClicked}
                        onClick = {() => props.handleClick(((week * 5) + dayNum))}
                        apiIsLoaded = {props.apiIsLoaded}
                        /> )
            ))}
        </div>
    )
}