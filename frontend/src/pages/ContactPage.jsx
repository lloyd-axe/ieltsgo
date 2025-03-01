import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { renderIcon } from "../services/icons";
import { HamburgerNav } from "../components/Utilities";

import header_logo from '../assets/header-logo.png';

function ContactPage() {
    const title =  "IELTS GO!";
    const navigate = useNavigate(); 
    const selections = [
        {
            text: "HOME",
            navigate: "/"
        },
        {
            text: "ALL EXAMS",
            navigate: "/test/selection/all"
        },
        {
            text: "ABOUT US",
            navigate: "/about"
        }
    ];


    useEffect(() => {
        document.title = title;
    }, []);

    return (
        <div className="home">
            <div className="home-header">
                <div>
                     <img className="home-header-logo clickable" src={header_logo} onClick={() => navigate('/')} alt="IELTS Ready Logo" />
                </div>
                <HamburgerNav selections={selections}/>
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