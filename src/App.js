import { useEffect, useState } from 'react';
import './App.css';

function App() {
  //timer
  const [started, setStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    if (isRunning) {

      let IntervalId;
      IntervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1);
      return () => clearInterval(IntervalId)
    }
   
  })
  const handleStart = () => {
    setStarted(true);
    setIsRunning(true);
  }
  return (
    <div>
      <div className='Settings'></div>
      <div className='Stats'></div>
      <div className='QuestionBar'></div>
      <div className='AnswerBox'></div>
      <div className='Buttons'>
        <button onClick={handleStart}>Start</button>
        <h1>{time}</h1>
      </div>
    </div>
  );
}

export default App;
