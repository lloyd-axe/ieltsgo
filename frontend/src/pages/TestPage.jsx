import { useParams, useNavigate } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react";
import { fetchTestData, fetchCsrfToken, fetchTestTypeNames } from "../services/services";

import ActivityPageTemplate from "../components/ActivityPage";
import LoadingPage from "../pages/LoadingPage"
import { Diagram, Paragraph} from "../components/QuestionContrainers";
import { getAnswerComponents } from "../components/AnswerComponents";



function TestPage() {
  const { skill, isDoublePanel, testType, itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [displayNames, setDisplayNames] = useState({});

  const externalTimeRef = useRef(0);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  // LOAD TEST DATA
  useEffect(() => {
    setShowAudioModal(true);
    console.log(1);
    const fetchData = async () => {
      setLoading(true);
      await fetchCsrfToken();
      try {
          const [testDataResponse, displayNamesResponse] = await Promise.all([
            fetchTestData(skill, itemId),
            fetchTestTypeNames()
          ]);
          console.log('data', testDataResponse.data);
          setTestData(testDataResponse.data);
          setDisplayNames(displayNamesResponse.data.display_names);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [skill, itemId]);

  // HANDLE AUDIO INITIALIZATION
  useEffect(() => {
    if (testData?.context.audio_url && (!audioRef.current || audioRef.current.src !== testData.context.audio_url)) {
      audioRef.current = new Audio(testData.context.audio_url);
      audioRef.current.preload = "auto";
      audioRef.current.loop = false;
    }
  
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [testData?.context.audio_url]);
  

  if (loading) return <div><LoadingPage /></div>;

  // NO DATA
  if (!testData) {
    return (
    <div className="main-page-container">
      <ActivityPageTemplate
        headerNavFields={{
          skill: skill.toUpperCase(),
          test_type: displayNames[testType],
          show_timer: false,
        }}
        contentFields={{
          left_content: 
          <div className="no-data-container">
            Well, this is awkward...<br/>
            There's no test data available...
          </div>
        }}
        isDoublePanel={0}
      />
    </div>
    )
  }

  // LOAD COMPONENTS
  let instructions, leftContent, rightContent, isCountDown, countDownMins;

  function getTestComponents({ testData, setAnswer, answer}) {
    const testSkill = testData.skill;
    const isCoundDown = testSkill === "listening" ? true:false;
    const countDownMins = testSkill === "writing" ? 
    (testData.question_sets[0].test_type === "task_1" ? 20 : 40)
    : (testData.question_sets.length * 2) + 20;

    const rightPanel = getQuestionComponents({
      text: testData.context.context,
      diagram_url: testData.context.image_url
    });
    const leftPanel = getAnswerComponents({
      question_sets: testData.question_sets,
      answer: testSkill === "writing" ? answer : null,
      setAnswer: setAnswer
    });
    return [
      "Answer the following before time runs out.",
      rightPanel,
      leftPanel,
      isCoundDown,
      countDownMins,
    ];
  }

  function getQuestionComponents({text, diagram_url=null}){
    return (
      <div className="questions-container">
          <Paragraph text={text}/>
          {diagram_url && <Diagram diagramUrl={diagram_url}/>}
      </div>
    );
  };

  [instructions, leftContent, rightContent, isCountDown, countDownMins] = 
  getTestComponents({testData: testData, setAnswer: setAnswer, answer: answer});

  const handlePlayAudio = () => {
    audioRef.current?.play().catch((e) => console.error("Failed to play audio", e));
    setShowAudioModal(false);
  };

  const handleNavigation = (next_page, state={}) => {
    setLoading(true);
    navigate(next_page, { state });
  };

  const handleSubmitAnswer = () => setShowModal(true);

  const handleConfirmSubmit = () => {
    setShowModal(false);
    console.log('ans', answer);
    console.log(externalTimeRef);
    const state = skill === "writing"
      ? { answer:answer, testData: testData, external_time: externalTimeRef }
      : { answer:answer, testData: testData, external_time: externalTimeRef, countDownMins: countDownMins };

    handleNavigation(`/evaluation/${skill}`, state);
  };
  const formattedTestTypes = testType.split(",") .map(type => displayNames[type] || type).join(", ");

  const headerNavFields = {
    skill: skill.toUpperCase(),
    test_type: formattedTestTypes,
    show_timer: true,
    is_countdown: isCountDown,
    count_mins: countDownMins,
    externalTimeRef: externalTimeRef,
  };

  const footerNavFields = {
    submit: handleSubmitAnswer,
    back: () => navigate(`/test/selection/all`),
    show_submit: true,
    show_arrows: false,
    show_back: true,
  };

  const contentFields = {
    header: instructions,
    left_content: skill !== "listening" ? leftContent : rightContent,
    right_content: rightContent,
  };

  const modalFields = {
    handle_confirm: handleConfirmSubmit,
    handle_cancel: () => setShowModal(false),
    show_modal: showModal,
  };

  const audioFields = {
    handle_confirm: handlePlayAudio,
    handle_cancel: () => navigate(`/test/intro/${skill}/${isDoublePanel}/${testType}/${itemId}`),
    show_modal: showAudioModal,
  };

  return (
    <div className="main-page-container">
      <ActivityPageTemplate
        headerNavFields={headerNavFields}
        footerNavFields={footerNavFields}
        contentFields={contentFields}
        modalFields={modalFields}
        isDoublePanel={isDoublePanel}
        audioFields={skill === "listening"? audioFields: null}
      />
    </div>
  );
}

export default TestPage;
