import { useEffect, useState, useRef } from "react";
import "./App.css";
import Typed from "typed.js";

function App() {
  const [defaultQuestionLength, setDefaultQuestionLength] = useState(100)
  const [question, setQuestion] = useState("");
  const [questionLength, setQuestionLength] = useState(defaultQuestionLength);
  const [feedback, setFeedback] = useState("");

  const generateQuestion = () => {
    let newQuestion = "";
    for (let i = 0; i < questionLength; i++) {
      if (i % 3 === 0 && i > 0) {
        newQuestion += " ";
      }
      const digit = Math.floor(Math.random() * 10);
      newQuestion += digit.toString();
    }
    setQuestion(newQuestion);
  };

  const [started, setStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
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

  const [answer, setAnswer] = useState("");
  const handleSubmit = () => {
    setIsRunning(false);
    setHidden(false);
    setStarted(false);

    const cleanedQuestion = question.replace(/\s+/g, "");
    const cleanedAnswer = answer.replace(/\s+/g, "");
    setFeedback(cleanedQuestion === cleanedAnswer ? "true" : "false");
    saveData(cleanedQuestion, cleanedAnswer);
  };

  // Data Storage
  

  const [attempts, setAttempts] = useState([]);
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("stats");
      const savedLength = localStorage.getItem("Length");
      if (savedData) {
        setAttempts(JSON.parse(savedData));
      } else {
        setAttempts([]);
      }
      if (savedLength) {
        setDefaultQuestionLength(JSON.parse(savedLength));
        setQuestionLength(JSON.parse(savedLength))
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
  const handleDefaultLength = (e) => {
    if (e.target.value < 100000) {
      setDefaultQuestionLength(e.target.value);
    } else {
      setDefaultQuestionLength(99999);
    }
    localStorage.setItem("Length", JSON.stringify(e.target.value));
  }


  // Typing animation
  const [animationsOn, setAnimationsOn] = useState(true);
  const [typedInstance, setTypedInstance] = useState(null);
  const textareaRef = useRef(null);
  useEffect(() => {
    if (animationsOn && textareaRef.current && started && !hidden) {
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
  }, [animationsOn, started, hidden, question]);

  // Answer formatting
  const formatInput = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(.{3})(?=.)/g, "$1 ");
    return formatted;
  };

  const handleChange = (e) => {
    setAnswer(formatInput(e.target.value));
  };

  //  focus
  const initialFocus = useRef(null);
  useEffect(() => {
    if (initialFocus.current) {
      initialFocus.current.focus();
    }
  }, [!started, hidden]);
  const pageFocus = useRef(null);
  useEffect(() => {
    if (hidden && pageFocus.current) {
      setTimeout(() => {
        pageFocus.current.focus();
      }, 0);
    }
  }, [hidden]);

  // Change between Stats and settings;
  const [statsOn, setStatsOn] = useState(false);

  return (
    <div
      className="Container"
      tabIndex={0}
      ref={initialFocus}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (!started) {
            handleStart();
          } else if (!hidden) {
            handleHide();
          } else if (hidden) {
            handleSubmit();
          }
        }
      }}
    >
      <div className="Statset">
        <button onClick={() => setStatsOn(true)}>Stats</button>
        <button onClick={() => setStatsOn(false)}>Settings</button>
      </div>

      {statsOn && (
        <div className="Stats">
          <ul>
            {attempts.map((attempt, index) => (
              <li key={index}>
                {index + 1} : {attempt.time} : {attempt.feedback}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!statsOn && (
        <div className="Stats">
          <div className="settingButton">
            <h1>
              Question Length:
              <input className="Settingchange"
                type="number"
                value={questionLength}
                onChange={(e) => {
                  if (e.target.value < 100000) {
                    setQuestionLength(e.target.value);
                  } else {
                    setQuestionLength(99999);
                  }
                }}
              />
            </h1>
          </div>
          <div className="settingButton">
          <h1>
              Default Length:
              <input className="Settingchange"
                type="number"
                value={defaultQuestionLength}
                onChange={(e) => handleDefaultLength(e)}
              />
            </h1>
          </div>
          <div className="settingButton" >
            <h1>Animations: </h1>
            <button className="AnimationToggle" onClick={() => setAnimationsOn(!animationsOn)} id={animationsOn ? "AnimationToggleon" : "AnimationToggleOff"}>On</button>
          </div>

          <button className="deleteDataButton" onClick={deleteData}>
            Delete Data
          </button>
        </div>
      )}

      <div className="QuestionBox">
        {!hidden && started && (
          <div>
            <h1>Question: </h1>
            { animationsOn && <textarea className="Question" ref={textareaRef} readOnly />}
            { !animationsOn && <textarea className="Question" value={question} readOnly />}

            
          </div>
        )}

        {hidden && (
          <div>
            <h1>Answer :</h1>
            <textarea
              className="Question"
              ref={pageFocus}
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
                readOnly
              />
            </div>

            <div className="feedback">
              <h1>Answer: </h1>
              <textarea
                className="Question"
                style={{ width: "100%" }}
                value={answer}
                readOnly
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
      </div>
    </div>
  );
}

export default App;
