import { useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { LoadingSkeleton, formatTime, TypingEffect } from "../components/Utilities";
import { sendTextToBackend, sendAnswersToBackend } from "../services/services";
import { renderIcon } from "../services/icons";
import ActivityPageTemplate from "../components/ActivityPage";
import LoadingPage from "../pages/LoadingPage";
import { DiagramAndText, Paragraph} from "./QuestionContrainers";
import {SingleChoice, MultipleChoice, FillBlanksComponent, 
    FillBlankTableComponent, MapTableComponent, DragDropWordsComponent} from "./AnswerComponents";

const WritingEvaluation = ({answer, question, testType}) => {
    const [bandScore, setBandScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [improvedVersion, setImprovedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        sendTextToBackend(answer, question, testType)
            .then(({ data }) => {
                setBandScore(data.band_score);
                setEvaluation(data.evaluation);
                setImprovedVersion(data.improve_version);
            })
            .catch((error) => {
                console.error("Error sending text:", error);
                setBandScore("/");
                setEvaluation("Error: AI resources might be exhausted. Please try again tomorrow.");
                setImprovedVersion("Error: AI resources might be exhausted. Please try again tomorrow.");
            })
            .finally(() => setLoading(false));
    }, [answer, question, testType]);

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
                    {loading ? <LoadingSkeleton /> : <p className="band-score">{bandScore}</p>}
                </div>
                <div className="eval-text text-align-left">
                    {loading ? <LoadingSkeleton /> : evaluation}
                </div>
            </div>
            <hr/>
            <div className="improved-text border-style-1 color-scheme-1" style={{ position: "relative" }}>
                <button 
                    className="copy-btn"
                    onClick={copyToClipboard}>
                    {renderIcon({iconType: "copy"})}
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
                headerNavFields={{
                    show_timer: false
                }}
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

const ScoreDisplay = ({ score, testData, externalTime, totalTime}) => {
    const total_score = testData.answers.flat().length;
    const percentage = Math.round((score / total_score) * 100);
    const score_level = percentage >= 100 ? "perfect" 
    : (percentage >= 50 ? "great" 
        : (percentage >= 10 ? "poor": "nope"))

    const isOvertime = totalTime < externalTime;

    const scoreComment = {
        perfect: "Perfect! Keep it up!",
        great: "Good job! You made a few mistakes, but keep up the good work.",
        poor: "Oh no... Your score is below 50%. Don't worry—keep practicing, and you'll improve!",
        nope: "Uh-oh... It looks like you need to study a bit more..."
    }

    const timeComment = {
        perfect: isOvertime && "However, you went over the recommended time.",
        great: isOvertime && "However, you went over the recommended time.",
        poor: isOvertime && "Additionally, you went over the recommended time." ,
        nope: isOvertime && "Additionally, you went over the recommended time."
    }

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
                            {scoreComment[score_level]} {timeComment[score_level]}
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

const EvaluationComponent = ({
    testData,
    answer,
    externalTime,
    countDownMins,
    Component1,
    Component2,
    componentKey
  }) => {
    const [score, setScore] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [evaluation_class, setEvaluationClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchEvaluation = async () => {
            setLoading(true);
            const data = await sendAnswersToBackend(
                testData, 
                answer);
            if (data) {
                setScore(data.score);
                setEvaluation(data.evaluation);
                setEvaluationClass(data.evaluation_class);
            } else {
                setScore("x");
                setEvaluation("An error occurred while validating answers.");
                setEvaluationClass("An error occurred while validating answers.");
            }
            setLoading(false);
        };
        fetchEvaluation();
    }, [testData, answer]);
  
    if (loading) return <div><LoadingPage text={"Checking your answers..."}/></div>;
  
    const leftContent = (
        <div>
            <Component1
                key={componentKey}
                answer={answer}
                questions={testData.questions}
                choices_list={testData.choices}
                topic={testData.topic}
                topics={testData.topics}
                table_data={testData.table_data}
                evaluation={evaluation}
                evaluation_class={evaluation_class}
                correct_answer={testData.answers}
            />
            <hr/>
            <Component2
                text={testData.text}
            />
        </div>
        
    ); 
  
    const rightContent = (
        <ScoreDisplay score={score} testData={testData} externalTime={externalTime} totalTime={countDownMins*60}/>
    );
  
    return (
      <ActivityPageTemplate
        headerNavFields={{ show_timer: false }}
        contentFields={{ left_content: leftContent, right_content: rightContent }}
        isDoublePanel={1}
        footerNavFields={{
          back: () => navigate(`/test/selection/all`),
          show_submit: false,
          show_arrows: false,
          show_back: true,
        }}
      />
    );
};

const SingleChoiceEvaluation = (props) => (
    <EvaluationComponent
      {...props}
      Component1={SingleChoice}
      Component2={Paragraph}
      componentKey="singleChoice"
    />
);

const MultiChoiceEvaluation = (props) => (
    <EvaluationComponent
        {...props}
        Component1={MultipleChoice}
        Component2={Paragraph}
        componentKey="multiChoice"
    />
);

const MapEvaluation = (props) => (
    <EvaluationComponent
        {...props}
        Component1={MapTableComponent}
        Component2={DiagramAndText}
        componentKey="mapTable"
    />
);

const FillTableEvaluation = (props) => (
    <EvaluationComponent
        {...props}
        Component1={FillBlankTableComponent}
        Component2={Paragraph}
        componentKey="fillTable"
    />
);

const DragDropEvaluation = (props) => (
    <EvaluationComponent
        {...props}
        Component1={DragDropWordsComponent}
        Component2={Paragraph}
        componentKey="dragDrio"
    />
);

const FillBlanksEvaluation = (props) => (
    <EvaluationComponent
        {...props}
        Component1={FillBlanksComponent}
        Component2={Paragraph}
        componentKey="fillBlanks"
    />
);

const FillBlanksEvaluation1 = ({answer, testData, externalTime}) => {
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

export {WritingEvaluation, SingleChoiceEvaluation, MultiChoiceEvaluation, 
    FillBlanksEvaluation, FillTableEvaluation, MapEvaluation, DragDropEvaluation};