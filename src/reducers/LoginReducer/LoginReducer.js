import { LOGIN } from '../../models/types'
import {
  GET_BANKID_SUCCESS,
  GET_BANKID_FAIL,
  GET_BANKID_RESPONSE_SUCCESS,
  GET_BANKID_RESPONSE_FAIL
} from '../../actions/authActions/loginActions'

const INITIAL_STATE = { bankIdToken: [], isLoading: false, bankIdResponse: [] }

export default function(state = INITIAL_STATE, action) {
  debugger
  switch (action.type) {
    case GET_BANKID_SUCCESS:
      return {
        ...state,
        bankIdToken: action.abc,
        bankidResponseCheck: true
      }
    case GET_BANKID_FAIL:
      return { ...state, isLoading: false, bankidResponseCheck: true }

    case GET_BANKID_RESPONSE_SUCCESS:
      return {
        ...state,
        bankIdResponse: action.bankidResponse,
        bankidResponseCheck: false,
        bankIdToken: ''
      }
    case GET_BANKID_RESPONSE_FAIL:
      return {
        ...state,
        isLoading: false,
        bankidResponseCheck: false,
        bankIdToken: ''
      }
    default:
      return state
  }
}
