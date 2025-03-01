import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { renderIcon } from "../services/icons";

import header_logo from '../assets/header-logo.png';

function AboutPage() {
    const title =  "IELTS GO!";
    const navigate = useNavigate(); 

    useEffect(() => {
        document.title = title;
    }, []);

    return (
        <div className="home">
            <div className="home-header">
                <div>
                     <img className="home-header-logo clickable" src={header_logo} onClick={() => navigate('/')} alt="IELTS Ready Logo" />
                </div>
                <div className="header-selections">
                    <div className="header-selection-item clickable" 
                    onClick={() => navigate('/')}>
                        HOME
                    </div>
                    <div className="header-selection-item clickable" 
                    onClick={() => navigate('/test/selection/all')}>
                        ALL EXAMS
                    </div>
                    <div className="header-selection-item clickable" 
                    onClick={() => navigate('/contact')}>
                        CONTACT
                    </div>
                </div>
            </div>
            <div className="about-content flex-col flex-center">
                <p class="header-text">ABOUT US</p>
                <div className="about-container flex-row">
                    bla bla bla
                </div>
            </div>
            <div className="home-footer">© 2025 IELTS GO!</div>
        </div>
    );
}

export default AboutPage;