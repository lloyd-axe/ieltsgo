import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { HamburgerNav } from "../components/Utilities";
import header_logo from '../assets/header-logo.png';

function AboutPage() {
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
            text: "CONTACT",
            navigate: "/contact"
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