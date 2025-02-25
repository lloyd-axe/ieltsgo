const LoadingSkeleton = ({ width, height }) => {
    return <div className="loading-skeleton" style={{ width, height }}></div>;
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

const testInformation =
{
    writing: {
        task_1: `In IELTS Writing Task 1, you need to analyze and summarize visual data in a minimum of 150 words.
         The information is usually displayed as a graph, chart, or diagram.
          Your goal is to highlight key details, describe patterns, and make relevant comparisons within 20 minutes.`,
        task_2: `In IELTS Writing Task 2, you will be given a topic presenting a perspective, debate, 
         issue, and you must craft a well-structured essay in response. Your writing should maintain a formal tone, exceed 250 words, 
         and be completed within 40 minutes.`
    },
    reading: {
        single_selection: ``,
        double_selection: ``,
        fill_in_the_blanks: ``,
    }
}

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


export {formatString, formatTime, LoadingSkeleton, ConfirmSubmitModal, testInformation};