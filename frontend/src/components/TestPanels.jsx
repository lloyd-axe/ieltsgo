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
    const [resizableFactor, setResizableFactor] = useState(50);
    const mobileresizableFactor = 40;
    const isResizing = useRef(false);
  
    const handleMouseDown = (mode = "desktop") => {
      isResizing.current = true;

      if (mode === "desktop") {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        // Mobile touch support
        // document.addEventListener("touchmove", handleMouseMoveMobile);
        // document.addEventListener("touchend", handleMouseUpMobile);
      }
      document.body.style.userSelect = "none";
    };
  
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 90) {
        setResizableFactor(newWidth);
      }
    };

    const handleMouseMoveMobile = (e) => {
      if (!isResizing.current) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY; 

  const newHeight = (clientY / window.innerHeight) * 100;
  if (newHeight > 10 && newHeight < 90) {
    setResizableFactor(newHeight);
  }
    };
  
    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "auto";
    };

    const handleMouseUpMobile = () => {
      isResizing.current = false;
      document.removeEventListener("touchmove", handleMouseMoveMobile);
      document.removeEventListener("touchend", handleMouseUpMobile);
      document.body.style.userSelect = "auto";
    };

  return (
    <div class='content'>
        <div className="content-instructions">
            {header}
        </div>
        <div className="content-main desktop">
            <div className="panel left-panel custom-scroll" style={{ width: `${resizableFactor}%` }}>
            {leftPanelContent}
            </div>
            <div className="resizer" onMouseDown={() => handleMouseDown("desktop")}>
            <button className="resize-button">⇔</button>
            </div>

            <div className="panel right-panel custom-scroll" style={{ width: `${100 - resizableFactor}%` }}>
              {rightPanelContent}
            </div>
        </div>

        {/* MOBILE */}
        <div className="content-main mobile">
            <div className="panel left-panel custom-scroll" style={{ height: `${mobileresizableFactor}%` }}>
            {leftPanelContent}
            </div>
            {/* <div className="resizer" onTouchStart={() => handleMouseDown("mobile")}>
              <button className="resize-button">⇔</button>
            </div> */}
            <div className="mobile-divider"></div>

            <div className="panel right-panel custom-scroll" style={{ height: `${95 - mobileresizableFactor}%` }}>
              {rightPanelContent}
            </div>
        </div>
    </div>
    );
};

export { SinglePanel, DoublePanel };
  