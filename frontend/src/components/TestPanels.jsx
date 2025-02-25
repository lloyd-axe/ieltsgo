import { useState, useRef } from "react";

const SinglePanel = ({ header, panelContent}) => {
    return (
      <div class='content'>
          <div className="content-instructions">
              {header}
          </div>
          <div className="content-main custom-scroll">
              <div className="panel left-panel">
              {panelContent}
              </div>
          </div>
      </div>
    );
};

const DoublePanel = ({ header, leftPanelContent, rightPanelContent}) => {
    const [leftWidth, setLeftWidth] = useState(50);
    const isResizing = useRef(false);
  
    const handleMouseDown = () => {
      isResizing.current = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    };
  
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 90) {
        setLeftWidth(newWidth);
      }
    };
  
    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "auto";
    };

  return (
    <div class='content'>
        <div className="content-instructions">
            {header}
        </div>
        <div className="content-main">
            <div className="panel left-panel custom-scroll" style={{ width: `${leftWidth}%` }}>
            {leftPanelContent}
            </div>

            {/* Resizer with Modern Button */}
            <div className="resizer" onMouseDown={handleMouseDown}>
            <button className="resize-button">⇔</button>
            </div>

            <div className="panel right-panel custom-scroll" style={{ width: `${100 - leftWidth}%` }}>
              {rightPanelContent}
            </div>
        </div>
    </div>
    );
};

export { SinglePanel, DoublePanel };
  