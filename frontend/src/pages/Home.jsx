import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { renderIcon } from "../services/icons";

import logo_image from '../assets/logo.png';

function Home() {
    const title =  "IELTS GO!";
    const navigate = useNavigate(); 

    useEffect(() => {
        document.title = title;
    }, []);

    return (
        <div className="home">
            <div className="home-logo clickable">
                <img src={logo_image} alt="Logo" onClick={() => navigate('/test/selection/all')}/>
            </div>
            <div className="intro">Prepare for <b>IELTS</b> exams for <b>FREE</b></div>
            <div className="home-buttons">
                <div className="button-1 home-btn border-style-1" onClick={() => navigate('/test/selection/listening')}>
                    {renderIcon({iconType:"listening", className:"skill-icon"})}
                    <p>LISTENING</p>
                </div>
                <div className="button-1 home-btn border-style-1" onClick={() => navigate('/test/selection/reading')}>
                    {renderIcon({iconType:"reading", className:"skill-icon"})}
                    <p>READING</p>
                </div>
                <div className="button-1 home-btn border-style-1" onClick={() => navigate('/test/selection/writing')}>
                    {renderIcon({iconType:"writing", className:"skill-icon"})}
                    <p>WRITING</p>
                </div>
                <div className="button-1 home-btn border-style-1">
                    <div className="speak-btn">
                        {renderIcon({iconType:"speaking", className:"skill-icon"})}
                        <p>SPEAKING</p>
                    </div>
                    <b id="coming-soon">COMING SOON</b>
                </div>
            </div>
            {/* <p>Or</p>
            <div className="button exam-btn" onClick={() => navigate('/test/mock-exam')}>
                <p>TRY MOCK EXAM</p>
            </div> */}
            <div className="home-footer">© 2025 IELTS GO!</div>
        </div>
    );
}

export default Home;
