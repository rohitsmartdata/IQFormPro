import { GET_QUES_SUCCESS, GET_QUES_FAIL } from '../../actions/QuesActions/QuesActions';

const INITIAL_STATE = {  quesDetails: [] };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_QUES_SUCCESS:
    ;
      return {
        ...state,
        quesDetails:action.payload
      };
      case GET_QUES_FAIL:
      ;
      return { ...state, isLoading: false }
    default:
      return state;
  }
}
