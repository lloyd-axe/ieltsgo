import ActivityPageTemplate from "../components/ActivityPage";
import { LoadingSkeleton } from "../components/Utilities";

function LoadingPage({text}) {
    const headerNavFields = {
        show_timer: false
      }
      
    return (
        <div>
            <ActivityPageTemplate
                headerNavFields={headerNavFields}
                contentFields={{
                left_content: ( 
                    <LoadingSkeleton text={text}/>
                )}
                }
                isDoublePanel={0}
            />
        </div>
    );
}

export default LoadingPage;