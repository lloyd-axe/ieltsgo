import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { renderIcon } from "../services/icons";

import header_logo from '../assets/header-logo.png';

function ContactPage() {
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
                    onClick={() => navigate('/')}>
                        ABOUT US
                    </div>
                </div>
            </div>
            <div className="about-content flex-col flex-center">
                <p class="header-text">CONTACT US</p>
                <div className="contact-container flex-row">
                    <div className="contact-btn border-style-1 button-1"
                    onClick={() => window.open("https://www.facebook.com/profile.php?id=61573210007998", "_blank")}>
                        {renderIcon({iconType1:"facebook", className:"contact-icon"})}
                        <div>
                            <p>FACEBOOK</p>
                        </div>
                    </div>
                    <div className="contact-btn border-style-1 button-1">
                        {renderIcon({iconType1:"email", iconType2:"email", className:"contact-icon"})}
                        <div>
                            <div>ieltsgoph@gmail.com</div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="home-footer">© 2025 IELTS GO!</div>
        </div>
    );
}

export default ContactPage;