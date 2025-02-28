import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTests, fetchTestTypes, fetchTestTypeNames } from "../services/services";
import { renderIcon } from "../services/icons";

import ActivityPageTemplate from "../components/ActivityPage";
import LoadingPage from "../pages/LoadingPage"


const TestSelectionCard = ({skill, testType, subject, id, displayNames, navigate}) => {
  return (
    <div className="selection-card clickable border-style-1" 
    onClick={()=> navigate(`/test/intro/${skill}/${skill === 'listening'? 0: 1}/${testType}/${id}`)}>
      <div className="card-head flex-row">
        {renderIcon({iconType:skill, className:"card-icon"})}
        <div className="card-skill">{skill.toUpperCase()}</div>
      </div>
      <div className="card-type">
        <b style={{ fontWeight: 900 }}>{displayNames[testType]}</b> <br/>
        {subject}
      </div>
      <div className="card-spacer"></div>
      <div>
        <button className="card-button">
          OPEN
        </button>
      </div>
    </div>
  )}


function SelectionPage() {
  const { skill, testType } = useParams();
  const [tests, setTests] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [displayNames, setDisplayNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpenSkill, setIsOpenSkill] = useState(false);
  const [isOpenTestType, setIsOpenTestType] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(skill);
  const [selectedTestType, setSelectedTestType] = useState(testType);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        //await new Promise((resolve) => setTimeout(resolve, 5000));
        try {
            const [testsResponse, testTypesResponse, displayNamesResponse] = await Promise.all([
                fetchTests(skill, testType),
                fetchTestTypes(skill),
                fetchTestTypeNames()
            ]);
            
            setTests(testsResponse.data);
            const ttypes = ["all", ...testTypesResponse.data.test_types];
            setTestTypes(ttypes);
            setDisplayNames(displayNamesResponse.data.display_names);
        } catch (error) {
            console.error("Error fetching data:", error);
            setTests([]);
            setTestTypes(["all"]);
            setDisplayNames({});
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [skill, testType]);

  if (loading) return <div><LoadingPage /></div>;

  const toggleDropdown = (dd_id) => {
    if (dd_id === "skill"){
      setIsOpenSkill((prev) => !prev);
      if (isOpenTestType) {setIsOpenTestType((prev) => !prev);}
    } else {
      setIsOpenTestType((prev) => !prev);
      if (isOpenSkill) {setIsOpenSkill((prev) => !prev);}
    }
  };

  const handleItemClick = (skill, test_type) => {
    console.log(skill, test_type);
    setSelectedSkill(skill);
    setSelectedTestType(test_type);
    navigate(`/test/selection/${skill}${
      test_type 
      ? test_type !== "all" ? `/${test_type}` : ''
      : ''}`);
  };

  return (
    <div>
      <ActivityPageTemplate
        headerNavFields={{
          show_timer: false
        }}
        contentFields={{
          header: (
            <div className="selection-header-container">
              <div className="selection-header flex-row">
                <div className="dropdown-container flex-row">
                  <div className="dropdown">
                      <button className="dropdown-btn" onBlur={() => toggleDropdown("skill")} onClick={() => toggleDropdown("skill")}>
                        <span>{selectedSkill ? selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1) : "All"}</span>
                        <span className={`arrow ${isOpenSkill ? 'open' : ''}`}></span>
                      </button>
                      <ul className={`dropdown-content ${isOpenSkill ? 'visible' : ''}`}>
                          <li onClick={() => handleItemClick("all")}>All</li>
                          <li onClick={() => handleItemClick("listening")}>Listening</li>
                          <li onClick={() => handleItemClick("reading")}>Reading</li>
                          <li onClick={() => handleItemClick("writing")}>Writing</li>
                      </ul>
                  </div>
                  <div className="dropdown">
                      <button className="dropdown-btn" onBlur={() => toggleDropdown("test_type")} onClick={() => toggleDropdown("test_type")}>
                          <span>{displayNames?.[selectedTestType] ?? "All"}</span>
                          <span className={`arrow ${isOpenTestType ? 'open' : ''}`}></span>
                      </button>
                      <ul className={`dropdown-content custom-scroll scroll-color2 ${isOpenTestType ? 'visible' : ''}`}>
                          {testTypes.map((ttype, t_idx) => (
                            <li key={t_idx} onClick={() => handleItemClick(skill, ttype)}>{displayNames[ttype]}</li>
                          ))}
                      </ul>
                  </div>
                </div>
              </div>
            </div>

          ),
          left_content: ( 
            <div className="selection-grid-container">
              <div className="selection-grid custom-scroll">
                {tests.map((test, _) => (
                  <TestSelectionCard 
                  key={test.id+ "-" + test.subject} 
                  skill={test.skill} 
                  testType={test.test_type} 
                  subject={test.subject} 
                  id={test.id} 
                  displayNames={displayNames}
                  navigate={navigate}/>
                ))}
              </div>
            </div>
          )
        }
        }
        isDoublePanel={0}
      />
    </div>
  );
}

export default SelectionPage;
