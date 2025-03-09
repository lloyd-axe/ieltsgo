import { useState } from "react";
import { TypingEffect } from "../components/Utilities";
import { Diagram } from "../components/QuestionContrainers";

const WritingBox = ({ minWordCount, text, setAnswer }) => {
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    return (
        <div className="writing-box">
            <textarea
                className="writing-textarea custom-scroll"
                placeholder="Start typing here..."
                value={text}
                spellCheck="false"
                onChange={(e) => setAnswer(e.target.value)}
                style={{border: `${wordCount < minWordCount ? "2px solid #d1d5db": "2px solid rgb(163, 223, 164)"}`}}
            />
            <div className="word-counter-label">
                Words: <span style={{ color: wordCount < minWordCount ? "red" : "inherit" }}>{wordCount}</span>
            </div>
        </div>
    );
};

const SingleChoice = ({ ans_name, start_num, questions, choices_list, setAnswer = () => {}, evaluation = {}, evaluation_class = {}}) => {
    const [selectedChoices, setSelectedChoices] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation).length === 0;

    const handleChange = (q_idx, choice) => {
        const updatedChoices = { ...selectedChoices, [q_idx]: choice };
        setSelectedChoices(updatedChoices);
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            [ans_name]: updatedChoices
        }));
    };

    return (
        <div className="answer-container-box">
            <div className="q-description">{isEvaluationEmpty ? `Questions ${start_num}-${start_num + questions.length - 1}` : "SOLUTION:"}</div>
            <div>Choose <b>ONE</b> correct answer from the choices below.</div>
            <div className="q-body">
                {questions.map((question, q_idx) => (
                    <div className="q-block" key={q_idx}>
                        <div className="q-line flex-col">
                            <div className="flex-row"><b>{q_idx + start_num}</b>. {question}</div>
                        </div>
                        <div className="flex-col">
                            {choices_list[q_idx]?.map((choice, c_idx) => (
                                <label
                                    key={c_idx}
                                    className={`q-line marker custom-radio ${isEvaluationEmpty ? "" : "radio-disabled"}`}
                                    >
                                    <input
                                        type="radio"
                                        name={`single-choice-${q_idx}`}
                                        value={choice}
                                        checked={
                                            !Boolean(isEvaluationEmpty)
                                                ? evaluation_class[q_idx]?.[c_idx] === 'correct' || evaluation_class[q_idx]?.[c_idx] === 'wrong'
                                                : selectedChoices[q_idx] === c_idx
                                        }
                                        onChange={() => handleChange(q_idx, c_idx)}
                                        disabled={!isEvaluationEmpty}
                                    />
                                    
                                    {choice}
                                    <span className={`radio-checkmark ${evaluation_class[q_idx]?.[c_idx] || ''}`}></span>
                                </label>
                            ))}
                        </div>
                        <br/>
                        {!isEvaluationEmpty && 
                            <div className="evaluation-text color-scheme-4">
                                <TypingEffect text={evaluation[q_idx]}/>
                            </div>
                        }
                    </div>
                ))}
            </div>
            {!isEvaluationEmpty && (
                <p className="ai-disclaimer">The answers above are definitely correct. But the AI responses may contain mistakes. Please verify all important information.</p>
            )}
        </div>
    );
};

const MultipleChoice = ({ ans_name, start_num, questions, choices_list, setAnswer = () => {}, evaluation = {}, evaluation_class = {}}) => {
    const [selectedChoices, setSelectedChoices] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;

    const handleCheckboxChange = (q_idx, c_idx) => {
        setSelectedChoices((prevChoices) => {
            const currentSelections = prevChoices[q_idx] || [];

            if (currentSelections.includes(c_idx)) {
                const updatedSelections = currentSelections.filter((idx) => idx !== c_idx);
                const updatedChoices = { ...prevChoices, [q_idx]: updatedSelections };
                setAnswer(prevAnswer => ({
                    ...prevAnswer,
                    [ans_name]: updatedChoices
                }));
                return updatedChoices;
            }

            if (currentSelections.length >= 2) return prevChoices;

            const updatedSelections = [...currentSelections, c_idx];
            const updatedChoices = { ...prevChoices, [q_idx]: updatedSelections };
            setAnswer(prevAnswer => ({
                ...prevAnswer,
                [ans_name]: updatedChoices
            }));
            return updatedChoices;
        });
    };

    return (
        <div className="answer-container-box">
            <div className="q-description">{isEvaluationEmpty ? `Questions ${start_num}-${start_num + questions.length - 1}` : "SOLUTION:"}</div>
            <div>Choose <b>TWO</b> correct answers from the choices below.</div>
            <div className="q-body">
                {questions.map((question, q_idx) => {
                    const maxSelectionsReached = (selectedChoices[q_idx]?.length || 0) >= 2;

                    return (
                        <div className="q-block" key={q_idx}>
                            <div className="q-line flex-col">
                                <div className="flex-row"><b>{q_idx + start_num}</b>. {question}</div>
                            </div>
                            <div className="flex-col">
                                {choices_list[q_idx]?.map((choice, c_idx) => (
                                    <label
                                        key={c_idx}
                                        className={`q-line custom-check ${isEvaluationEmpty ? "" : "check-disabled"}`}>
                                        <input
                                            type="checkbox"
                                            name={`multi-choice-${q_idx}-${c_idx}`}
                                            value={choice}
                                            checked={
                                                !Boolean(isEvaluationEmpty)
                                                    ? evaluation_class[q_idx]?.[c_idx] === 'correct' || evaluation_class[q_idx]?.[c_idx] === 'wrong'
                                                    : selectedChoices[q_idx]?.includes(c_idx) || false
                                            }
                                            onChange={() => handleCheckboxChange(q_idx, c_idx)}
                                            disabled={
                                                !Boolean(isEvaluationEmpty) 
                                                ? !isEvaluationEmpty 
                                                : maxSelectionsReached && !selectedChoices[q_idx]?.includes(c_idx)}
                                        />
                                        <span className={`checkmark ${evaluation_class[q_idx]?.[c_idx] || ''}`}></span>
                                        {choice}
                                    </label>
                                ))}
                            </div>
                            <br/>
                            {!isEvaluationEmpty && 
                                <div className="evaluation-text color-scheme-4">
                                    <TypingEffect text={evaluation[q_idx]}/>
                                </div>
                            }
                        </div>
                    );
                })}
            </div>
            {!isEvaluationEmpty && (
                <p className="ai-disclaimer">The answers above are definitely correct. But the AI responses may contain mistakes. Please verify all important information.</p>
            )}
        </div>
    );
};

const FillBlanksComponent = ({ ans_name, start_num, topics, questions, setAnswer = () => {}, evaluation = {}, answer = {}, correct_answer = {}, evaluation_class = {}}) => {
    const [answers, setAnswers] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;
    let box_idx = 0;

    const handleChange = (t_idx, c_idx, value) => {
        const updatedAnswers = {
            ...answers,
            [t_idx]: {
                ...answers[t_idx],
                [c_idx]: value
            }
        };
        
        setAnswers(updatedAnswers);
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            [ans_name]: updatedAnswers
        }));
    };

    const renderQuestionWithInputs = (question, t_idx, c_idx, box_idx) => {
        const parts = question.split(/(\|\d+\|)/);
        return (
            <span>
                {parts.map((part, idx) => {
                    const match = part.match(/\|(\d+)\|/);
                    if (match) {
                        const inputKey = `${t_idx}-${c_idx}-${idx}`;
                        return (
                            <input
                                key={inputKey}
                                type="text"
                                value={
                                    !Boolean(isEvaluationEmpty) 
                                    ? (
                                        evaluation_class[t_idx]?.[c_idx] !== "correct"
                                        ? (
                                            answer[t_idx]?.[c_idx]
                                            ? `${answer[t_idx]?.[c_idx]} ( ${correct_answer[t_idx]?.[c_idx]} )`
                                            : `( ${correct_answer[t_idx]?.[c_idx]} )`
                                        )
                                        : answer[t_idx]?.[c_idx]
                                    )
                                    : (answers[t_idx]?.[c_idx] ?? "")
                                }
                                onChange={(e) =>
                                    handleChange(t_idx, c_idx, e.target.value)
                                }
                                className={`custom-textbox-input ${evaluation_class[t_idx]?.[c_idx] || ''}`}
                                placeholder={box_idx + start_num - 1}
                                disabled={!isEvaluationEmpty}
                            />
                        );
                    }
                    return <span key={idx}>{part}</span>;
                })}
            </span>
        );
    };
    console.log(topics);
    console.log(questions);
    return (
        <div className="answer-container-box">
            <div className="q-description">{isEvaluationEmpty ? `Questions ${start_num}-${questions.flat().length+ start_num -1}` : "SOLUTION:"}</div>
            <div>Complete the sentences. Write a <b>WORD / NUMBER</b> in each text box.</div>
            
            <div className="q-body">
                {topics.map((topic, t_idx) => (
                    <div className="q-block" key={t_idx}>
                        <div className="q-line flex-row">
                            <b>{topic}</b>
                        </div>
                        <ul>
                            {questions[t_idx]?.map((question, c_idx) => {
                                box_idx += 1;
                                return (
                                    <li key={c_idx} className="q-line custom-textbox">
                                        {renderQuestionWithInputs(question, t_idx, c_idx, box_idx)}
                                        <div className="q-line flex-col">
                                        {!isEvaluationEmpty && 
                                            <div className="evaluation-text color-scheme-4">
                                                <TypingEffect text={evaluation[c_idx]}/>
                                            </div>
                                        }
                                    </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            {!isEvaluationEmpty && (
                <p className="ai-disclaimer">The answers above are definitely correct. But the AI responses may contain mistakes. Please verify all important information.</p>
            )}
        </div>
    );
};

const FillBlankTableComponent = ({ ans_name, start_num, topic, table_data, setAnswer = () => {}, evaluation = {}, answer = {}, correct_answer = {}, evaluation_class = {}}) => {
    const [answers, setAnswers] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;

    const handleChange = (t_idx, value) => {
        const updatedAnswers = { ...answers, [t_idx]: value };
        setAnswers(updatedAnswers);
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            [ans_name]: updatedAnswers
        }));
    };

    const renderQuestionWithInputs = (question, t_idx, c_idx) => {
        const parts = question.split(/(\|\d+\|)/);
        return (
            <span>
                {parts.map((part, p_idx) => {
                    const match = part.match(/\|(\d+)\|/);
                    if (match) {
                        const inputKey = `${t_idx}-${c_idx}-${p_idx}`;
                        return (
                            <input
                                key={inputKey}
                                type="text"
                                value={
                                    !Boolean(isEvaluationEmpty) 
                                    ? (
                                        evaluation_class[t_idx] !== "correct"
                                        ? (
                                            answer[t_idx]
                                            ? `${answer[t_idx]} ( ${correct_answer[t_idx]} )`
                                            : `( ${correct_answer[t_idx]} )`
                                        )
                                        : answer[t_idx]
                                    )
                                    : (answers[t_idx] ?? "")
                                }
                                onChange={(e) =>
                                    handleChange(t_idx, e.target.value)
                                }
                                className={`custom-textbox-input ${evaluation_class[t_idx] || ''}`}
                                placeholder={parseInt(match[1], 10) + start_num}
                                disabled={!isEvaluationEmpty}
                            />
                        );
                    }
                    return <span key={p_idx}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <div className="answer-container-box">
            <div className="q-description">{isEvaluationEmpty ? `Questions ${start_num} - ${start_num + table_data.slice(1, ).length - 1}` : "SOLUTION:"}</div>
            <div>Complete the table. Write <b>ONE WORD</b> only in each text box.</div>
            <div className="q-body">
                <div className="q-line flex-col">
                    <div className="flex-row"><b>{topic}</b></div>
                </div>
                <table className="custom-table">
                    <thead>
                        <tr>
                            {table_data[0].map((column_name, c_idx) => (
                                <th key={c_idx}>{column_name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table_data.slice(1, ).map((row, r_idx) => (
                            <tr key={r_idx}>
                                {row.map((r_data, d_idx) => (
                                    <td key={d_idx}>
                                        {renderQuestionWithInputs(r_data, r_idx, d_idx)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isEvaluationEmpty && 
                    evaluation.map((eval_comment, e_idx) => (
                        <div key={e_idx} className="evaluation-text color-scheme-4">
                            {e_idx+1}. <TypingEffect text={eval_comment} />
                        </div>
                    ))
                }
                {!isEvaluationEmpty && (
                    <p className="ai-disclaimer">The answers above are definitely correct. But the AI responses may contain mistakes. Please verify all important information.</p>
                )}
            </div>
        </div>
    );
};

const MapTableComponent = ({ ans_name, start_num, topic, num_questions, rows, setAnswer = () => {}, evaluation = {}, evaluation_class = {}, diagram_url = null}) => {
    const [selectedChoices, setSelectedChoices] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;
    console.log('img', diagram_url);
    const handleChange = (q_idx, choice) => {
        const updatedChoices = { ...selectedChoices, [q_idx]: choice };
        setSelectedChoices(updatedChoices);
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            [ans_name]: updatedChoices
        }));
    };

    return (
        <div className="answer-container-box">
            {diagram_url && <Diagram diagramUrl={diagram_url}/>}
            <div className="q-description">{isEvaluationEmpty ? `Questions ${start_num}-${start_num + rows.length - 1}` : "SOLUTION:"}</div>
            <div>Choose <b>ONE</b> correct answer from the choices below.</div>
            <div className="q-body">
                <b>{topic}</b>
                <table className="map-table">
                    <thead>
                        <tr>
                            <th className="spacer-col"></th>
                            {Array.from({ length: num_questions }, (_, i) => String.fromCharCode(97 + i)).map((letter, c_idx) => (
                                <th key={c_idx} >{letter}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, r_idx) => (
                            <tr key={r_idx}>
                                <th>{r_idx+start_num}. {row}</th>
                                {Array.from({ length: num_questions}, (_, i) => String.fromCharCode(97 + i)).map((i, c_idx) => (
                                    <td key={c_idx}>
                                        <div className="map-cell">
                                            <label key={c_idx}
                                                className={`marker custom-radio ${isEvaluationEmpty ? "" : "radio-disabled"}`}
                                                >
                                                <input
                                                    type="radio"
                                                    name={`single-choice-${r_idx}`}
                                                    checked={
                                                        !Boolean(isEvaluationEmpty)
                                                            ? evaluation_class[r_idx]?.[c_idx] === 'correct' || evaluation_class[r_idx]?.[c_idx] === 'wrong'
                                                            : selectedChoices[r_idx] === c_idx
                                                    }
                                                    onChange={() => handleChange(r_idx, c_idx)}
                                                    className={`${evaluation_class[r_idx]?.[c_idx] || ''}`}
                                                    disabled={!isEvaluationEmpty}
                                                />
                                                <span class={`radio-checkmark ${evaluation_class[r_idx]?.[c_idx] || ''}`}></span>
                                            </label>
                                        </div>
                                        
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isEvaluationEmpty && 
                    evaluation.map((eval_comment, e_idx) => (
                        <div key={e_idx} className="evaluation-text color-scheme-4">
                            {e_idx+1}. <TypingEffect text={eval_comment} />
                        </div>
                    ))
                }
                {!isEvaluationEmpty && (
                    <p className="ai-disclaimer">The answers above are definitely correct. But the AI responses may contain mistakes. Please verify all important information.</p>
                )}
            </div>
        </div>
    );
};

const DragDropWordsComponent = ({ ans_name, start_num, word_box, questions, setAnswer = () => {}, evaluation = {}, answer = {}, correct_answer = {}, evaluation_class = {}}) => {
    const [inputValues, setInputValues] = useState({});
    const [draggingOver, setDraggingOver] = useState(false);
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;
    const [currentDraggedWord, setCurrentDraggedWord] = useState(null);
    
    const renderQuestionWithInputs = (question, q_idx) => {
        const parts = question.split(/(\|\d+\|)/);
        return (
            <span>
                {parts.map((part, idx) => {
                    const match = part.match(/\|(\d+)\|/);
                    if (match) {
                        const inputKey = `${q_idx}-${idx}`;
                        return (
                            <input
                                key={inputKey}
                                type="text"
                                value={
                                    !Boolean(isEvaluationEmpty) 
                                    ? (
                                        evaluation_class[q_idx] !== "correct"
                                        ? (
                                            answer[q_idx]
                                            ? `${answer[q_idx]} ( ${correct_answer[q_idx]} )`
                                            : `( ${correct_answer[q_idx]} )`
                                        )
                                        : answer[q_idx]
                                    )
                                    : (inputValues[q_idx] ?? "")
                                }
                                readOnly
                                className={`custom-textbox-input ${draggingOver ? 'dragging' : ''} ${evaluation_class[q_idx] || ''}`}
                                placeholder={`${q_idx + start_num}`}
                                onDragOver={() => setDraggingOver(true)}
                                onDragLeave={() => setDraggingOver(false)}
                                disabled={!isEvaluationEmpty}
                            />
                        );
                    }
                    return <span key={idx}>{part}</span>;
                })}
            </span>
        );
    };

    const handleTouchStart = (word) => {
        setCurrentDraggedWord(word);
    };
    
    const handleTouchEnd = (boxId) => {
        if (currentDraggedWord) {
            setInputValues((prev) => ({ ...prev, [boxId]: currentDraggedWord }));
            //setAnswer((prev) => ({ ...prev, [boxId]: currentDraggedWord }));
            setAnswer(prevAnswer => ({
                ...prevAnswer,
                [ans_name]: {
                  ...prevAnswer[ans_name],  // Preserve existing values inside ans_name
                  [boxId]: currentDraggedWord
                }
              }));
        }
        setCurrentDraggedWord(null);
    };

    const handleDragStart = (e, word) => {
        e.dataTransfer.setData('text/plain', word);
    };

    const handleDrop = (e, boxId) => {
        const droppedWord = e.dataTransfer.getData('text/plain');
        setInputValues((prev) => ({ ...prev, [boxId]: droppedWord }));
        //setAnswer({ ...inputValues, [boxId]: droppedWord });
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            [ans_name]: {
              ...prevAnswer[ans_name],  // Preserve existing values inside ans_name
              [boxId]: droppedWord
            }
          }));
        e.preventDefault();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="answer-container-box">
            <div className="q-description">{isEvaluationEmpty ? `Questions ${start_num}-${questions.length + start_num - 1}` : "SOLUTION:"}</div>
            <div>Select the appropriate word from the word box and place it in the correct space below.</div>
            <div className="q-body">
                {isEvaluationEmpty && (
                    <div className="q-block">
                        <div className="word-box flex-row">
                            {word_box.map((word, index) => (
                                <span
                                    key={index}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, word)}
                                    onTouchStart={() => handleTouchStart(word)}
                                    className={`word-box-word clickable color-scheme-4 ${
                                        Object.values(inputValues).includes(word)
                                            ? 'invisible'
                                            : 'bg-blue-500 text-white'
                                    }`}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="q-block word-box-questions">
                        {questions.map((question, q_idx) => {
                            const hasPlaceholder = /\|\d+\|/.test(question);
                            return (
                                <div key={q_idx} className="q-line">
                                    <div onDrop={(e) => hasPlaceholder ? handleDrop(e, q_idx) : undefined}
                                        onDragOver={handleDragOver}
                                        onTouchEnd={() => hasPlaceholder ? handleTouchEnd(q_idx) : undefined}
                                        >
                                        <b>{q_idx+start_num}.</b> {renderQuestionWithInputs(question, q_idx)}
                                        <div className="q-line flex-col">
                                            {!isEvaluationEmpty && 
                                                <div className="evaluation-text color-scheme-4">
                                                    <TypingEffect text={evaluation[q_idx]}/>
                                                </div>
                                            }
                                        </div> 
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
            {!isEvaluationEmpty && (
                <p className="ai-disclaimer">The answers above are definitely correct. But the AI responses may contain mistakes. Please verify all important information.</p>
            )}
        </div>
    );
};

const answerComponentMap = {
    task_1: ({ questionData, q_idx, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null}) => 
        <WritingBox key={`writingBox${q_idx}`} minWordCount={150} text={answer} setAnswer={setAnswer} />,
    task_2: ({ questionData, q_idx, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <WritingBox key={`writingBox${q_idx}`} minWordCount={250} text={answer} setAnswer={setAnswer} />,
    single_selection: ({ questionData, q_idx, startNum, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <SingleChoice
        key={`${questionData.test_type}_${q_idx}`}
        ans_name={`${questionData.test_type}_${q_idx}`}
        start_num={startNum}
        questions={questionData.questions}
        choices_list={questionData.choices}
        setAnswer={setAnswer}
        evaluation={evaluation}
        evaluation_class={evaluation_class}
        correct_answer={questionData.answers}
        answer={answer?.[`${questionData.test_type}_${q_idx}`]}
        />,
    double_selection: ({ questionData, q_idx, startNum, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <MultipleChoice
        key={`${questionData.test_type}_${q_idx}`}
        ans_name={`${questionData.test_type}_${q_idx}`}
        start_num={startNum}
        questions={questionData.questions}
        choices_list={questionData.choices}
        setAnswer={setAnswer}
        evaluation={evaluation}
        evaluation_class={evaluation_class}
        correct_answer={questionData.answers}
        answer={answer?.[`${questionData.test_type}_${q_idx}`]}
        />,
    fill_table: ({ questionData, q_idx, startNum, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <FillBlankTableComponent
            key={`${questionData.test_type}_${q_idx}`}
            ans_name={`${questionData.test_type}_${q_idx}`}
            start_num={startNum}
            table_data={questionData.table_data}
            topic={questionData.topics[0]}
            setAnswer={setAnswer}
            evaluation={evaluation}
            evaluation_class={evaluation_class}
            correct_answer={questionData.answers}
            answer={answer?.[`${questionData.test_type}_${q_idx}`]}
        />,
    map: ({ questionData, q_idx, startNum, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <MapTableComponent
            key={`${questionData.test_type}_${q_idx}`}
            ans_name={`${questionData.test_type}_${q_idx}`}
            start_num={startNum}
            topic={questionData.topics[0]}
            num_questions={questionData.table_data[0].length}
            rows={questionData.table_data[1]}
            setAnswer={setAnswer}
            evaluation={evaluation}
            evaluation_class={evaluation_class}
            correct_answer={questionData.answers}
            answer={answer?.[`${questionData.test_type}_${q_idx}`]}
            diagram_url={diagram_url}
        />, 
    word_box: ({ questionData, q_idx, startNum, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <DragDropWordsComponent
            key={`${questionData.test_type}_${q_idx}`}
            ans_name={`${questionData.test_type}_${q_idx}`}
            start_num={startNum}
            word_box={questionData.word_box}
            questions={questionData.questions}
            setAnswer={setAnswer}
            evaluation={evaluation}
            evaluation_class={evaluation_class}
            correct_answer={questionData.answers}
            answer={answer?.[`${questionData.test_type}_${q_idx}`]}
            />,
    default: ({ questionData, q_idx, startNum, setAnswer, answer = null, evaluation = {}, evaluation_class = {}, diagram_url=null }) => 
        <FillBlanksComponent
        key={`${questionData.test_type}_${q_idx}`}
        ans_name={`${questionData.test_type}_${q_idx}`}
        start_num={startNum}
        questions={questionData.questions}
        topics={questionData.topics}
        setAnswer={setAnswer}
        evaluation={evaluation}
        evaluation_class={evaluation_class}
        correct_answer={questionData.answers}
        answer={answer?.[`${questionData.test_type}_${q_idx}`]}
        />,
};

function getAnswerComponents({question_sets, answer=null, setAnswer=null, evaluation=null, evaluation_class=null, diagram_url=null}){
    let q_lengths = [1, ...question_sets.map(q => q.answers.length)];
    let startNum = q_lengths.map((_, idx) => q_lengths.slice(0, idx + 1).reduce((a, b) => a + b, 0));
    return (
        <div className="answer-container">
            {question_sets.map((question, q_idx) => (
                answerComponentMap[answerComponentMap.hasOwnProperty(question.test_type) 
                    ? question.test_type : "default"]({
                    questionData: question,
                    q_idx: q_idx,
                    startNum: startNum[q_idx],
                    setAnswer: setAnswer,
                    answer: answer,
                    evaluation: evaluation?.[q_idx],
                    evaluation_class: evaluation_class?.[q_idx],
                    diagram_url: diagram_url
                })
            ))}
        </div>
    );
};

export {getAnswerComponents, answerComponentMap, WritingBox, SingleChoice, MultipleChoice, 
    FillBlanksComponent, FillBlankTableComponent, MapTableComponent, DragDropWordsComponent};