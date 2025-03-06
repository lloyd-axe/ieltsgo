
import { TestHeaderNav, TestFooterNav } from "../components/TestNavs";
import { SinglePanel, DoublePanel } from "../components/TestPanels";
import { ConfirmSubmitModal } from "../components/Utilities";


const ActivityPageTemplate = ({ headerNavFields, footerNavFields, contentFields, modalFields, isDoublePanel, audioFields}) => {
    const isDoublePanelBoolean = isDoublePanel == 1 ? true : false;
    const show_modal = modalFields?.show_modal || false;
    const show_audio_modal = audioFields?.show_modal || false;

    return (
        <div className="app-container">
            <TestHeaderNav 
                logo={headerNavFields.logo} 
                test_skill={headerNavFields.skill}
                test_type={headerNavFields.test_type}
                showTimer={headerNavFields.show_timer}
                countDown={headerNavFields.is_countdown} 
                countDownMins={headerNavFields.count_mins}
                externalTimeRef={headerNavFields.externalTimeRef}
                showMenu={headerNavFields.show_menu}
            />

            {show_modal && (
                <ConfirmSubmitModal 
                    handleConfirm={modalFields.handle_confirm} 
                    handleCancel={modalFields.handle_cancel}
                />
            )}

            {show_audio_modal && (
                <ConfirmSubmitModal 
                    handleConfirm={audioFields.handle_confirm} 
                    handleCancel={audioFields.handle_cancel}
                    title={"Start IELTS Listening Exam"}
                    description={"An audio file will be played in the background when you click START."}
                    confirm_text={"START"}
                    cancel_text={"CANCEL"}
                />
            )}

            {isDoublePanelBoolean ? (
                <DoublePanel 
                    header={contentFields.header}
                    leftPanelContent={contentFields.left_content} 
                    rightPanelContent={contentFields.right_content}
                />
                ) : (
                <SinglePanel 
                    header={contentFields.header}
                    panelContent={contentFields.left_content} 
                />
            )}

            {footerNavFields && (
                <TestFooterNav 
                    onSubmit={footerNavFields.submit} 
                    onBack={footerNavFields.back}
                    showSubmit={footerNavFields.show_submit} 
                    showArrows={footerNavFields.show_arrows} 
                    showBack={footerNavFields.show_back}
                />
            )}
        </div>
    );
};

export default ActivityPageTemplate;

