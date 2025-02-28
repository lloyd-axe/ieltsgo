import axios from "axios";
import Cookies from "js-cookie";

const BASE_API_URL = "http://127.0.0.1:8000/ieltsgo/api";

const fetchTests = (skill = "", testType = "") => 
    axios.get(`${BASE_API_URL}/selection/${skill}${testType ? "/" : ""}${testType}`);

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

const sendTextToBackend = (answer, question, testType) =>
    axios.post(`${BASE_API_URL}/validate_writing/`, {
        user_response: answer,
        question,
        test_type: testType,
    });

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