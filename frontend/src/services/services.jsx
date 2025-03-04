import axios from "axios";
import Cookies from "js-cookie";

const BASE_API_URL = "/ieltsgo/api";

const fetchTests = (skill = "", testType = "", page = 1, page_items = 12) => 
    axios.get(`${BASE_API_URL}/selection/`, {
        params: { skill:skill, test_type: testType, page:page, page_items:page_items }
    });

const fetchTestTypes = (skill = "") => 
    axios.get(`${BASE_API_URL}/test_types/${skill}`);

const fetchTestTypeNames = () => 
    axios.get(`${BASE_API_URL}/test_type/names`);

const fetchTestInfo = (testType) => 
    axios.get(`${BASE_API_URL}/test_info/${testType}`);

const fetchTestData = (skill, testType, itemId) => 
    axios.get(`${BASE_API_URL}/test/${skill}/${testType}/${itemId}`);

const fetchCsrfToken = () =>
    axios
      .get("/api/get-csrf-token/")
      .then(({ data }) => Cookies.set("csrftoken", data.csrfToken))
      .catch(() => {});

const sendTextToBackend = async (answer, question, testType) => {
    try {
        const csrfToken = Cookies.get("csrftoken");
        if (!csrfToken) {
            console.error("CSRF token not found!");
            return null;
        }

        const response = await axios.post(
            `${BASE_API_URL}/validate_writing/`,
            {
                user_response: answer,
                question: question,
                test_type: testType,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error sending answers:", error.response?.data || error.message);
        return null;
    }
};

const sendAnswersToBackend = async (test_data, user_answers) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/validate_answers/`, {
            test_data: test_data,
            user_answers: user_answers
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken"),
            },
        });

        return response.data;

    } catch (error) {
        console.error("Error sending answers:");
        return null;
    }
};



export {fetchTestData, fetchTests, fetchTestTypes, 
    fetchTestTypeNames, fetchTestInfo, fetchCsrfToken,
    sendTextToBackend, sendAnswersToBackend}