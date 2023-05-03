// components/Home.js
import logo from '/src/assets/logo.png';
export function Home() {
  return (
<div className='w-max mx-auto py-4'>
    <div>
        <img className='thril-logo w-48 md:w-96 mx-auto' src={logo} alt="Thril Logo" />
    </div>
    <div className='text-center'>
        <h1>Incoming Shipments</h1>
    </div>
</div>

  );
}