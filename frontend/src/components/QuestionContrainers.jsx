import { LoadingSkeleton } from "../components/Utilities";
import { useState } from "react";

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
            <p className="question-text" 
                dangerouslySetInnerHTML={{ __html: text }}
            />
    );
};

const Diagram = ({diagramUrl}) => {
    const [loading, setLoading] = useState(true);
    return (
           <div className="flex-col flex-center">

                {diagramUrl && (
                    <>
                     {loading && <LoadingSkeleton />}
                        <img
                            className="question-diagram"
                            src={diagramUrl}
                            alt="Question's diagram"
                            onLoad={() => setLoading(false)}
                            onError={() => setLoading(false)} // Hide loading if the image fails to load
                            style={{ display: loading ? "none" : "block" }}
                        />
                    </>
                    )}
            </div>  
    );
};

export {Diagram, Paragraph};