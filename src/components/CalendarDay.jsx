import React from 'react';
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';

const Day = styled.button.attrs({
    className: "bg-white rounded-md hover:scale-105 shadow-lg",
})``;

const DayName = styled.div.attrs({
    className:"text-xs md:text-lg bg-white rounded-b-none rounded-t-md border-thril-grey-dark relative",
})``;

const DayInfo = styled.div.attrs({
    className:"bg-thril-grey-dark rounded-b-md border-thril-grey-dark",
})``;

const Date = styled.div.attrs({
    className:"justify-between flex items-start p-2 text-xs md:text-sm text-white",
})``;

const DailyShipments = styled.div.attrs({
    className:"justify-between flex items-center py-4 px-1 md:p-4 text-sm md:text-xl text-white",
})``;

export default function CalendarDay (props) {
    return(
        <Day className={`day-${props.id}`} onClick={props.onClick}>
            <DayName>
                {props.isClicked ? <p className='my-2 text-thril-red-dark font-bold '> {props.dayName} </p> : <p className='my-2 text-black'> {props.dayName} </p>}
                {props.isClicked && <div className='rounded-full h-1 px-4 bg-thril-grey-dark absolute top-3/4 left-1/2 w-8/12 -translate-x-1/2'></div>}
            </DayName>
            <DayInfo>
                <Date>
                    <span className='day--month'> {props.month} </span>
                    <span className='day--date'> {props.day} </span>
                </Date>
                <DailyShipments>
                    {props.apiIsLoaded && <span className='api-loaded'>
                        {props.pallets}
                    </span>}
                    {!props.apiIsLoaded && <span className='api-not-loaded'>
                    <SyncLoader
                            color="#fff"
                            size = {7}
                            speedMultiplier = {0.5}
                        />     
                    </span>}
                    <span>  Pallets</span>
                </DailyShipments>
            </DayInfo>
        </Day>
    )
}

