import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTestInfo, fetchTestTypeNames} from "../services/services";
import { LoadingSkeleton } from "../components/Utilities";

import ActivityPageTemplate from "../components/ActivityPage";

function TestIntroPage() {
    const { skill, isDoublePanel, testType, itemId} = useParams();
    const [test_info, setTestInfo] = useState();
    const [loading, setLoading] = useState(true);
    const [displayNames, setDisplayNames] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [testInfoResponse, displayNamesResponse] = await Promise.all([
                    fetchTestInfo(testType),
                    fetchTestTypeNames()
                ]);
                
                setTestInfo(testInfoResponse.data.info);
                setDisplayNames(displayNamesResponse.data.display_names);;
            } catch (error) {
                console.error("Error fetching data:", error);
                setTestInfo("No test information given...");
                setDisplayNames({});
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, [testType]);

    return (
        <div className="main-page-container">
            <ActivityPageTemplate
                headerNavFields={{
                    show_timer: false,
                    show_menu: true
                }}
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
                            {(loading ? <LoadingSkeleton /> : test_info)}
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

