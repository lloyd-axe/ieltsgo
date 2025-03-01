import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { formatTime, HamburgerNav } from "../components/Utilities";
import logo_image from '../assets/header-logo.png';

const TestHeaderNav = ({ logo, test_skill, test_type, showTimer = true, countDown = false, countDownMins = 0, setExternalTime = ()=>{}, showMenu = false }) => {
  const countDownTime = countDownMins * 60;
  const navigate = useNavigate();
  const [time, setTime] = useState(countDown ? countDownTime : 0);

  const selections = [
    {
        text: "HOME",
        navigate: "/"
    },
    {
        text: "CONTACT",
        navigate: "/contact"
    },
    {
        text: "ABOUT US",
        navigate: "/about"
    }
];

  useEffect(() => {
    if (!showTimer) {
      clearInterval();
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = countDown ? prevTime - 1 : prevTime + 1;
        setExternalTime(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);

  }, [countDown, showTimer, setExternalTime]);

  return (
    <div className="activity-nav color-scheme-1">
      <div className="activity-nav-container flex-row">
        <div>{logo !== undefined ? logo : <img className="header-logo" onClick={() => navigate('/')} src={logo_image} alt="IELTS Ready Logo" />}
        </div>
        {test_skill && (
          <div className="test-info desktop">
          <b>{test_skill}</b>
          <p>{test_type}</p>
        </div>
        )}
        {test_skill && (
          <div className="test-info mobile">
          <p><b>{test_skill}</b> - {test_type}</p>
        </div>
        )}
      </div>
      {showMenu && (
          <HamburgerNav selections={selections} classType={"mobile-test"}/>
        )}
      <div className="timer" style={{display: `${showTimer ? "flex" : "none"}`}}>
        TIMER:&nbsp;&nbsp;<b style={{ color: time < 0 || time > countDownTime ? "red" : "inherit" }}>{formatTime(time)}</b>
      </div>

    </div>
  );
};

const TestFooterNav = ({onSubmit, onBack, showArrows = true, showSubmit = true, showBack = true}) => {
  return (
    <div className="footer-nav flex-row color-scheme-3">
      <div className="footer-left">
        {showBack && (
          <div className="footer-button" onClick={onBack}>
            <svg className="footer-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M13.729 5.575c1.304-1.074 3.27-.146 3.27 1.544v9.762c0 1.69-1.966 2.618-3.27 1.544l-5.927-4.881a2 2 0 0 1 0-3.088l5.927-4.88Z" clip-rule="evenodd"/>
            </svg>
          </div>
        )}
      </div>
      <div className="footer-right">
        {showArrows && (
          <div className="footer-button ftr-inactive">
            <svg className="footer-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M13.729 5.575c1.304-1.074 3.27-.146 3.27 1.544v9.762c0 1.69-1.966 2.618-3.27 1.544l-5.927-4.881a2 2 0 0 1 0-3.088l5.927-4.88Z" clip-rule="evenodd"/>
            </svg>
          </div>
        )}
        {showArrows && (
          <div className="footer-button ftr-inactive">
            <svg className="footer-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clip-rule="evenodd"/>
            </svg>
          </div>
        )}
        {showSubmit && (
          <div className="footer-button" onClick={onSubmit}>
            <svg className="footer-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export {TestHeaderNav, TestFooterNav};
