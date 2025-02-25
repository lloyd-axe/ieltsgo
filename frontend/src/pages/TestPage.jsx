import { useParams, useNavigate } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import ActivityPageTemplate from "../components/ActivityPage";
import { getWritingComponents, getSelectionComponents, getFillBlanksComponents, 
  getBlankTableComponents, getMapTableComponents, getDragDropComponents} from "../components/SkillUtils";


function TestPage() {
  const { skill, isDoublePanel, testType, itemId } = useParams();
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
    const loadTestData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/ieltsgo/api/test/${skill}/${testType}/${itemId}/`);
        console.log('data', response.data)
        setTestData(response.data);
      } catch (error) {
        console.error("Error loading test data:", error);
      }
    };

    const fetchTestTypeNames = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/ieltsgo/api/test_type/names`);
        setDisplayNames(response.data.display_names);
      } catch (error) {
        console.error("Error fetching test types:", error);
      }
    };

    loadTestData();
    fetchTestTypeNames();
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

  // VALIDATE DATA
  if (!testData) {
    return (
    <div>
      <ActivityPageTemplate
        headerNavFields={{
          skill: skill.toUpperCase(),
          test_type: displayNames[testType],
          show_timer: false,
        }}
        contentFields={{
          left_content: <div>NO DATA</div>
        }}
        isDoublePanel={0}
      />
    </div>
    )
  }

  // LOAD COMPONENTS
  let leftContent, rightContent, isCountDown, countDownMins, instructions;

  if (skill === "writing") {
    [instructions, leftContent, rightContent, isCountDown, countDownMins] = getWritingComponents({
      question: testData.question,
      diagramUrl: testData.diagram_url,
      testType: testType,
      text: answer,
      setAnswer: setAnswer
    });
  } else {
    if (testType === "single_selection" || testType === "double_selection") {
      [instructions, leftContent, rightContent, isCountDown, countDownMins] = getSelectionComponents({
        text: testData.text,
        questions: testData.questions,
        choices_list: testData.choices,
        testType: testType,
        skill: skill,
        setAnswer: setAnswer
      });
    } else if (testType === "fill_table") {
      [instructions, leftContent, rightContent, isCountDown, countDownMins] = getBlankTableComponents({
        text: testData.text,
        table_data: testData.table_data,
        topic: testData.topic,
        skill: skill,
        setAnswer: setAnswer
      });
    } else if (testType === "map") {
      [instructions, leftContent, rightContent, isCountDown, countDownMins] = getMapTableComponents({
        text: testData.text,
        diagramUrl: testData.diagram_url,
        topic: testData.topic,
        num_questions: testData.num_questions,
        rows: testData.rows,
        skill: skill,
        setAnswer: setAnswer
      });
  
    } else if (testType === "word_box" || testType === "flow_chart") {
      [instructions, leftContent, rightContent, isCountDown, countDownMins] = getDragDropComponents({
        text: testData.text,
        word_box: testData.word_box,
        questions: testData.questions,
        skill: skill,
        setAnswer: setAnswer
      });
    } else {
      [instructions, leftContent, rightContent, isCountDown, countDownMins] = getFillBlanksComponents({
        text: testData.text,
        questions: testData.questions,
        topics: testData.topics,
        setAnswer: setAnswer,
        testType: testType,
        skill: skill
      });
    }
  }

  const handlePlayAudio = () =>{
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.error("Failed to play audio", e);
      });
      setShowAudioModal(false);
    }
  }

  const handleSubmitAnswer = () => {
    setShowModal(true);
  };

  const handleConfirmSubmit = () => {
    // SEND DATA TO BACKEND
    setShowModal(false);
    let state;
    if (testData) {
      if (skill === "writing"){
        state = {
          answer: answer,
          question: testData.question,
          external_time: externalTime
        }
      } else {
        state = {
          answer: answer,
          testData: testData,
          external_time: externalTime
        }
      }
    }
      navigate(`/evaluation/${skill}`, {state: state})
  };

  const headerNavFields = {
    skill: skill.toUpperCase(),
    test_type: displayNames[testType],
    show_timer: skill !== "listening" ? true: false,
    is_countdown: isCountDown,
    count_mins: countDownMins,
    setExternalTime: setExternalTime
  }

  const footerNavFields = {
    submit: handleSubmitAnswer,
    back: () => navigate(`/test/selection/all`),
    show_submit: true,
    show_arrows: false,
    show_back: true
  }

  const contentFields = {
    header: instructions,
    left_content: skill !== "listening" ? leftContent : rightContent,
    right_content: rightContent
  }

  const modalFields = {
    handle_confirm: handleConfirmSubmit,
    handle_cancel: () => setShowModal(false),
    show_modal: showModal
  }

  const audioFields = {
    handle_confirm: handlePlayAudio,
    handle_cancel: () => navigate(`/test/intro/${skill}/${isDoublePanel}/${testType}/${itemId}`),
    show_modal: showAudioModal
  }

  return (
    <div>
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
