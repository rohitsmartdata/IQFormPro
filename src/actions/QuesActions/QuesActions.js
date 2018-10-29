import { QUES_URL } from '../../auth/indexApi';
import { Alert } from 'react-native';

export const GET_QUES_SUCCESS = 'GET_QUES_success';
export const GETQUES_FAIL = 'GET_QUES_fail';

export const getQues = () => {
    
    return function (dispatch) {
        const request = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        fetch(QUES_URL, request)
            .then(function (response) {
                console.log("REsponse", response);
                if (response.status !== 200) {
                    
                    throw new Error(response.json());
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson._id == "") {
                    
                    throw new Error(responseJson.message);
                }
                else {
                    

                    dispatch({
                        type: GET_QUES_SUCCESS,
                        payload: responseJson,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                alert(error);
                dispatch({
                    type: GET_QUES_FAIL,
                });
            });
    };
};
