import { useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { LoadingSkeleton, formatTime } from "../components/Utilities";
import ActivityPageTemplate from "../components/ActivityPage";

import {SingleChoice, MultipleChoice, FillBlanksComponent, 
    FillBlankTableComponent, MapTableComponent, DragDropWordsComponent} from "./AnswerComponents";

const WritingEvaluation = ({answer, question, testType}) => {
    const [bandScore, setBandScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [improvedVersion, setImprovedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const sendTextToBackend = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/ieltsgo/api/validate_writing/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_response: answer, question: question , test_type: testType}),
                });

                const data = await response.json();
                if (response.ok) {
                    setBandScore(data.band_score);
                    setEvaluation(data.evaluation);
                    setImprovedVersion(data.improve_version);
                } else {
                    console.error("Response Error");
                }
            } catch (error) {
                console.error("Error sending text:", error);
                setBandScore("/");
                setEvaluation("Error: AI Resources might have been exhausted. Please come back tomorrow.");
                setImprovedVersion("Error: AI Resource has been exhaustedError: AI Resources might have been exhausted. Please come back tomorrow.");
            } finally {
                setLoading(false);
            }
        };
        sendTextToBackend();
    }, []);

    const headerNavFields = {
        show_timer: false
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(improvedVersion);
        console.log('Improved version text copied.');
    };
    
    const leftContent = (
        <div className="">
            <p className="eval-label">TASK PROMPT:</p>
            <p className="">{question}</p>
            <hr className="" />
            
            <p className="eval-label">YOUR ANSWER:</p>
            <p className="">{answer}</p>
            <hr className="" />
        </div>
    );

    const rightContent = (
        <div className="answer-container">
            <p className="eval-label">EVALUATION</p>
            <hr/>
            <div className="eval-container flex-row">
                <div className="band-score-container flex-col border-style-1 color-scheme-4">
                    <p className="eval-label" style={{ fontSize: "15px", marginTop: 0 }}>BAND SCORE:</p>
                    {loading ? <LoadingSkeleton width="100%" height="90px" /> : <p className="band-score">{bandScore}</p>}
                </div>
                <div className="eval-text text-align-left">
                    {loading ? <LoadingSkeleton width="300px" height="100px" /> : evaluation}
                </div>
            </div>
            <hr/>
            <div className="improved-text border-style-1 color-scheme-1" style={{ position: "relative" }}>
                <button 
                    className="copy-btn"
                    onClick={copyToClipboard}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clipRule="evenodd"/>
                    </svg>
                </button>
                <p className="eval-label text-align-left">Improved Version:</p>
                <div className="text-align-left">
                    {loading ? <LoadingSkeleton width="100%" height="80px" /> : improvedVersion}
                </div>
            </div>
        </div>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
                footerNavFields={
                    {
                        back: () => navigate(`/test/selection/all`),
                        show_submit: false,
                        show_arrows: false,
                        show_back: true
                    }
                }
            />
    );
};

const sendAnswersToBackend = async (
    testType, 
    answers, 
    correct_answers,
    setScore, 
    setEvaluation, 
    setLoading,
    n_choices = null 
    ) => {
    try {
        console.log('asn', answers, 'cans', correct_answers);
        const response = await fetch("http://127.0.0.1:8000/ieltsgo/api/validate_answers/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                test_type: testType,
                answers: answers,
                correct_answers: correct_answers,
                ...(n_choices !== null && { n_choices })
            }),
        });
        const data = await response.json();
        if (response.ok) {
            setScore(data.score);
            setEvaluation(data.evaluation);
        } else {
            console.error("Response Error");
        }
    } catch (error) {
        console.error("Error sending text:", error);
    } finally {
        setLoading(false);
    }
};

const ScoreDisplay = ({ score, testData, externalTime}) => {
    const total_score = testData.answers.flat().length;
    const percentage = Math.round((score / total_score) * 100);
    const score_comment = percentage >= 50 ? 
    "Great Score." 
    : "You might want to try again.";

    const navigate = useNavigate();
    return (
        <div className="score-container">
            <div className="score-card flex-col color-scheme-1">
                <div className="flex-row">
                    <div className={`percent-box flex-row ${ 
                        percentage >= 50 ? "high-score" : "low-score"}`}>
                        <span>{percentage}</span>
                        <span style={{fontSize:"25px"}}>%</span>
                    </div>
                    <div className="score-details-container">
                        <div className="score-details color-scheme-4">
                            <span className="q-line">Score: {score} / {total_score}</span>
                            <span className="q-line">Time: {formatTime(externalTime)}</span>
                        </div>
                        <div className="score-spacer"></div>
                        <span className="score-comment">
                            {score_comment}
                        </span>
                    </div>
                </div>
                <div className="score-card-footer flex-row">
                    <div className="flex-row flex-center clickable" onClick={() => navigate("/")}>
                        <b>Continue</b>
                        <svg className="score-footer-icon color-scheme-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
  };

const SingleChoiceEvaluation = ({answer, testData, externalTime}) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sendAnswersToBackend(testData.test_type, answer, testData.answers, setScore, setEvaluation, setLoading, testData.choices[0].length);
    }, [testData]);

    const headerNavFields = {
        show_timer: false
    }

    if (loading) {
        return <p>Loading...</p>; // Display a loading state
    }

    const leftContent = loading ? (
        <LoadingSkeleton width="100%" height="90px" />
    ) : (
        <SingleChoice
            key="singleChoice"
            questions={testData.questions}
            choices_list={testData.choices}
            evaluation={evaluation}
        />
    );
    

    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime}/>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
                footerNavFields={
                    {
                        back: () => navigate(`/test/selection/all`),
                        show_submit: false,
                        show_arrows: false,
                        show_back: true
                    }
                }
            />
    );
};

const MultiChoiceEvaluation = ({answer, testData, externalTime}) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sendAnswersToBackend(testData.test_type, answer, testData.answers, setScore, setEvaluation, setLoading, testData.choices[0].length);
    }, [testData]);

    const headerNavFields = {
        show_timer: false
    }

    if (loading) {
        return <p>Loading...</p>; // Display a loading state
    }

    const leftContent = loading ? (
        <LoadingSkeleton width="100%" height="90px" />
    ) : (
        <MultipleChoice
            key="multiChoice"
            questions={testData.questions}
            choices_list={testData.choices}
            evaluation={evaluation}
        />
    );
    

    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime}/>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
                footerNavFields={
                    {
                        back: () => navigate(`/test/selection/all`),
                        show_submit: false,
                        show_arrows: false,
                        show_back: true
                    }
                }
            />
    );
};

const FillBlanksEvaluation = ({answer, testData, externalTime}) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sendAnswersToBackend(testData.test_type, answer, testData.answers, setScore, setEvaluation, setLoading, testData.questions[0].length);
    }, [testData]);

    const headerNavFields = {
        show_timer: false
    }

    if (loading) {
        return <p>Loading...</p>; // Display a loading state
    }

    const leftContent = loading ? (
        <LoadingSkeleton width="100%" height="90px" />
    ) : (
        <FillBlanksComponent
            key="fillBlanks"
            answer={answer}
            questions={testData.questions}
            topics={testData.topics}
            evaluation={evaluation}
            correct_answer={testData.answers}
        />
    );
    

    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime}/>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
                footerNavFields={
                    {
                        back: () => navigate(`/test/selection/all`),
                        show_submit: false,
                        show_arrows: false,
                        show_back: true
                    }
                }
            />
    );
};

const FillTableEvaluation = ({answer, testData, externalTime}) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        sendAnswersToBackend(testData.test_type, answer, testData.answers, setScore, setEvaluation, setLoading);
    }, [testData]);

    const headerNavFields = {
        show_timer: false
    }

    if (loading) {
        return <p>Loading...</p>; // Display a loading state
    }

    const leftContent = loading ? (
        <LoadingSkeleton width="100%" height="90px" />
    ) : (
        <FillBlankTableComponent
            key="fillTable"
            answer={answer}
            table_data={testData.table_data}
            topic={testData.topic}
            evaluation={evaluation}
            correct_answer={testData.answers}
        />
    );
    

    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime}/>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
            />
    );
};

const MapEvaluation = ({answer, testData, externalTime}) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sendAnswersToBackend(testData.test_type, answer, testData.answers, setScore, setEvaluation, setLoading, testData.num_questions);
    }, [testData]);

    const headerNavFields = {
        show_timer: false
    }

    if (loading) {
        return <p>Loading...</p>; // Display a loading state
    }

    const leftContent = loading ? (
        <LoadingSkeleton width="100%" height="90px" />
    ) : (
        <MapTableComponent
            key="mapTable"
            answer={answer}
            rows={testData.rows}
            num_questions={testData.num_questions}
            topic={testData.topic}
            evaluation={evaluation}
        />
    );
    

    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime}/>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
                footerNavFields={
                    {
                        back: () => navigate(`/test/selection/all`),
                        show_submit: false,
                        show_arrows: false,
                        show_back: true
                    }
                }
            />
    );
};

const DragDropEvaluation = ({answer, testData, externalTime}) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sendAnswersToBackend(testData.test_type, answer, testData.answers, setScore, setEvaluation, setLoading, testData.num_questions);
    }, [testData]);

    const headerNavFields = {
        show_timer: false
    }

    if (loading) {
        return <p>Loading...</p>; // Display a loading state
    }

    const leftContent = loading ? (
        <LoadingSkeleton width="100%" height="90px" />
    ) : (
        <DragDropWordsComponent
            key="dragDrop"
            answer={answer}
            word_box={testData.word_box}
            questions={testData.questions}
            evaluation={evaluation}
            correct_answer={testData.answers}
        />
    );
    

    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime}/>
    );

    return (
        <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{left_content: leftContent, right_content: rightContent}}
                isDoublePanel={1}
                footerNavFields={
                    {
                        back: () => navigate(`/test/selection/all`),
                        show_submit: false,
                        show_arrows: false,
                        show_back: true
                    }
                }
            />
    );
};

export {WritingEvaluation, SingleChoiceEvaluation, MultiChoiceEvaluation, 
    FillBlanksEvaluation, FillTableEvaluation, MapEvaluation, DragDropEvaluation};