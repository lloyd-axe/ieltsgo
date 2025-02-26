import ActivityPageTemplate from "../components/ActivityPage";
import { LoadingSkeleton } from "../components/Utilities";

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
                    <LoadingSkeleton width="100%" height="70%" />
                    </div>
                )}
                }
                isDoublePanel={0}
            />
        </div>
    );
}

export default LoadingPage;