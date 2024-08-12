import { useEffect, useState } from 'react';
import './App.css';

function App() {

  
  const [question, setQuestion] = useState();
  const [questionLength, setQuestionLength] = useState(6);
  

  const generateQuestion = () => {
    setQuestion(Math.floor(Math.random() * 10 ** questionLength) + 10 ** questionLength )
  }
  

  //timer
  const [started, setStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    if (isRunning) {

      let IntervalId;
      IntervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 10);
      return () => clearInterval(IntervalId)
    }
   
  })
  const handleStart = () => {
    setStarted(true);
    setIsRunning(true);
    generateQuestion();
    setTime(0);
  }
  
  const [hidden, setHidden] = useState(false);

  const handleHide = () => {
    setHidden(true);
  }
  //submitting
  const handleSubmit = () => {
    setIsRunning(false);
    setHidden(false)
    setStarted(false);
      
  }
  return (
    <div>
      <div className='Settings'></div>
      <div className='Stats'></div>
      <div className='QuestionBar'>
        <h1>{!hidden && question}</h1>
      </div>
      <div className='AnswerBox'></div>
      <div className='Buttons'>
        {!started && <button onClick={handleStart}>Start</button>}
        {started && !hidden && <button onClick={handleHide}> Ready to answer</button>}
        {started && hidden && <button onClick={handleSubmit}> Submit </button>}
        <h1>{(time / 100).toFixed(2)}</h1>
      </div>
    </div>
  );
}

export default App;
