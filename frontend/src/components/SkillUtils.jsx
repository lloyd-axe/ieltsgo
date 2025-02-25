
import { DiagramAndText, Paragraph} from "./QuestionContrainers";
import { WritingBox, SingleChoice, MultipleChoice, FillBlanksComponent, 
  FillBlankTableComponent, MapTableComponent, DragDropWordsComponent} from "./AnswerComponents";

function getWritingComponents({ question, diagramUrl, testType, text, setAnswer }) {
  const minWordCount = testType === "task_1" ? 150 : 250;
  const countDownMins = testType === "task_1" ? 20 : 40;
  const isCoundDown = false;

  return [
    `Write at least ${minWordCount} words in the text box. It is recommended to complete this task within ${countDownMins} minutes.`,
    <DiagramAndText key="questionPanel" diagramUrl={diagramUrl} text={question} />,
    <WritingBox key="writingBox" minWordCount={minWordCount} text={text} setAnswer={setAnswer} />,
    isCoundDown,
    countDownMins,
  ];
}

function getSelectionComponents({ text, questions, choices_list, setAnswer, testType, skill}) {
  const countDownMins = (questions.length * 2) + 20;
  const instructions = `${skill === "reading" ? "Read": "Listen"} and answer the questions provided in the right panel. 
  ${skill === "reading" ? "The recommended completion time is " + countDownMins + " minutes.":""}`
  const isCoundDown = false;

  const right_content = testType === "single_selection" ? (
    <SingleChoice
      key="singleChoice"
      questions={questions}
      choices_list={choices_list}
      setAnswer={setAnswer}
    />
  ) : (
    <MultipleChoice
      key="multipleChoice"
      questions={questions}
      choices_list={choices_list}
      setAnswer={setAnswer}
    />
  );

  return [
    instructions,
    <Paragraph key="questionPanel" text={text} />,
    right_content,
    isCoundDown,
    countDownMins
  ];
}

function getFillBlanksComponents({ text, questions, topics, setAnswer, testType, skill}) {
  const countDownMins = (questions.length * 2) + 20;
  const instructions = `${skill === "reading" ? "Read": "Listen"} and answer the questions provided in the right panel. 
  ${skill === "reading" ? "The recommended completion time is " + countDownMins + " minutes.":""}`
  const isCoundDown = false;

  return [
    instructions,
    <Paragraph key="questionPanel" text={text} />,
    <FillBlanksComponent
        key="fillBlanks"
        questions={questions}
        topics={topics}
        setAnswer={setAnswer}
        testType={testType}
    />,
    isCoundDown,
    countDownMins
  ];
}

function getBlankTableComponents({ text, table_data, topic, setAnswer, skill}) {
  const countDownMins = (table_data.slice(1, ).length * 2) + 20;
  const instructions = `${skill === "reading" ? "Read": "Listen"} and complete the table in the right panel. 
  ${skill === "reading" ? "The recommended completion time is " + countDownMins + " minutes.":""}`
  const isCoundDown = false;
  return [
    instructions,
    <Paragraph key="questionPanel" text={text} />,
    <FillBlankTableComponent
        key="fillTable"
        table_data={table_data}
        topic={topic}
        setAnswer={setAnswer}
    />,
    isCoundDown,
    countDownMins
  ];
}

function getMapTableComponents({ text, diagramUrl, topic, num_questions, rows, setAnswer, skill}) {
  const countDownMins = (num_questions * 2) + 20;
  const instructions = `${skill === "reading" ? "Read": "Listen"} and answer the questions provided in the right panel. 
  ${skill === "reading" ? "The recommended completion time is " + countDownMins + " minutes.":""}`
  const isCoundDown = false;
  return [
    instructions,
    <DiagramAndText key="questionPanel" diagramUrl={diagramUrl} text={text} />,
    <MapTableComponent
        key="map"
        diagramUrl={diagramUrl}
        topic={topic}
        num_questions={num_questions}
        rows={rows}
        setAnswer={setAnswer}
    />,
    isCoundDown,
    countDownMins
  ];
}

function getDragDropComponents({text, word_box, questions, setAnswer, skill}) {
  const countDownMins = (questions.length * 2) + 20;
  const instructions = `${skill === "reading" ? "Read": "Listen"} and answer the questions provided in the right panel. 
  ${skill === "reading" ? "The recommended completion time is " + countDownMins + " minutes.":""}`
  const isCoundDown = false;
  return [
    instructions,
    <Paragraph key="questionPanel" text={text} />,
    <DragDropWordsComponent
        key="dragDrop"
        word_box={word_box}
        questions={questions}
        setAnswer={setAnswer} 
        />,
    isCoundDown,
    countDownMins
  ];
}

export {getWritingComponents, getSelectionComponents, 
  getFillBlanksComponents, getBlankTableComponents, getMapTableComponents, getDragDropComponents};