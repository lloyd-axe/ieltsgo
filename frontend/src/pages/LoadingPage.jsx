import ActivityPageTemplate from "../components/ActivityPage";

function LoadingPage() {
    const headerNavFields = {
        show_timer: false
      }
      
    return (
        <div>
            <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{
                left_content: ( 
                    <div>
                    LOADING ...
                    </div>
                )}
                }
                isDoublePanel={0}
            />
        </div>
    );
}

export default LoadingPage;