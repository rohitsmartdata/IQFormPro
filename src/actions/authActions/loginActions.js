import { LOGIN } from '../../models/types'
import { Actions } from 'react-native-router-flux'
import { AsyncStorage, Alert } from 'react-native'
import { SERVER_URL, LOCAL_URL } from './../../models/types.js'
import { BANKId_URL } from '../../auth/indexApi'

export const GET_BANKID_SUCCESS = 'GET_BANKID_success'
export const GET_BANKID_FAIL = 'GET_BANKID_fail'
export const GET_BANKID_RESPONSE_SUCCESS = 'GET_BANKID_RESPONSE_success'
export const GET_BANKID_RESPONSE_FAIL = 'GET_BANKID_RESPONSE_fail'

export const login = () => {
  debugger
  return function(dispatch) {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch(BANKId_URL, request)
      .then(function(response) {
        console.log('REsponse', response)
        if (response.status !== 200) {
          throw new Error(response.json())
        }
        return response.json()
      })
      .then(responseJson => {
        if (responseJson._id == '') {
          throw new Error(responseJson.message)
        } else {
          dispatch({
            type: GET_BANKID_SUCCESS,
            abc: responseJson
          })
        }
      })
      .catch(error => {
        console.log(error)
        alert(error)
        dispatch({
          type: GET_BANKID_FAIL
        })
      })
  }
}

export const loginResponse = urlString => {
  debugger
  return function(dispatch) {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch(urlString, request)
      .then(function(response) {
        console.log('REsponse', response)
        if (response.status !== 200) {
          throw new Error(response.json())
        }
        return response.json()
      })
      .then(responseJson => {
        if (responseJson._id == '') {
          throw new Error(responseJson.message)
        } else {
          dispatch({
            type: GET_BANKID_RESPONSE_SUCCESS,
            bankidResponse: responseJson
          })
        }
      })
      .catch(error => {
        console.log(error)
        alert('Please auth through BankId App' + error)
        dispatch({
          type: GET_BANKID_RESPONSE_FAIL
        })
      })
  }
}
