import { useEffect, useState } from "react";
// import logo from './logo.svg';
import axios from "axios";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const callQuiz = () => {
    axios
      .get("http://localhost:3000/questions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the questions!", error);
      });
  };
  useEffect(() => {
    callQuiz();
    const savedLeaderboard =
      JSON.parse(localStorage.getItem("leaderboard")) || [];
    setLeaderboard(savedLeaderboard);
  }, []);

  const handleChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = (event) => {
    let newScore = 0;
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    const newEntry = { name, score: newScore };
    alert(`${name}, your score: ${newScore} out of ${questions.length}`);
    const updatedLeaderboard = [...leaderboard, newEntry];
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
    setLeaderboard(updatedLeaderboard);
    setAnswers({});
    setIsQuizStarted(false);
    setName("");
  };

  const startQuiz = () => {
    if (name.trim()) {
      setIsQuizStarted(true);
    } else {
      alert("Please enter your name to start the quiz.");
    }
  };

  const clearScore = () => {
    localStorage.clear();
    setLeaderboard([]);
  };

  if (questions.length <= 0) {
    return (
      <div className="App">
        <header className="App-header">
          Please run backend to get a questions
          <button
            className="button"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {!isQuizStarted ? (
          <div>
            <h1>Enter your name to start the quiz</h1>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <button
              className="button green"
              style={{ marginLeft: "20px" }}
              onClick={startQuiz}
            >
              Start Quiz
            </button>
            <button
              className="button red"
              style={{ marginLeft: "20px" }}
              onClick={clearScore}
            >
              Clear All Score
            </button>
          </div>
        ) : (
          <>
            <h1>
              Quiz Hello <br></br>
              {name}
            </h1>
            <div className="quizContent">
              {questions.map((question, index) => (
                <div className="quizTopic" key={index}>
                  <h5 style={{ padding: 0, margin: "0 0 15px 0" }}>
                    {question.question}
                  </h5>
                  <div>
                    {question.answers.map((answer, i) => (
                      <div key={i} className="choice">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={answer}
                          checked={answers[index] === answer}
                          onChange={() => handleChange(index, answer)}
                        />
                        <label>{answer}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {isQuizStarted && (
          <>
            <button onClick={handleSubmit} className="submit">
              Submit
            </button>
          </>
        )}

        <div>
          {!isQuizStarted && (
            <>
              <h2>Leaderboard</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "150px" }}>Name</th>
                    <th style={{ width: "150px" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td style={{ borderBottom: "1px solid #ffffff" }}>
                        {entry.name}
                      </td>
                      <td style={{ borderBottom: "1px solid #ffffff" }}>
                        {entry.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
