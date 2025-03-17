import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { renderIcon } from "../services/icons";
import logo_image from '../assets/logo.png';
import header_logo from '../assets/header-logo.png';
import { HamburgerNav } from "../components/Utilities";
import LoadingPage from "../pages/LoadingPage"
import {GoogleAdHorizontal} from '../components/GoogleAds';

function Home() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const handleNavigation = (next_page, state={}) => {
        setLoading(true);
        console.log(next_page);
        navigate(next_page, { state });
      };
    const selections = [
        {
            text: "ALL EXAMS",
            navigate: "/test/selection/all"
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

    if (loading) return <div><LoadingPage /></div>;
    return (
        <div className="home">
            <div className="home-header">
                <div>
                     <img className="home-header-logo clickable" src={header_logo} onClick={() => handleNavigation('/test/selection/all')} alt="IELTS Ready Logo" />
                </div>
                <HamburgerNav selections={selections}/>
            </div>
            <div className="home-body">
                <div className="home-logo clickable">
                    <img src={logo_image} alt="Logo" onClick={() => handleNavigation('/test/selection/all')}/>
                </div>
                <div className="intro">Get ready for your <b>IELTS</b> exams — for <b>FREE!</b></div>
                <div className="home-buttons">
                    <div className="button-1 home-btn border-style-1" onClick={() => handleNavigation('/test/selection/listening')}>
                        {renderIcon({iconType1:"listening", className:"skill-icon"})}
                        <p>LISTENING</p>
                    </div>
                    <div className="button-1 home-btn border-style-1" onClick={() => handleNavigation('/test/selection/reading')}>
                        {renderIcon({iconType1:"reading", className:"skill-icon"})}
                        <p>READING</p>
                    </div>
                    <div className="button-1 home-btn border-style-1" onClick={() => handleNavigation('/test/selection/writing')}>
                        {renderIcon({iconType1:"writing", className:"skill-icon"})}
                        <p>WRITING</p>
                    </div>
                    <div className="button-1 home-btn border-style-1">
                        <div className="speak-btn">
                            {renderIcon({iconType1:"speaking", iconType2:"speaking", className:"skill-icon"})}
                            <p>SPEAKING</p>
                        </div>
                        <b id="coming-soon">COMING SOON</b>
                    </div>
                </div>
            </div>
            <div className="home-footer">
                <div>Alpha 1.0 © 2025 IELTS GO!</div>
            </div>
        </div>
    );
}

export default Home;
