import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; 
import { WritingEvaluation, ScoreDisplay } from "../components/EvaluationComponents";
import { getAnswerComponents } from "../components/AnswerComponents";
import { sendAnswersToBackend } from "../services/services";
import LoadingPage from "../pages/LoadingPage"
import ActivityPageTemplate from "../components/ActivityPage";


function EvaluationPage() {
    const { skill } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const answer = location.state?.answer || "";
    const testData = location.state?.testData || [];
    const externalTime = location.state?.external_time || 0;
    const countDownMins = location.state?.countDownMins || 0;

    if (skill === "writing") 
        return <WritingEvaluation answer={answer} question={testData.context.context} testType={testData.question_sets[0].test_type} />;

    function getTestComponents({ testData, answer, externalTime,  countDownMins}) {
        const [score, setScore] = useState(null);
        const [evaluation, setEvaluation] = useState(null);
        const [evaluation_class, setEvaluationClass] = useState(null);
        const [loading, setLoading] = useState(true);
        useEffect(() => {
            const fetchEvaluation = async () => {
                setLoading(true);
                try {
                    const data = await sendAnswersToBackend(testData, answer);
                    if (data) {
                        //console.log(data);
                        setScore(data.score);
                        setEvaluation(data.evaluation);
                        setEvaluationClass(data.evaluation_class);
                    } else {
                        setScore("x");
                        setEvaluation("An error occurred while validating answers.");
                        setEvaluationClass("An error occurred while validating answers.");
                    }
                } catch (error) {
                    setScore("x");
                    setEvaluation("An error occurred while validating answers.");
                    setEvaluationClass("An error occurred while validating answers.");
                }
                setLoading(false);
            };
    
            fetchEvaluation();
        }, [testData, answer]);
    
        if (loading) return <LoadingPage text={"Checking your answers..."} />;
        return (
            <ActivityPageTemplate
                    headerNavFields={{
                        show_timer: false
                    }}
                    contentFields={{
                        right_content: <ScoreDisplay score={score} testData={testData} externalTime={externalTime} totalTime={countDownMins * 60} />, 
                        left_content: getAnswerComponents({
                            answer: answer,
                            question_sets: testData.question_sets,
                            evaluation: evaluation,
                            evaluation_class: evaluation_class
                        })}}
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
        )};

    return (
        getTestComponents({ testData:testData, answer:answer, externalTime: externalTime.current,  countDownMins:countDownMins })
    );
    
}

export default EvaluationPage;

