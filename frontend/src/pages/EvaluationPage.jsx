import { useLocation, useParams } from "react-router-dom";
import { WritingEvaluation, SingleChoiceEvaluation, MultiChoiceEvaluation, 
    FillBlanksEvaluation, FillTableEvaluation, MapEvaluation, 
    DragDropEvaluation} from "../components/EvaluationComponents";


function EvaluationPage() {
    const { skill } = useParams();
    const location = useLocation();
    const answer = location.state?.answer || "";
    const testData = location.state?.testData || [];
    const externalTime = location.state?.external_time || 0;
    const countDownMins = location.state?.countDownMins || 0;

    console.log(testData);

    const componentMap = {
        writing: <WritingEvaluation answer={answer} question={testData.question} testType={testData.test_type} />,
        single_selection: <SingleChoiceEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        double_selection: <MultiChoiceEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        fill_sentence_1: <FillBlanksEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        fill_sentence_2: <FillBlanksEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        fill_list: <FillBlanksEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        fill_table: <FillTableEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        map: <MapEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        word_box: <DragDropEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
        flow_chart: <DragDropEvaluation answer={answer} testData={testData} externalTime={externalTime} countDownMins={countDownMins}/>,
    };

    const evaluationComponent = 
    skill === "writing"
    ? componentMap.writing
    : componentMap[testData.test_type] || <p>ERROR.</p>;

  return <>{evaluationComponent}</>;
    
}

export default EvaluationPage;

