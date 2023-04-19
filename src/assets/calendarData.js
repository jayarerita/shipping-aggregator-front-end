const lastDaysOfMonth = [
    {month:"01", monthName: 'January', lastDay: 31},
    {month:"02", monthName: 'February', lastDay: 28},
    {month:"03", monthName: 'March', lastDay: 31},
    {month:"04", monthName: 'April', lastDay: 30},
    {month:"05", monthName: 'May', lastDay: 31},
    {month:"06", monthName: 'June', lastDay: 30},
    {month:"07", monthName: 'July', lastDay: 31},
    {month:"08", monthName: 'August', lastDay: 31},
    {month:"09", monthName: 'September', lastDay: 30},
    {month:"10", monthName: 'October', lastDay: 31},
    {month:"11", monthName: 'November', lastDay: 30},
    {month:"12", monthName: 'December', lastDay: 31},
]

const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
]


// Parameters are number of weeks for the calendar to display (1 or greater), and where which week you would like today to be in (1 or greater)
// Returns an a list of objects containing the day's name, month, date, pallets = 0, packages = 0, and isClicked = false
export function calcCalendarDates(numOfWeeks, startingWeek) {
    const date = new Date();
    var calendarData = [];
    var tomorrowDay;

    checkLeapYear(date.getFullYear);

    let currentDay = date.getDay(); //0-6
    let mondayOfCurrentWeek = date.getDate() - (currentDay - 1); // In the 1-31 format, but could be negative
    let currentYear = date.getFullYear();
    
    // Calculate first monday of calendar period
    let firstMonday = {day: mondayOfCurrentWeek - (7 * (startingWeek -1)), month: date.getMonth()};
    // Check if the first day of the calendar is the previous month
    if (firstMonday.day < 1) {
        firstMonday.month = ((firstMonday.month === 0) ? 12 : firstMonday.month - 1); //Change month to previous month
        let previousMonthIndex = lastDaysOfMonth.findIndex((obj => lastDaysOfMonth.indexOf(obj) === firstMonday.month));
        firstMonday.day = lastDaysOfMonth[previousMonthIndex].lastDay + firstMonday.day;
        if (firstMonday.month === 12) {
            currentYear = currentYear-1;
        }
    }

    // Loop through each day in the calendar and populate its day and month
    let todayDay = firstMonday.day;// TodayDay refers to location of index during loop
    let todayMonth = firstMonday.month; //TodayMonth 0-11
    let todayYear = currentYear;
    var id = 0;
    for (let week = 0 ; week < numOfWeeks; week++) {
        for (let day = 0 ; day < 5; day++) {
            calendarData.push({id: id, dayName: dayNames[day],
                month: lastDaysOfMonth[todayMonth].monthName,
                day: todayDay,
                pallets: 0,
                packages: 0,
                isClicked: false,
                date: String(todayYear+"-"+lastDaysOfMonth[todayMonth].month +"-"+todayDay.toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                })) });
            id += 1; // Increment id
            //Increment Day and Month
            tomorrowDay = todayDay + 1; // What day should tomorrow be?
            [todayDay, todayMonth, todayYear] = checkForNewMonth (tomorrowDay, todayMonth, todayYear) //Check tomorrow day and month are good
        }
        tomorrowDay = todayDay + 2; // Increment from Saturday to Monday
        [todayDay, todayMonth, todayYear] = checkForNewMonth (tomorrowDay, todayMonth, todayYear) //Check tomorrow day and month are good
    }

    return calendarData;
}

// Check if day should be in new month
function checkForNewMonth (currentDay, currentMonth, currentYear) {
    let currentMonthIndex = lastDaysOfMonth.findIndex((obj => lastDaysOfMonth.indexOf(obj) === currentMonth));
    if (currentDay > lastDaysOfMonth[currentMonthIndex].lastDay) {
        currentDay = 1;
        currentMonth = ((currentMonth + 1 === 12) ? 1 : currentMonth + 1); //Change month to next month
    } 
    // Check for new year
    if (currentMonth === 1) {
        currentYear = currentYear+1;
    }
    return [currentDay, currentMonth, currentYear];
}

// Check leap year
function checkLeapYear(year) {
    //three conditions to find out the leap year
    if (((0 === year % 4) && (0 !== year % 100)) || (0 === year % 400)) {
        lastDaysOfMonth[1].lastDay = 29; // Change February's last day
    }
}