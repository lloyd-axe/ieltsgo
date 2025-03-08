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
                <div className="about-container flex-col">
                    <p>
                        Welcome to <b>IELTS GO!</b> Our platform is designed purely for educational purposes, 
                        helping learners prepare effectively for the IELTS Academic exam through high-quality practice materials.
                        Currently, we focus on IELTS Academic <b>Listening, Reading, and Writing</b> exams, but if everything goes well, 
                        we aim to expand our offerings in the future.
                    </p>
                    <br/>
                    <p>
                        All content on this website is <b>AI-generated but carefully reviewed by humans</b> to ensure accuracy and relevance. 
                        We do not intend to claim copyright on any content provided. 
                        If you have any concerns, issues, or disputes regarding our content, please feel free to <a href="contact">contact us</a>. 
                        We value your feedback and are committed to maintaining a reliable and supportive learning environment.
                    </p>
                </div>
            </div>
            <div className="home-footer">Alpha 1.0 © 2025 IELTS GO!</div>
        </div>
    );
}

export default AboutPage;