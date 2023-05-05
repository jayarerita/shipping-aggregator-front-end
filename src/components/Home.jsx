// components/Home.js
import demoData from '../assets/example_data.js';
import TwoWeekCalendar from './TwoWeekCalendar.jsx';

export function Home() {

  return (
  <>
    <h1 className='text-3xl text-center text-thril-red-dark font-bold'>Demo Data</h1>
    <div className='w-max mx-auto'>
      <h2 className='text-center'>Incoming Shipments</h2>
    </div>
    <TwoWeekCalendar shipments={demoData} />
  </>
  );
}