import { useParams, useNavigate } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react";
import { fetchTestData, fetchCsrfToken, fetchTestTypeNames } from "../services/services";

import ActivityPageTemplate from "../components/ActivityPage";
import LoadingPage from "../pages/LoadingPage"
import { getWritingComponents, getSelectionComponents, getFillBlanksComponents, 
  getBlankTableComponents, getMapTableComponents, getDragDropComponents} from "../components/SkillUtils";


function TestPage() {
  const { skill, isDoublePanel, testType, itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [displayNames, setDisplayNames] = useState({});
  const [externalTime, setExternalTime] = useState(0);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  // LOAD TEST DATA
  useEffect(() => {
    setShowAudioModal(true);

    const fetchData = async () => {
      setLoading(true);
      await fetchCsrfToken();
      try {
          const [testDataResponse, displayNamesResponse] = await Promise.all([
            fetchTestData(skill, testType, itemId),
            fetchTestTypeNames()
          ]);
          // console.log(testDataResponse.data);
          setTestData(testDataResponse.data);
          setDisplayNames(displayNamesResponse.data.display_names);
      } catch (error) {
          console.error("Error fetching data:", error);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [skill, testType, itemId]);

  // HANDLE AUDIO INITIALIZATION
  useEffect(() => {
    if (testData?.audio_url) {
      audioRef.current = new Audio(testData.audio_url);
      audioRef.current.preload = "auto";
      audioRef.current.loop = false;

      audioRef.current.addEventListener("canplaythrough", () => {
        console.log("Audio is ready to play.");
      });

      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
      });

      // Cleanup on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
      };
    }
  }, [testData?.audio_url]);

  if (loading) return <div><LoadingPage /></div>;

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

  const componentMap = {
    writing: getWritingComponents,
    single_selection: getSelectionComponents,
    double_selection: getSelectionComponents,
    fill_table: getBlankTableComponents,
    map: getMapTableComponents,
    word_box: getDragDropComponents,
    flow_chart: getDragDropComponents,
    default: getFillBlanksComponents,
  };


  const componentProps = {
    writing: {
      question: testData.question,
      diagramUrl: testData.diagram_url,
      testType,
      text: answer,
      setAnswer,
    },
    single_selection: {
      text: testData.text,
      questions: testData.questions,
      choices_list: testData.choices,
      testType,
      skill,
      setAnswer,
    },
    double_selection: {
      text: testData.text,
      questions: testData.questions,
      choices_list: testData.choices,
      testType,
      skill,
      setAnswer,
    },
    fill_table: {
      text: testData.text,
      table_data: testData.table_data,
      topic: testData.topic,
      skill,
      setAnswer,
    },
    map: {
      text: testData.text,
      diagramUrl: testData.diagram_url,
      topic: testData.topic,
      num_questions: testData.num_questions,
      rows: testData.rows,
      skill,
      setAnswer,
    },
    word_box: {
      text: testData.text,
      word_box: testData.word_box,
      questions: testData.questions,
      skill,
      setAnswer,
    },
    flow_chart: {
      text: testData.text,
      word_box: testData.word_box,
      questions: testData.questions,
      skill,
      setAnswer,
    },
    default: {
      text: testData.text,
      questions: testData.questions,
      topics: testData.topics,
      setAnswer,
      testType,
      skill,
    },
  };

const componentType = skill === "writing" ? "writing" 
: (componentMap.hasOwnProperty(testType) ? testType : "default");

[instructions, leftContent, rightContent, isCountDown, countDownMins] = 
(componentMap[componentType] || componentMap.default)(componentProps[componentType]  || {});

const handlePlayAudio = () => {
  audioRef.current?.play().catch((e) => console.error("Failed to play audio", e));
  setShowAudioModal(false);
};

const handleSubmitAnswer = () => setShowModal(true);

const handleConfirmSubmit = () => {
  setShowModal(false);
  const state = skill === "writing"
    ? { answer:answer, testData: testData, external_time: externalTime }
    : { answer:answer, testData: testData, external_time: externalTime, countDownMins: countDownMins };

  navigate(`/evaluation/${skill}`, { state });
};

const headerNavFields = {
  skill: skill.toUpperCase(),
  test_type: displayNames[testType],
  show_timer: skill !== "listening",
  is_countdown: isCountDown,
  count_mins: countDownMins,
  setExternalTime: setExternalTime,
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
