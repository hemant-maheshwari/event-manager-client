import 'react-calendar/dist/Calendar.css';
import './scss/app.scss';
import EventCalendar from './component/EventCalendar';

function App() {
  return (
    <div className="App">
        <h1>Event Calendar</h1>
        <EventCalendar />
    </div>
  );
}

export default App;
