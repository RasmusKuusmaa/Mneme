import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [questionLength, setQuestionLength] = useState(2);
  const [feedback, setFeedback] = useState('');

  const generateQuestion = () => {
    let newQuestion = "";
    for (let i = 0; i < questionLength; i++) {
      if (i % 3 === 0) {
        newQuestion += ' '
      }
      const digit = Math.floor(Math.random() * 10);
      newQuestion += digit.toString();
    }
    setQuestion(newQuestion);
  }

  // Timer
  const [started, setStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 10);
      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

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

  // Submitting
  const [answer, setAnswer] = useState('');
  const handleSubmit = () => {
    setIsRunning(false);
    setHidden(false);
    setStarted(false);
  
    const cleanedQuestion = question.replace(/\s+/g, '');
    if (cleanedQuestion === answer) {
      setFeedback('true');
    } else {
      setFeedback('false');
    }
    saveData(cleanedQuestion); 
  }
  

  // Data Storage
  const [attempts, setAttempts] = useState([]);
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('stats');
      if (savedData) {
        setAttempts(JSON.parse(savedData));
      } else {
        setAttempts([]);
      }
    } catch {
      setAttempts([]);
    }
  }, []);

  const saveData = (cleanedQuestion) => {
    const savedData = JSON.parse(localStorage.getItem('stats') || '[]');
    
    const result = cleanedQuestion === answer ? 'true' : 'false';
  
    const newAttempt = {
      time: (time / 100).toFixed(2),
      feedback: result
    };
    savedData.push(newAttempt);
    localStorage.setItem('stats', JSON.stringify(savedData));
    setAttempts(savedData);
  }

  const deleteData = () => {
    localStorage.setItem('stats', '[]');
    window.location.reload();
  }

  return (
    <div className='Container'>
      <div className='Settings'> 
      <div>
          <h1> Question Length:</h1>
          <input 
            type='number'
            value={questionLength}
            onChange={(e) => setQuestionLength(e.target.value)}
          />
        </div>
      </div>
      <div className='Stats'>
        <ul>
          {attempts.map((attempt, index) => (
            <li key={index}>
              {index + 1} : {attempt.time} : {attempt.feedback}
            </li>
          ))}
        </ul>
      </div>
      
      <div className='QuestionBox'>
        
        {!hidden && started && <div> 
        <h1>Question :</h1>
        <textarea className='Question'
        value={question}
        
        />
        </div>
        }
                  
        {hidden &&
          <div> 
          <h1>Answer : </h1>
          <textarea className='Question'
          
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          </div>
        }
        {!started &&
          <div className='feedbackContainer'>
            <div className='feedback'>
              <h1>Question : </h1>
              <textarea className='Question' style={{width: '100%'}}
                value={question}
               />
            </div>
    
            <div className='feedback'>
              <h1>Answer : </h1>
              <textarea className='Question' style={{width: '100%'}}
                value={answer}
               />
       
            </div>
          </div>
        }
      </div>

      <div className='Buttons'>
        {!started && <button onClick={handleStart}>Start</button>}
        {started && !hidden && <button onClick={handleHide}>Ready to answer</button>}
        {started && hidden && <button onClick={handleSubmit}>Submit</button>}
        <h1 className='Time'>{(time / 100).toFixed(2)}</h1>
        <h1>{feedback}</h1>
        <button onClick={deleteData}>Delete Data</button>
      </div>
    </div>
  );
}

export default App;