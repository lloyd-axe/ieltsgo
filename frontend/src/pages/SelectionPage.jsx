import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTests, fetchTestTypes, fetchTestTypeNames } from "../services/services";
import { renderIcon } from "../services/icons";

import ActivityPageTemplate from "../components/ActivityPage";
import LoadingPage from "../pages/LoadingPage"
import { formatViews } from "../components/Utilities";


const TestSelectionCard = ({skill, testType, subject, id, displayNames, navigate, views}) => {
  return (
    <div className="selection-card clickable border-style-1">
      <div className="card-head flex-row">
        {renderIcon({iconType1:skill, className:"card-icon"})}
        <div className="card-skill">{skill.toUpperCase()}</div>
      </div>
      <div className="card-type">
      <b>{subject}</b>
      <br/>
      {
        testType.length > 1 ? (
          testType.map((ttype, index) => (
            <p key={index}>
              {displayNames[ttype]}
              {index !== testType.length - 1 && ",\u00A0"}
            </p>
          ))
        ) : (
          <p>
            {displayNames[testType[0]]}
          </p>
        )
      }
      </div>
      <div className="card-spacer">
        <div className="viewText">{formatViews(views)} Views</div>
      </div>
      <div>
        <button className="card-button" onClick={()=> navigate(`/test/intro/${skill}/${skill === 'listening'? 0: 1}/${testType}/${id}`)}>
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

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleNavigation = (next_page, state={}) => {
    setLoading(true);
    navigate(next_page, { state });
  };
  
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [testsResponse, testTypesResponse, displayNamesResponse] = await Promise.all([
                fetchTests(skill, testType, currentPage),
                fetchTestTypes(skill),
                fetchTestTypeNames()
            ]);
            setTests(testsResponse.data.data);
            setTotalPages(testsResponse.data.total_pages);
            
            setTestTypes(["all", ...testTypesResponse.data.test_types]);
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
}, [skill, testType, currentPage]);

useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpenSkill(false);
            setIsOpenTestType(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);


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
    setSelectedSkill(skill);
    setSelectedTestType(test_type);
    setIsOpenSkill(false);
    setIsOpenTestType(false);
    navigate(`/test/selection/${skill}${
      test_type 
      ? test_type !== "all" ? `/${test_type}` : ''
      : ''}`);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="main-page-container">
      <ActivityPageTemplate
        headerNavFields={{
          show_timer: false,
          show_menu: true
        }}
        contentFields={{
          header: (
            <div className="selection-header-container">
              <div className="selection-header flex-row">
                <div className="dropdown-container flex-row" ref={dropdownRef}>
                  Filter:
                  <div className="dropdown">
                      <button className="dropdown-btn" onClick={() => toggleDropdown("skill")}>
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
                      <button className="dropdown-btn" onClick={() => toggleDropdown("test_type")}>
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
            <div className="selection-container">
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
                      views={test.views}
                      navigate={handleNavigation}/>
                    ))}
                </div>
              </div>
              <div className="pagination-controls">
                  <button className="pager-btn" onClick={prevPage} disabled={currentPage === 1}>{renderIcon({iconType1:"prev_btn", className:"pager-icon"})}</button>
                  <span>Page <b>{currentPage}</b> of <b>{totalPages}</b></span>
                  <button className="pager-btn" onClick={nextPage} disabled={currentPage === totalPages}>{renderIcon({iconType1:"next_btn", className:"pager-icon"})}</button>
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