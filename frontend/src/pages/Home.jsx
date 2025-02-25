import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 

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
                    <svg className="skill-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z" clip-rule="evenodd"/>
                    </svg>
                    <p>LISTENING</p>
                </div>
                <div className="button-1 home-btn border-style-1" onClick={() => navigate('/test/selection/reading')}>
                    <svg className="skill-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clip-rule="evenodd"/>
                    </svg>
                    <p>READING</p>
                </div>
                <div className="button-1 home-btn border-style-1" onClick={() => navigate('/test/selection/writing')}>
                    <svg className="skill-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                    </svg>
                    <p>WRITING</p>
                </div>
                <div className="button-1 home-btn border-style-1">
                    <div className="speak-btn">
                        <svg className="skill-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M5 8a1 1 0 0 1 1 1v3a4.006 4.006 0 0 0 4 4h4a4.006 4.006 0 0 0 4-4V9a1 1 0 1 1 2 0v3.001A6.006 6.006 0 0 1 14.001 18H13v2h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2H9.999A6.006 6.006 0 0 1 4 12.001V9a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
                            <path d="M7 6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V6Z"/>
                        </svg>
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
