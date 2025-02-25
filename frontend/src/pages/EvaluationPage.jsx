import { useLocation, useParams } from "react-router-dom";
import { WritingEvaluation, SingleChoiceEvaluation, MultiChoiceEvaluation, 
    FillBlanksEvaluation, FillTableEvaluation, MapEvaluation, DragDropEvaluation} from "../components/EvaluationComponents";


function EvaluationPage() {
    const { skill } = useParams();
    const location = useLocation();
    const answer = location.state?.answer || "";
    const question = location.state?.question || "No prompt available.";
    const testType = location.state?.testType || "";
    const testData = location.state?.testData || [];
    const externalTime = location.state?.external_time || 0;

    let evaluationComponent = <p>No valid evaluation found.</p>;

    if (skill === 'writing') {
        evaluationComponent = (
            <WritingEvaluation answer={answer} question={question} testType={testType} />
        );
    } else if (testData.test_type === 'single_selection') {
        evaluationComponent = (
            <SingleChoiceEvaluation answer={answer} testData={testData} externalTime={externalTime}/>
        );
    } else if (testData.test_type === 'double_selection') {
        evaluationComponent = (
            <MultiChoiceEvaluation answer={answer} testData={testData} externalTime={externalTime}/>
        );
    } else if (testData.test_type === 'fill_sentence_1' 
        || testData.test_type === 'fill_sentence_2'
        || testData.test_type === 'fill_list') {
        evaluationComponent = (
            <FillBlanksEvaluation answer={answer} testData={testData} externalTime={externalTime}/>
        );
    } else if (testData.test_type === 'fill_table') {
        evaluationComponent = (
            <FillTableEvaluation answer={answer} testData={testData} externalTime={externalTime}/>
        );
    } else if (testData.test_type === 'map') {
        evaluationComponent = (
            <MapEvaluation answer={answer} testData={testData} externalTime={externalTime}/>
        );
    } else if (testData.test_type === 'word_box'
        || testData.test_type === 'flow_chart') {
        evaluationComponent = (
            <DragDropEvaluation answer={answer} testData={testData} externalTime={externalTime}/>
        );
    } 

    return <div>{evaluationComponent}</div>;
    
}

export default EvaluationPage;

