import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import ActivityPageTemplate from "../components/ActivityPage";

function TestIntroPage() {
    const { skill, isDoublePanel, testType, itemId} = useParams();
    const [test_info, setTestInfo] = useState();
    const [displayNames, setDisplayNames] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTestInfo = async () => {
            try {
                const response = await axios.get(`/ieltsgo/api/test_info/${testType}/`);
                setTestInfo(response.data.info);
            } catch (error) {
                console.error("Error fetching test info:", error);
            }
        };

        const fetchTestTypeNames = async () => {
            try {
              const response = await axios.get(`/ieltsgo/api/test_type/names`);
              const display_names = response.data.display_names;
              setDisplayNames(display_names);
            } catch (error) {
              console.error("Error fetching test types:", error);
            }
          };

    fetchTestInfo();
    fetchTestTypeNames();
    }, [testType]);

    const headerNavFields = {
        show_timer: false
    }

    return (
        <div>
            <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{
                left_content: ( 
                    <div className='full-container flex-row flex-center'>
                    <div className="test-intro border-style-1 color-scheme-1 flex-col">
                        <div className="text-align-left">
                            <p className="intro-title">{skill.toUpperCase()}</p>
                            <p className="intro-test-type">{displayNames[testType]}</p>
                            <hr/>
                        </div>
                        <div className="test-details text-align-left custom-scroll">
                            {test_info}
                        </div>
                        <hr/>
                        <div className="intro-actions">
                            <button 
                                className="intro-btn intro-back"
                                onClick={() => navigate(`/test/selection/${skill}`)}>
                                BACK
                            </button>
                            <button 
                                className="intro-btn intro-submit" 
                                onClick={() => navigate(`/test/${skill}/${isDoublePanel}/${testType}/${itemId}`)}>
                                OPEN
                            </button>
                        </div>
                    </div>
                </div>
                )}}
                isDoublePanel={0}
            />
        </div>
    );
}

export default TestIntroPage;

