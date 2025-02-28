import { useState } from "react";
import { TypingEffect } from "../components/Utilities";

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

const SingleChoice = ({ questions, choices_list, setAnswer = () => {}, evaluation = {}, evaluation_class = {}}) => {
    const [selectedChoices, setSelectedChoices] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation).length === 0;

    const handleChange = (q_idx, choice) => {
        const updatedChoices = { ...selectedChoices, [q_idx]: choice };
        setSelectedChoices(updatedChoices);
        setAnswer(updatedChoices); 
    };

    return (
        <div className="answer-container">
            <div className="q-description">{isEvaluationEmpty ? `Questions 1-${questions.length}` : "SOLUTION:"}</div>
            <div>Choose <b>ONE</b> correct answer from the choices below.</div>
            <div className="q-body">
                {questions.map((question, q_idx) => (
                    <div className="q-block" key={q_idx}>
                        <div className="q-line flex-col">
                            {!isEvaluationEmpty && 
                                <div className="evaluation-text color-scheme-4">
                                    <TypingEffect text={evaluation[q_idx]}/>
                                </div>
                            }
                            <div className="flex-row"><b>{q_idx + 1}</b>. {question}</div>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

const MultipleChoice = ({ questions, choices_list, setAnswer = () => {}, evaluation = {}, evaluation_class = {}}) => {
    const [selectedChoices, setSelectedChoices] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;

    const handleCheckboxChange = (q_idx, c_idx) => {
        setSelectedChoices((prevChoices) => {
            const currentSelections = prevChoices[q_idx] || [];

            if (currentSelections.includes(c_idx)) {
                const updatedSelections = currentSelections.filter((idx) => idx !== c_idx);
                const updatedChoices = { ...prevChoices, [q_idx]: updatedSelections };
                setAnswer(updatedChoices);
                return updatedChoices;
            }

            if (currentSelections.length >= 2) return prevChoices;

            const updatedSelections = [...currentSelections, c_idx];
            const updatedChoices = { ...prevChoices, [q_idx]: updatedSelections };
            setAnswer(updatedChoices);
            return updatedChoices;
        });
    };

    return (
        <div className="answer-container">
            <div className="q-description">{isEvaluationEmpty ? `Questions 1-${questions.length}` : "SOLUTION:"}</div>
            <div>Choose <b>TWO</b> correct answers from the choices below.</div>
            <div className="q-body">
                {questions.map((question, q_idx) => {
                    const maxSelectionsReached = (selectedChoices[q_idx]?.length || 0) >= 2;

                    return (
                        <div className="q-block" key={q_idx}>
                            <div className="q-line flex-col">
                                {!isEvaluationEmpty && 
                                    <div className="evaluation-text color-scheme-4">
                                        <TypingEffect text={evaluation[q_idx]}/>
                                    </div>
                                }
                                <div className="flex-row"><b>{q_idx + 1}</b>. {question}</div>
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FillBlanksComponent = ({ topics, questions, testType, setAnswer = () => {}, evaluation = {}, answer = {}, correct_answer = {}, evaluation_class = {}}) => {
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
        setAnswer(updatedAnswers);
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
                                placeholder={box_idx}
                                disabled={!isEvaluationEmpty}
                            />
                        );
                    }
                    return <span key={idx}>{part}</span>;
                })}
            </span>
        );
    };
    console.log(evaluation);
    return (
        <div className="answer-container">
            <div className="q-description">{isEvaluationEmpty ? `Questions 1-${questions.flat().length}` : "SOLUTION:"}</div>
            <div>Complete the sentences. Write a <b>
                {testType === "fill_sentence_2"
                ? "WORD / NUMBER"
                : "ONE WORD"
                }
            </b> in each text box.</div>
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
                                                <TypingEffect text={evaluation[t_idx][c_idx]}/>
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
        </div>
    );
};

const FillBlankTableComponent = ({ topic, table_data, setAnswer = () => {}, evaluation = {}, answer = {}, correct_answer = {}, evaluation_class = {}}) => {
    const [answers, setAnswers] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;

    const handleChange = (t_idx, value) => {
        const updatedAnswers = { ...answers, [t_idx]: value };
        setAnswers(updatedAnswers);
        setAnswer(updatedAnswers);
    };

    const renderQuestionWithInputs = (question, t_idx, c_idx) => {
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
                                placeholder={match[1]}
                                disabled={!isEvaluationEmpty}
                            />
                        );
                    }
                    return <span key={idx}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <div className="answer-container">
            <div className="q-description">{isEvaluationEmpty ? `Questions 1-${table_data.slice(1, ).length}` : "SOLUTION:"}</div>
            <div>Complete the table. Write <b>ONE WORD</b> only in each text box.</div>
            <div className="q-body">
                <div className="q-line flex-col">
                    {!isEvaluationEmpty && 
                        evaluation.map((eval_comment, e_idx) => (
                            <div key={e_idx} className="evaluation-text color-scheme-4">
                                {e_idx+1}. <TypingEffect text={eval_comment} />
                            </div>
                        ))
                    }
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
            </div>
        </div>
    );
};

const MapTableComponent = ({ topic, num_questions, rows, setAnswer = () => {}, evaluation = {}, answer = {}}) => {
    const [selectedChoices, setSelectedChoices] = useState({});
    const isEvaluationEmpty = Object.keys(evaluation).length === 0;

    const handleChange = (q_idx, choice) => {
        const updatedChoices = { ...selectedChoices, [q_idx]: choice };
        setSelectedChoices(updatedChoices);
        setAnswer(updatedChoices); 
    };

    return (
        <div className="answer-container">
            <div className="q-description">{isEvaluationEmpty ? `Questions 1-${rows.length}` : "SOLUTION:"}</div>
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
                                <th>{r_idx+1}. {row}</th>
                                {Array.from({ length: num_questions}, (_, i) => String.fromCharCode(97 + i)).map((i, c_idx) => (
                                    <td key={c_idx}>
                                        <label key={c_idx}
                                            className={`marker custom-radio ${isEvaluationEmpty ? "" : "radio-disabled"}`}
                                            >
                                            <input
                                                type="radio"
                                                name={`single-choice-${r_idx}`}
                                                checked={
                                                    !Boolean(isEvaluationEmpty)
                                                        ? evaluation[r_idx]?.[c_idx] === 'correct' || evaluation[r_idx]?.[c_idx] === 'wrong'
                                                        : selectedChoices[r_idx] === c_idx
                                                }
                                                onChange={() => handleChange(r_idx, c_idx)}
                                                className={`${evaluation[r_idx]?.[c_idx] || ''}`}
                                                disabled={!isEvaluationEmpty}
                                            />
                                            <span class={`radio-checkmark ${evaluation[r_idx]?.[c_idx] || ''}`}></span>
                                        </label>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DragDropWordsComponent = ({ word_box, questions, setAnswer = () => {}, evaluation = {}, answer = {}, correct_answer = {}, evaluation_class = {}}) => {
    const [inputValues, setInputValues] = useState({});
    const [draggingOver, setDraggingOver] = useState(false);
    const isEvaluationEmpty = Object.keys(evaluation_class).length === 0;

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
                                placeholder={`${q_idx +1}`}
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

    const handleDragStart = (e, word) => {
        e.dataTransfer.setData('text/plain', word);
    };

    const handleDrop = (e, boxId) => {
        const droppedWord = e.dataTransfer.getData('text/plain');
        setInputValues((prev) => ({ ...prev, [boxId]: droppedWord }));
        setAnswer({ ...inputValues, [boxId]: droppedWord })
        e.preventDefault();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="answer-container">
            <div className="q-description">{isEvaluationEmpty ? `Questions 1-${questions.length}` : "SOLUTION:"}</div>
            <div>Choose the correct word from the word-box and drag it to the text boxes below.</div>
            <div className="q-body">
                {isEvaluationEmpty && (
                    <div className="q-block">
                        <div className="word-box flex-row">
                            {word_box.map((word, index) => (
                                <span
                                    key={index}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, word)}
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
                    <ul>
                        {questions.map((question, q_idx) => {
                            const hasPlaceholder = /\|\d+\|/.test(question);
                            return (
                                <li className="q-line">
                                    <div key={q_idx}
                                        onDrop={(e) => hasPlaceholder ? handleDrop(e, q_idx) : undefined}
                                        onDragOver={handleDragOver}>
                                        {renderQuestionWithInputs(question, q_idx)}
                                        <div className="q-line flex-col">
                                            {!isEvaluationEmpty && 
                                                <div className="evaluation-text color-scheme-4">
                                                    <TypingEffect text={evaluation[q_idx]}/>
                                                </div>
                                            }
                                        </div> 
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export {WritingBox, SingleChoice, MultipleChoice, FillBlanksComponent, FillBlankTableComponent, MapTableComponent, DragDropWordsComponent};