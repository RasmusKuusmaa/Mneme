import { useEffect, useState } from 'react';
import './App.css';

function App() {

  
  const [question, setQuestion] = useState();
  const [questionLength, setQuestionLength] = useState(2);
  const [feedback, setFeedback] = useState();

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
    setAnswer('');
  }
  
  const [hidden, setHidden] = useState(false);

  const handleHide = () => {
    setHidden(true);
  }
  //submitting
  const [answer, setAnswer] = useState('');
  const handleSubmit = () => {
    setIsRunning(false);
    setHidden(false)
    setStarted(false);

    if (question === parseInt(answer)) {
      setFeedback('true');
   

    }
    else {
      setFeedback('false')
    }
    saveData();
  }
  
  //Data Storage
  const [attempts, setAttempts] = useState([]);
  const [ansCount, setAnsCount] = useState(0);
  useEffect(() => {
    try{
      const SavedData = localStorage.getItem('stats');
      if (SavedData) {
        setAttempts(JSON.parse(SavedData));
      } else {
        setAttempts([]);
      }
      
    } catch {
      setAttempts([]);
    }
  }, []);

  const saveData = () => {
    const SavedData = JSON.parse(localStorage.getItem('stats') || []);
    // I am defining feedback again since  due
    //to js's asynchronous charactaristics Feedback is 1 attempt behind
    let result;
    if (parseInt(answer) === question) {
      result = 'true';
    }
    else {
      result = 'false';
    }
    const newAttempt = {
      ansCount: ansCount + 1,
      time: (time / 100).toFixed(2),
      feedback: result
    };
    SavedData.push(newAttempt);
    localStorage.setItem('stats', JSON.stringify(SavedData));
    setAttempts(SavedData);
  }
  return (
    <div>
      <div className='Settings'></div>
      <div className='Stats'>
        <ul>
          {attempts.map((attempt, index) => (
            <li key={index}>
              {index + 1} : {attempt.time} : {attempt.feedback}
            </li>
          ))}
        </ul>
      </div>
      <div className='QuestionBar'>
        <h1>{!hidden && question}</h1>
      </div>
      <div className='AnswerBox'>
        <input 
          type='Number'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          
        />
      </div>
      <div className='Buttons'>
        {!started && <button onClick={handleStart}>Start</button>}
        {started && !hidden && <button onClick={handleHide}> Ready to answer</button>}
        {started && hidden && <button onClick={handleSubmit}> Submit </button>}
        <h1>{(time / 100).toFixed(2)}</h1>
        <h1>{feedback}</h1>
      </div>
    </div>
  );
}

export default App;
