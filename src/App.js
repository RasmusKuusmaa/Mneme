import { useEffect, useState, useRef } from "react";
import "./App.css";
import Typed from "typed.js";

function App() {
  const [question, setQuestion] = useState("");
  const [questionLength, setQuestionLength] = useState(200);
  const [feedback, setFeedback] = useState("");

  const generateQuestion = () => {
    let newQuestion = "";
    for (let i = 0; i < questionLength; i++) {
      if (i % 3 === 0) {
        newQuestion += " ";
      }
      const digit = Math.floor(Math.random() * 10);
      newQuestion += digit.toString();
    }
    setQuestion(newQuestion);
  };

  // Timer
  const [started, setStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  const handleStart = () => {
    setStarted(true);
    setIsRunning(true);
    generateQuestion();
    setTime(0);
    setAnswer("");
  };

  const [hidden, setHidden] = useState(false);

  const handleHide = () => {
    setHidden(true);
  };

  // Submitting
  const [answer, setAnswer] = useState("");
  const handleSubmit = () => {
    setIsRunning(false);
    setHidden(false);
    setStarted(false);

    const cleanedQuestion = question.replace(/\s+/g, "");
    const cleanedAnswer = answer.replace(/\s+/g, "");
    if (cleanedQuestion === cleanedAnswer) {
      setFeedback("true");
    } else {
      setFeedback("false");
    }
    saveData(cleanedQuestion, cleanedAnswer);
  };

  // Data Storage
  const [attempts, setAttempts] = useState([]);
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("stats");
      if (savedData) {
        setAttempts(JSON.parse(savedData));
      } else {
        setAttempts([]);
      }
    } catch {
      setAttempts([]);
    }
  }, []);

  const saveData = (cleanedQuestion, cleanedAnswer) => {
    const savedData = JSON.parse(localStorage.getItem("stats") || "[]");

    const result = cleanedQuestion === cleanedAnswer ? "true" : "false";

    const newAttempt = {
      time: (time / 100).toFixed(2),
      feedback: result,
    };
    savedData.push(newAttempt);
    localStorage.setItem("stats", JSON.stringify(savedData));
    setAttempts(savedData);
  };

  const deleteData = () => {
    localStorage.setItem("stats", "[]");
    window.location.reload();
  };

  //Typing animation
  const [typedInstance, setTypedInstance] = useState(null);
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current && started && !hidden) {
      const options = {
        strings: [question],
        typeSpeed: 10,
        loop: false,
        showCursor: false,
        onComplete: () => {
          if (typedInstance) {
            typedInstance.destroy();
          }
        },
      };

      const instance = new Typed(textareaRef.current, options);
      setTypedInstance(instance);

      return () => {
        instance.destroy();
      };
    }
  }, [started, hidden, question]);


  // answer formating
  const formatInput = (value) => {
 
    const cleaned = value.replace(/\D/g, '');
    

    const formatted = cleaned.replace(/(.{3})(?=.)/g, '$1 ');

    return formatted;
  };

  const handleChange = (e) => {
    setAnswer(formatInput(e.target.value));
  };

  
  return (
    <div className="Container">
      <div className="Settings">
        <div>
          <h1>Question Length</h1>
          <input
            type="number"
            value={questionLength}
            onChange={(e) => setQuestionLength(e.target.value)}
          />
        </div>
      </div>
      <div className="Stats">
        <ul>
          {attempts.map((attempt, index) => (
            <li key={index}>
              {index + 1} : {attempt.time} : {attempt.feedback}
            </li>
          ))}
        </ul>
      </div>

      <div className="QuestionBox">
        {!hidden && started && (
          <div>
            <h1>Question: </h1>
            <textarea className="Question" ref={textareaRef} readOnly />
          </div>
        )}

        {hidden && (
          <div>
            <h1>Answer :</h1>
            <textarea
              className="Question"
              value={answer}
              onChange={handleChange}
            />
          </div>
        )}
        {!started && (
          <div className="feedbackContainer">
            <div className="feedback">
              <h1>Question</h1>
              <textarea
                className="Question"
                style={{ width: "100%" }}
                value={question}
              />
            </div>

            <div className="feedback">
              <h1>Answer: </h1>
              <textarea
                className="Question"
                style={{ width: "100%" }}
                value={answer}
              />
            </div>
          </div>
        )}
      </div>

      <div className="Buttons">
        {!started && <button onClick={handleStart}>Start</button>}
        {started && !hidden && (
          <button onClick={handleHide}>Ready to answer</button>
        )}
        {started && hidden && <button onClick={handleSubmit}>Submit</button>}
        <h1 className="Time">{(time / 100).toFixed(2)}</h1>
        <h1>{feedback}</h1>
        <button onClick={deleteData}>Delete Data</button>
      </div>
    </div>
  );
}

export default App;
