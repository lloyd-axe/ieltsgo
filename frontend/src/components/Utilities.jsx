import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Menu, X } from "lucide-react";

const LoadingSkeleton = ({ text="", color = "#bcd860", customClass=""}) => {
    return (
        <div className="loading-skeleton">
            <div className="loading-icon-container">
                <div className="loading-text">{text}</div>
                <svg className={customClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                    <circle fill={color} stroke={color} strokeWidth="15" r="15" cx="40" cy="100">
                        <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                    </circle>
                    <circle fill={color} stroke={color} strokeWidth="15" r="15" cx="100" cy="100">
                        <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                    </circle>
                    <circle fill={color} stroke={color} strokeWidth="15" r="15" cx="160" cy="100">
                        <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                    </circle>
                </svg>
            </div>
        </div>
    )
};

const HamburgerNav = ({ selections, classType = "mobile-home" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="hamburger-nav">
            {/* Mobile Menu */}
            <div className="hamburger-container mobile flex-col">
                <button className="hamburger mobile" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="hamburger-icon" size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Collapsible Menu */}
                {isOpen && (
                    <div className={`header-selections flex-col ${classType}`}>
                        {selections.map((item, index) => (
                            <div 
                                key={index} 
                                className="header-selection-item"
                                onClick={() => {
                                    navigate(item.navigate);
                                    setIsOpen(false);
                                }}
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Menu */}
            <div className="header-selections desktop">
                {selections.map((item, index) => (
                    <div 
                        key={index} 
                        className="header-selection-item clickable"
                        onClick={() => navigate(item.navigate)}
                    >
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ConfirmSubmitModal = ({ handleConfirm, handleCancel, title, description, confirm_text, cancel_text}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content color-scheme-1">
                <div className="modal-title">{(title ? title: "Confirm Submission")}</div>
                <div className="modal-desc custom-scroll">
                    <p>{(description ? description: "Are you sure you want to submit your answer?")}</p>
                </div>
                <div className="modal-actions">
                    <button className="modal-btn confirm-btn" onClick={handleConfirm}>{(confirm_text ? confirm_text: "CONFIRM")}</button>
                    <button className="modal-btn cancel-btn" onClick={handleCancel}>{(cancel_text ? cancel_text: "CANCEL")}</button>
                </div>
            </div>
        </div>
    )
};

const TypingEffect = ({ text, speed = 10 }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText(text.charAt(0)); // Start with an empty string
        let index = 0; // Start from the first character

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            index++;

            if (index >= text.length) {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [text, speed]);

    return <span>{displayedText}</span>;
};

function formatString(input) {
    return input
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const formatTime = (seconds) => {
    const absSeconds = Math.abs(seconds); // Convert to positive for formatting
    const sign = seconds < 0 ? "-" : ""; // Add "-" if negative
    const hrs = String(Math.floor(absSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((absSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(absSeconds % 60).padStart(2, "0");
    return `${sign}${hrs}:${mins}:${secs}`;
};


export {formatString, formatTime, LoadingSkeleton, ConfirmSubmitModal, TypingEffect, HamburgerNav};