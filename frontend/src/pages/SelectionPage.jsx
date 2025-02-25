import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import ActivityPageTemplate from "../components/ActivityPage";
import LoadingPage from "../pages/LoadingPage"


const TestSelectionCard = ({skill, testType, subject, id, displayNames}) => {
  const navigate = useNavigate();

  const renderIcon = (skill) => {
    if (skill === "writing") {
        return (
          <svg className="card-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
          </svg>
        )
    } else if (skill === "listening") {
      return (
        <svg className="card-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z" clip-rule="evenodd"/>
        </svg>
      )
    } else {
      return (
        <svg className="card-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clip-rule="evenodd"/>
        </svg>
      )
    }
  };

  return (
    <div className="selection-card clickable border-style-1" onClick={()=> navigate(`/test/intro/${skill}/${skill === 'listening'? 0: 1}/${testType}/${id}`)}>
      <div className="card-head flex-row">
        {renderIcon(skill)}
        <div className="card-skill">{skill.toUpperCase()}</div>
      </div>
      <div className="card-type">
        <b style={{ fontWeight: 900 }}>{displayNames[testType]}</b> - {subject}
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
    const fetchTests = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/ieltsgo/api/selection/${skill || ""}${ testType ? "/" : "" }${testType || ""}`);
        setTests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setTests([]);
        setLoading(false);
      }
    };

    const fetchTestTypes = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/ieltsgo/api/test_types/${skill || ""}`);
        const ttypes = response.data.test_types;
        ttypes.unshift("all");
        setTestTypes(ttypes);
      } catch (error) {
        console.error("Error fetching test types:", error);
        setTestTypes(["all"]);
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

    fetchTests();
    fetchTestTypes();
    fetchTestTypeNames();
  }, [skill, testType]);

  if (loading) return <div><LoadingPage /></div>;

  const headerNavFields = {
    show_timer: false
  }

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
        headerNavFields={headerNavFields}
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
                      <ul className={`dropdown-content custom-scroll ${isOpenTestType ? 'visible' : ''}`}>
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
                {tests.map((test, index) => (
                  <TestSelectionCard key={test.id+ "-" + test.subject} skill={test.skill} testType={test.test_type} subject={test.subject} id={test.id} displayNames={displayNames}/>
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
