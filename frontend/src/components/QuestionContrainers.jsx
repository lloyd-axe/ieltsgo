const DiagramAndText = ({diagramUrl, text}) => {
    return (
        <div className="questions-container">
            <div>
                <p className="question-text" 
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </div>
            <div className="flex-col flex-center">
                {diagramUrl && (<img class="question-diagram" src={diagramUrl} alt="Question's diagram"></img>)}
            </div>    
        </div>
    );
};

const Paragraph = ({text}) => {
    return (
        <div className="questions-container">
            <p className="question-text" 
                dangerouslySetInnerHTML={{ __html: text }}
            />
        </div>
    );
};

export {DiagramAndText, Paragraph};