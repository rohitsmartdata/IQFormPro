import React, { Component } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native'
import {
  Card,
  Item,
  List,
  ListItem,
  Spinner,
  Tab,
  Tabs,
  Thumbnail,
  Button
} from 'native-base'
import { globalStyle } from '../../constants/GlobalStyleSheet.js'
import { languageList } from '../../constants/language'
import { CheckBox } from 'react-native-elements'
import { Input } from 'native-base'
import { Actions } from 'react-native-router-flux'
import { RightButton } from '../../components/RightButton'
import SplashScreen from 'react-native-splash-screen'
import Icon from 'react-native-vector-icons/Ionicons'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getQues } from '../../actions/QuesActions/QuesActions'
import { login, loginResponse } from '../../actions/authActions/loginActions'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader'
import Modal from 'react-native-modal'
import { NetworkInfo } from 'react-native-network-info'
import { NativeModules, AppState } from 'react-native'

const { height, width } = Dimensions.get('window')
const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height

const mapStateToProps = ({ QuesReducer, BankIdReducer }) => {
  return {
    quesDetails: QuesReducer.quesDetails,
    bankIdToken: BankIdReducer.bankIdToken,
    autoStartToken: BankIdReducer.autoStartToken,
    bankIdResponse: BankIdReducer.bankIdResponse,
    bankidResponseCheck: BankIdReducer.bankidResponseCheck
  }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getQues,
      login,
      loginResponse
    },
    dispatch
  )
}
/**
 * @quesDeails: this variable is used to store all question's array form api.
 */
var quesDetails
/**
 * @userQues: this array is used to store questions form server.
 */
var userQues = []

/**
 * @showQues: this array is used to show questions to user one by one.
 */
var showQues = []

/**
 * @userQues: this array is used to store sub questions form server.
 */
var subUserQues = []

/**
 * @showQues: this array is used to show sub questions to user one by one.
 */
var subShowQues = []
/**
 * @userQuesArrIndex: this variable represents the index of question for users.
 * By default index is 0
 */
var userQuesArrIndex = 0

/**
 * @previousAnsArr: this array is used to store the previous answered question with result.
 */

var previousAnsArr = []
/**
 * @language: this variable is used to store the selected language .
 */
var language = 'en'

/**
 * @language: this variable is used to store the selected language name .
 */
var languageName = 'English'

/**
 * @outputArr:Represents an array represents output of snomed code.
 */
var outputArr = {}

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
class PersonalDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: ds.cloneWithRows(userQues),
      dataSource1: ds.cloneWithRows(userQues),
      dataSource2: ds.cloneWithRows(userQues),
      phnNo: '',
      homeNo: '',
      email: '',
      selectedColor: '#87D791',
      test: '',
      checked: true,
      botReply: false,
      submitForm: false,
      fname: '',
      backBtnValidation: true,
      backBtnOpacity: 'gray',
      quesDetailsCheck: true,
      subQuesCheck: false,
      btnValidation: true,
      message: '',
      languageModal: false,
      sublabelCheckUi: true,
      switchBtnValue: false,
      timeValue: 0,
      pointerEvents: 'auto',
      switchBtnValueCheck: true,
      autoStartToken: 'abc',
      bubbleSize: 0,
      orderRef: '',
      appState: AppState.currentState,
      bankIdForegroungCheck: false,
      opacity: 1,
      loadingAuth: false
    }
  }
  /**
   * @banIdAuth: this function is user for authentication of user through bank iD
   */

  bankIdToken() {
    this.setState({
      bubbleSize: 15,
      opacity: 0,
      loadingAuth: true
    })
    this.props.login()
  }

  bankIdAuth(token, orderRef) {
    // NetworkInfo.getIPAddress(ip => {
    //   console.log(ip)
    // })

    // // Get IPv4 IP
    // NetworkInfo.getIPV4Address(ipv4 => {
    //   console.log(ipv4)
    // })

    // // Get Broadcast
    // NetworkInfo.getBroadcast(address => {
    //   console.log(address)
    // })

    // // Get SSID
    // NetworkInfo.getSSID(ssid => {
    //   console.log(ssid)
    // })1

    // // Get BSSID
    // NetworkInfo.getBSSID(ssid => {
    //   console.log(ssid)
    // })

    let url2 =
      'https://app.bankid.com/?autostarttoken=' +
      token +
      '&redirect=iqform://?orderRef=' +
      orderRef

    console.log(NativeModules, url2, 'NativeModulesNativeModules')

    var CalendarManager = NativeModules.CalendarManager

    CalendarManager.checkBankRoll(url2)
  }

  /**
   * @previousAnsArrFun:  this function conssts of functionality to store/push previous question with ans to previousAnsArr array.
   */
  previousAnsArrFun() {
    if (userQues.length == 1 || userQues.length == 0) {
    } else {
      if (userQuesArrIndex >= 2) {
        previousAnsArr.pop()
        switch (userQues[userQuesArrIndex - 2].type) {
          case 'multiselect':
          case 'compoundcheckbox':
          case 'select':
          case 'compoundradio':
            previousAnsArr.push({
              uuid: userQues[userQuesArrIndex - 2].uuid,

              options: userQues[userQuesArrIndex - 2].options,
              label: userQues[userQuesArrIndex - 2].label,
              id: userQues[userQuesArrIndex - 2].id,
              subType: userQues[userQuesArrIndex - 2].subType,
              type: userQues[userQuesArrIndex - 2].type,
              sublabels: userQues[userQuesArrIndex - 2].sublabels
            })
            break

          case 'input':
            previousAnsArr.push({
              uuid: userQues[userQuesArrIndex - 2].uuid,
              label: userQues[userQuesArrIndex - 2].label,
              id: userQues[userQuesArrIndex - 2].id,
              status: userQues[userQuesArrIndex - 2].status,
              quesType: userQues[userQuesArrIndex - 2].quesType,
              subType: userQues[userQuesArrIndex - 2].subType,
              type: userQues[userQuesArrIndex - 2].type,
              sublabels: userQues[userQuesArrIndex - 2].sublabels
            })
            break
        }

        this.setState({
          dataSource2: ds.cloneWithRows(previousAnsArr[0].sublabels)
        })
      } else {
        previousAnsArr.pop()
      }
    }
  }

  /**
   * @nextQues: This function reperents the functionality of next button for further questions in the app.
   */

  nextQues() {
    if (this.state.subQuesCheck) {
    } else {
      if (userQues.length > userQuesArrIndex) {
        this.setState({
          botReply: true,
          btnValidation: true,
          pointerEvents: 'none'
        })

        setTimeout(() => {
          this.setState({ botReply: false })

          this.showQuesFun(userQues)
          this.previousAnsArrFun()
          this.backButtonValidation()
          this.btnValidation()
          this.setState({ message: '', pointerEvents: 'auto' })
        }, 2000)
      }
    }
  }

  /**
   * @backButtonValidation: This function represents the validation to show or hide back button.
   */

  backButtonValidation() {
    if (userQuesArrIndex == '1') {
      this.setState({ backBtnOpacity: 'gray', backBtnValidation: true })
    } else {
      this.setState({ backBtnOpacity: '#fff', backBtnValidation: false })
    }
  }

  /**
   * @backQues: This function represents the functionality of Back button to go back to last answered question.
   */

  backQues() {
    this.setState({ botReply: true })

    setTimeout(() => {
      userQuesArrIndex = userQuesArrIndex - 2

      if (userQues.length - 1 == userQuesArrIndex) {
        this.setState({ submitForm: true })
      } else {
        this.setState({ submitForm: false })
      }
      this.setState({ botReply: false })
      this.showQuesFun(userQues)
      this.previousAnsArrFun()
      this.btnValidation()
      this.backButtonValidation()
    }, 2000)
  }

  /**
   *
   * @param {Represents the index of sublabels} index1
   * @param {Represents the index of options} index2
   * @param {Represents the sublabel array } subData
   * @sublabelCheckboxFun: This function is called when clicked from sublabel's checkbox.
   */
  sublabelCheckboxFun(index1, index2, subData) {
    showQues[0].sublabels[index1].options[index2].status = !subData[index2]
      .status

    showQues
    this.setState({ dataSource1: ds.cloneWithRows(showQues[0].sublabels) })
    this.btnValidation()
  }

  /**
   *
   * @param {Represents the index of sublabels} index1
   * @param {Represents the index of options} index2
   * @param {Represents the sublabel array } subData
   * @sublabelCheckboxFun: This function is called when clicked from sublabel's radio-button.
   */
  sublabelRadiobtnFun(index1, index2, subData) {
    for (let i = 0; i < showQues[0].sublabels[index1].options.length; i++) {
      if (i == index2) {
        showQues[0].sublabels[index1].options[i].status = true
      } else {
        showQues[0].sublabels[index1].options[i].status = false
      }
    }

    showQues
    this.setState({ dataSource1: ds.cloneWithRows(showQues[0].sublabels) })
    this.btnValidation()
  }

  /**
   *
   * @param {Represents the index of selected checkbox} index
   * @param {Represents the array of checkbox question} subData
   *
   * @checkboxFun : This function represents the check-box functionality of selected checkbox and to get further sub-questions for that selected checkbox.
   */
  checkboxFun(index, subData) {
    showQues[0].options[index].status = !subData[index].status

    this.setState({ dataSource: ds.cloneWithRows(showQues) })
    if (subData[index].status) {
      if (subData[index].questions.length > 0) {
        //  this.setState({ subQuesCheck: true })

        for (i = subData[index].questions.length - 1; i >= 0; i--) {
          if (subData[index].questions[i].type == 'input') {
            if (subData[index].questions[i].status) {
              userQues.splice(userQuesArrIndex, 0, {
                uuid: subData[index].questions[i].uuid,
                outputId:
                  userQues[userQuesArrIndex - 1].uuid +
                  '_' +
                  subData[index].key,
                subQues: true,
                label: subData[index].questions[i].label,
                status: subData[index].questions[i].status,
                quesType: subData[index].questions[i].quesType,
                id: subData[index].questions[i].id,
                subType: subData[index].questions[i].subType,
                type: subData[index].questions[i].type,
                sublabels: []
              })
            } else {
              userQues.splice(userQuesArrIndex, 0, {
                uuid: subData[index].questions[i].uuid,
                outputId:
                  userQues[userQuesArrIndex - 1].uuid +
                  '_' +
                  subData[index].key,
                subQues: true,
                label: subData[index].questions[i].label,
                status: '',
                quesType: 'subQues',
                id: subData[index].questions[i].id,
                subType: subData[index].questions[i].subType,
                type: subData[index].questions[i].type,
                sublabels: []
              })
            }
          } else {
            var localOptions = []
            var subLabelArr = []
            var sublabelCheckUi = true

            if (subData[index].questions[i].sublabels) {
              sublabelCheckUi = true
              for (
                let l = 0;
                l < subData[index].questions[i].sublabels.length;
                l++
              ) {
                if (
                  subData[index].questions[i].sublabels[l].label.en ==
                  subData[index].questions[i].options[0].value.en
                ) {
                  sublabelCheckUi = false
                } else {
                }
              }

              if (sublabelCheckUi) {
                for (
                  let k = 0;
                  k < subData[index].questions[i].sublabels.length;
                  k++
                ) {
                  let localOptions = []
                  for (
                    j = 0;
                    j < subData[index].questions[i].options.length;
                    j++
                  ) {
                    var localOptionsValue = {
                      sct: '',
                      questions: [],
                      key: '',
                      value: '',
                      status: '',
                      quesType: ''
                    }
                    localOptionsValue.sct =
                      subData[index].questions[i].options[j].sct
                    localOptionsValue.key =
                      subData[index].questions[i].options[j].key
                    localOptionsValue.value =
                      subData[index].questions[i].options[j].value
                    ;(localOptionsValue.status = false),
                      (localOptionsValue.quesType = 'subQues')

                    if (subData[index].questions[i].options[j].questions) {
                      localOptionsValue.questions =
                        subData[index].questions[i].options[j].questions
                    }
                    localOptions.push(localOptionsValue)
                  }
                  subLabelArr.push({
                    label: subData[index].questions[i].sublabels[k].label,
                    id: subData[index].questions[i].sublabels[k].id,
                    sct: subData[index].questions[i].sublabels[k].sct,
                    options: localOptions
                  })
                }
              } else {
                for (
                  j = 0;
                  j < subData[index].questions[i].options.length;
                  j++
                ) {
                  var localOptionsValue = {
                    sct: '',
                    questions: [],
                    key: '',
                    value: '',
                    status: '',
                    quesType: ''
                  }
                  localOptionsValue.sct =
                    subData[index].questions[i].options[j].sct
                  localOptionsValue.key =
                    subData[index].questions[i].options[j].key
                  localOptionsValue.value =
                    subData[index].questions[i].options[j].value
                  ;(localOptionsValue.status = false),
                    (localOptionsValue.quesType = 'subQues')

                  if (subData[index].questions[i].options[j].questions) {
                    localOptionsValue.questions =
                      subData[index].questions[i].options[j].questions
                  }
                  localOptions.push(localOptionsValue)
                }
              }
            } else {
              for (j = 0; j < subData[index].questions[i].options.length; j++) {
                var localOptionsValue = {
                  sct: '',
                  questions: [],
                  key: '',
                  value: '',
                  status: '',
                  quesType: ''
                }
                localOptionsValue.sct =
                  subData[index].questions[i].options[j].sct
                localOptionsValue.key =
                  subData[index].questions[i].options[j].key
                localOptionsValue.value =
                  subData[index].questions[i].options[j].value
                ;(localOptionsValue.status = false),
                  (localOptionsValue.quesType = 'subQues')

                if (subData[index].questions[i].options[j].questions) {
                  localOptionsValue.questions =
                    subData[index].questions[i].options[j].questions
                }
                localOptions.push(localOptionsValue)
              }
            }

            switch (subData[index].questions[i].type) {
              case 'multiselect':
              case 'compoundcheckbox':
              case 'select':
              case 'compoundradio':
                userQues.splice(userQuesArrIndex, 0, {
                  uuid: subData[index].questions[i].uuid,
                  outputId:
                    userQues[userQuesArrIndex - 1].uuid +
                    '_' +
                    subData[index].key,
                  subQues: true,
                  options: localOptions,
                  label: subData[index].questions[i].label,
                  id: subData[index].questions[i].id,
                  subType: subData[index].questions[i].subType,
                  type: subData[index].questions[i].type,
                  sublabels: subLabelArr
                })
                break

              case 'input':
                if (subData[index].questions[i].status) {
                  userQues.splice(userQuesArrIndex, 0, {
                    uuid: subData[index].questions[i].uuid,
                    outputId:
                      userQues[userQuesArrIndex - 1].uuid +
                      '_' +
                      subData[index].key,
                    subQues: true,
                    label: subData[index].questions[i].label,
                    id: subData[index].questions[i].id,
                    status: subData[index].questions[i].status,
                    quesType: subData[index].questions[i].quesType,
                    subType: subData[index].questions[i].subType,
                    type: subData[index].questions[i].type,
                    sublabels: subLabelArr
                  })
                } else {
                  userQues.splice(userQuesArrIndex, 0, {
                    uuid: subData[index].questions[i].uuid,
                    outputId:
                      userQues[userQuesArrIndex - 1].uuid +
                      '_' +
                      subData[index].key,
                    subQues: true,
                    label: subData[index].questions[i].label,
                    id: subData[index].questions[i].id,
                    status: '',
                    quesType: 'subQues',
                    subType: subData[index].questions[i].subType,
                    type: subData[index].questions[i].type,
                    sublabels: subLabelArr
                  })
                }
                break
            }
          }
        }
      } else {
        this.setState({ subQuesCheck: false })
      }
    } else {
      if (subData[index].questions.length > 0) {
        for (i = 0; i < userQues.length; i++) {
          for (j = 0; j < subData[index].questions.length; j++) {
            if (userQues[i].uuid == subData[index].questions[j].uuid) {
              if (subData[index].questions[j].options) {
                for (
                  let k = 0;
                  k < subData[index].questions[j].options.length;
                  k++
                ) {
                  if (subData[index].questions[j].options[k].questions) {
                    for (
                      let l = 0;
                      l <
                      subData[index].questions[j].options[k].questions.length;
                      l++
                    ) {
                      for (let i = 0; i < userQues.length; i++) {
                        if (
                          userQues[i].uuid ==
                          subData[index].questions[j].options[k].questions[l]
                            .uuid
                        ) {
                          userQues.splice(i, 1)
                        }
                      }
                    }
                  } else {
                  }
                }
              }
              userQues.splice(i, 1)
            }
          }
        }
      } else {
      }
    }

    this.setState({ email: '' })
    this.btnValidation()
    if (this.state.switchBtnValueCheck) {
      if (this.state.switchBtnValue) {
        setTimeout(() => {
          this.setState({ switchBtnValueCheck: true })
          if (this.state.btnValidation) {
          } else {
            this.btnValidation()
            this.nextQues()
          }
        }, this.state.timeValue * 1000)
      } else {
        this.btnValidation()
      }
    }
    this.setState({ switchBtnValueCheck: false })
  }

  /**
   *
   * @param {Represents the index of selected radio button} index
   * @param {Represents the array of radio button question} subData
   *
   * @radioBtnFun:  This function represents the radio button functionality of selected checkbox and to get further sub-questions for that selected radio button.
   */
  radioBtnFun(index, subData) {
    // this.setState({ btnValidation: false })
    for (let i = 0; i < subData.length; i++) {
      if (i == index) {
        showQues[0].options[i].status = true

        if (subData[index].questions.length > 0) {
          //  this.setState({ subQuesCheck: true })

          for (let i = subData[index].questions.length - 1; i >= 0; i--) {
            if (subData[index].questions[i].type == 'input') {
              if (subData[index].questions[i].status) {
                userQues.splice(userQuesArrIndex, 0, {
                  uuid: subData[index].questions[i].uuid,
                  outputId:
                    userQues[userQuesArrIndex - 1].uuid +
                    '_' +
                    subData[index].key,
                  subQues: true,
                  label: subData[index].questions[i].label,
                  status: subData[index].questions[i].status,
                  quesType: subData[index].questions[i].quesType,
                  id: subData[index].questions[i].id,
                  subType: subData[index].questions[i].subType,
                  type: subData[index].questions[i].type,
                  sublabels: []
                })
              } else {
                userQues.splice(userQuesArrIndex, 0, {
                  uuid: subData[index].questions[i].uuid,
                  outputId:
                    userQues[userQuesArrIndex - 1].uuid +
                    '_' +
                    subData[index].key,
                  subQues: true,
                  label: subData[index].questions[i].label,
                  status: '',
                  quesType: 'subQues',
                  id: subData[index].questions[i].id,
                  subType: subData[index].questions[i].subType,
                  type: subData[index].questions[i].type,
                  sublabels: []
                })
              }
            } else {
              var localOptions = []
              var subLabelArr = []
              var sublabelCheckUi = true

              if (subData[index].questions[i].sublabels) {
                sublabelCheckUi = true
                for (
                  let l = 0;
                  l < subData[index].questions[i].sublabels.length;
                  l++
                ) {
                  if (
                    subData[index].questions[i].sublabels[l].label.en ==
                    subData[index].questions[i].options[0].value.en
                  ) {
                    sublabelCheckUi = false
                  } else {
                  }
                }

                if (sublabelCheckUi) {
                  for (
                    let k = 0;
                    k < subData[index].questions[i].sublabels.length;
                    k++
                  ) {
                    let localOptions = []
                    for (
                      let j = 0;
                      j < subData[index].questions[i].options.length;
                      j++
                    ) {
                      var localOptionsValue = {
                        sct: '',
                        questions: [],
                        key: '',
                        value: '',
                        status: '',
                        quesType: ''
                      }
                      localOptionsValue.sct =
                        subData[index].questions[i].options[j].sct
                      localOptionsValue.key =
                        subData[index].questions[i].options[j].key
                      localOptionsValue.value =
                        subData[index].questions[i].options[j].value
                      ;(localOptionsValue.status = false),
                        (localOptionsValue.quesType = 'subQues')

                      if (subData[index].questions[i].options[j].questions) {
                        localOptionsValue.questions =
                          subData[index].questions[i].options[j].questions
                      } else {
                      }
                      localOptions.push(localOptionsValue)
                    }

                    subLabelArr.push({
                      label: subData[index].questions[i].sublabels[k].label,
                      id: subData[index].questions[i].sublabels[k].id,
                      sct: subData[index].questions[i].sublabels[k].sct,
                      options: localOptions
                    })
                  }
                } else {
                  for (
                    let j = 0;
                    j < subData[index].questions[i].options.length;
                    j++
                  ) {
                    var localOptionsValue = {
                      sct: '',
                      questions: [],
                      key: '',
                      value: '',
                      status: '',
                      quesType: ''
                    }
                    localOptionsValue.sct =
                      subData[index].questions[i].options[j].sct
                    localOptionsValue.key =
                      subData[index].questions[i].options[j].key
                    localOptionsValue.value =
                      subData[index].questions[i].options[j].value
                    ;(localOptionsValue.status = false),
                      (localOptionsValue.quesType = 'subQues')

                    if (subData[index].questions[i].options[j].questions) {
                      localOptionsValue.questions =
                        subData[index].questions[i].options[j].questions
                    } else {
                    }
                    localOptions.push(localOptionsValue)
                  }
                }
              } else {
                for (
                  let j = 0;
                  j < subData[index].questions[i].options.length;
                  j++
                ) {
                  var localOptionsValue = {
                    sct: '',
                    questions: [],
                    key: '',
                    value: '',
                    status: '',
                    quesType: ''
                  }
                  localOptionsValue.sct =
                    subData[index].questions[i].options[j].sct
                  localOptionsValue.key =
                    subData[index].questions[i].options[j].key
                  localOptionsValue.value =
                    subData[index].questions[i].options[j].value
                  ;(localOptionsValue.status = false),
                    (localOptionsValue.quesType = 'subQues')

                  if (subData[index].questions[i].options[j].questions) {
                    localOptionsValue.questions =
                      subData[index].questions[i].options[j].questions
                  } else {
                  }
                  localOptions.push(localOptionsValue)
                }
              }

              switch (subData[index].questions[i].type) {
                case 'multiselect':
                case 'compoundcheckbox':
                case 'select':
                case 'compoundradio':
                  userQues.splice(userQuesArrIndex, 0, {
                    uuid: subData[index].questions[i].uuid,
                    outputId:
                      userQues[userQuesArrIndex - 1].uuid +
                      '_' +
                      subData[index].key,
                    subQues: true,

                    options: localOptions,
                    label: subData[index].questions[i].label,
                    id: subData[index].questions[i].id,
                    subType: subData[index].questions[i].subType,
                    type: subData[index].questions[i].type,
                    sublabels: subLabelArr
                  })
                  break

                case 'input':
                  if (subData[index].questions[i].status) {
                    userQues.splice(userQuesArrIndex, 0, {
                      uuid: subData[index].questions[i].uuid,
                      outputId:
                        userQues[userQuesArrIndex - 1].uuid +
                        '_' +
                        subData[index].key,
                      subQues: true,
                      label: subData[index].questions[i].label,
                      id: subData[index].questions[i].id,
                      status: subData[index].questions[i].status,
                      quesType: subData[index].questions[i].quesType,
                      subType: subData[index].questions[i].subType,
                      type: subData[index].questions[i].type,
                      sublabels: subLabelArr
                    })
                  } else {
                    userQues.splice(userQuesArrIndex, 0, {
                      uuid: subData[index].questions[i].uuid,
                      outputId:
                        userQues[userQuesArrIndex - 1].uuid +
                        '_' +
                        subData[index].key,
                      subQues: true,
                      label: subData[index].questions[i].label,
                      id: subData[index].questions[i].id,
                      status: '',
                      quesType: 'subQues',
                      subType: subData[index].questions[i].subType,
                      type: subData[index].questions[i].type,
                      sublabels: subLabelArr
                    })
                  }
                  break
              }
            }
          }
        } else {
        }

        if (userQues.length - 1 == userQuesArrIndex) {
          this.setState({ submitForm: true })
        } else {
          this.setState({ submitForm: false })
        }
      } else {
        showQues[0].options[i].status = false
        this.setState({ subQuesCheck: false })
        if (subData[i].questions.length > 0) {
          for (let k = 0; k < subData.length; k++) {
            for (let i = 0; i < userQues.length; i++) {
              for (let j = 0; j < subData[k].questions.length; j++) {
                if (userQues[i].uuid == subData[k].questions[j].uuid) {
                  if (index == k) {
                  } else {
                    if (subData[k].questions[j].options) {
                      for (
                        let l = 0;
                        l < subData[k].questions[j].options.length;
                        l++
                      ) {
                        if (subData[k].questions[j].options[l].questions) {
                          for (
                            let m = 0;
                            m <
                            subData[k].questions[j].options[l].questions.length;
                            m++
                          ) {
                            for (let i = 0; i < userQues.length; i++) {
                              if (
                                userQues[i].uuid ==
                                subData[k].questions[j].options[l].questions[m]
                                  .uuid
                              ) {
                                userQues.splice(i, 1)
                              }
                            }
                          }
                        } else {
                        }
                      }
                    }
                    userQues.splice(i, 1)
                  }
                } else {
                }
              }
            }
          }
        } else {
        }
      }
    }
    userQues
    userQuesArrIndex
    if (this.state.switchBtnValue) {
      this.btnValidation()
      this.nextQues()
    } else {
      this.btnValidation()
    }
    this.setState({ dataSource: ds.cloneWithRows(showQues) })
  }

  /**
   * @btnValidation: This function represents the validation for (Back,Next and Submit) buttons according to questions.
   */
  btnValidation() {
    var loopCheck = false
    if (showQues[0].type == 'input') {
      if (showQues[0].status) {
        this.setState({ btnValidation: false })
        if (userQues.length == userQuesArrIndex) {
          this.setState({ submitForm: true })
        } else {
          this.setState({ submitForm: false })
        }
      } else {
        this.setState({ btnValidation: true })
      }
    } else {
      if (showQues[0].sublabels.length > 0) {
        for (let i = 0; i < showQues[0].sublabels.length; i++) {
          if (loopCheck) {
            break
          } else {
          }
          for (j = 0; j < showQues[0].sublabels[i].options.length; j++) {
            if (showQues[0].sublabels[i].options[j].status) {
              this.setState({ btnValidation: false })
              if (userQues.length == userQuesArrIndex) {
                this.setState({ submitForm: true })
              } else {
                this.setState({ submitForm: false })
              }

              loopCheck = true
              break
            } else {
              this.setState({ btnValidation: true })
            }
          }
        }
      } else {
        for (i = 0; i < showQues[0].options.length; i++) {
          if (showQues[0].options[i].status) {
            this.setState({ btnValidation: false })
            if (userQues.length == userQuesArrIndex) {
              this.setState({ submitForm: true })
            } else {
              this.setState({ submitForm: false })
            }
            break
          } else {
            this.setState({ btnValidation: true })
          }
        }
      }
    }
  }

  /**
   *
   * @param {Represents the value from input field} text
   * @param {Represents the array of input question} subData
   *
   * @inputFun: This function represents the functionality of input filed question
   */
  inputFun(text, subData) {
    this.setState({ message: text })
    showQues[0].status = text
    userQues[userQuesArrIndex - 1].status = text
    this.setState({ phnNo: 'a' })
    this.btnValidation()
  }

  /**
   * @submitForm: This function represents the functionlity of submition of questionnaire.
   */
  submitForm() {
    for (let i = 0; i < userQues.length; i++) {
      //  "outputId": subData[index].questions[i].uuid + _ + subData[index].key,

      if (userQues[i].subQues) {
        if (userQues[i].sublabels.length > 0) {
          if (
            userQues[i].type == 'multiselect' ||
            userQues[i].type == 'compoundcheckbox'
          ) {
            outputArr[userQues[i].outputId] = {}
            var dummyOutputArr = {}

            for (j = 0; j < userQues[i].sublabels.length; j++) {
              for (k = 0; k < userQues[i].sublabels[j].options.length; k++) {
                userQues[i].sublabels[j].options[k].key =
                  userQues[i].sublabels[j].id +
                  '_' +
                  userQues[i].sublabels[j].options[k].key

                dummyOutputArr[userQues[i].sublabels[j].options[k].key] = {}
                dummyOutputArr[userQues[i].sublabels[j].options[k].key] =
                  userQues[i].sublabels[j].options[k].status
              }
            }
            outputArr[userQues[i].outputId][userQues[i].uuid] = dummyOutputArr
          } else if (
            userQues[i].type == 'compoundradio' ||
            userQues[i].type == 'select'
          ) {
            outputArr[userQues[i].outputId] = {}
            var dummyOutputArr = {}
            for (j = 0; j < userQues[i].sublabels.length; j++) {
              for (
          var a = 0;
                a < userQues[i].sublabels[j].options.length;
                a++
              ) {
                userQues[i].sublabels[j].options[a].key =
                  userQues[i].sublabels[j].id +
                  '_' +
                  userQues[i].sublabels[j].options[a].key

                if (userQues[i].sublabels[j].options[a].status) {
                  dummyOutputArr[userQues[i].sublabels[j].options[a].key] = {}
                  dummyOutputArr[userQues[i].sublabels[j].options[a].key] =
                    userQues[i].sublabels[j].options[a].status
                } else {
                }
              }
            }
            outputArr[userQues[i].outputId][userQues[i].uuid] = dummyOutputArr
          }
        } else {
          if (
            userQues[i].type == 'multiselect' ||
            userQues[i].type == 'compoundcheckbox'
          ) {
            outputArr[userQues[i].outputId] = {}
            var dummyOutputArr = {}
            for (let k = 0; k < userQues[i].options.length; k++) {
              dummyOutputArr[userQues[i].options[k].key] = {}
              dummyOutputArr[userQues[i].options[k].key] =
                userQues[i].options[k].status
            }
            outputArr[userQues[i].outputId][userQues[i].uuid] = dummyOutputArr
          } else if (
            userQues[i].type == 'compoundradio' ||
            userQues[i].type == 'select'
          ) {
            outputArr[userQues[i].outputId] = {}
            var dummyOutputArr = {}
            for (let k = 0; k < userQues[i].options.length; k++) {
              if (userQues[i].options[k].status) {
                dummyOutputArr[userQues[i].options[k].key] = {}
                dummyOutputArr[userQues[i].options[k].key] =
                  userQues[i].options[k].status
              } else {
              }
            }
            outputArr[userQues[i].outputId][userQues[i].uuid] = dummyOutputArr
          } else if (userQues[i].type == 'input') {
            outputArr[userQues[i].outputId] = {}
            outputArr[userQues[i].outputId][userQues[i].uuid] =
              userQues[i].status
          }
        }
      } else {
        if (userQues[i].sublabels.length > 0) {
          if (
            userQues[i].type == 'multiselect' ||
            userQues[i].type == 'compoundcheckbox'
          ) {
            outputArr[userQues[i].uuid] = {}
            for (j = 0; j < userQues[i].sublabels.length; j++) {
              for (k = 0; k < userQues[i].sublabels[j].options.length; k++) {
                outputArr[userQues[i].uuid][userQues[i].sublabels[j].id] =
                  userQues[i].sublabels[j].options[k].status
              }
            }
          } else if (
            userQues[i].type == 'compoundradio' ||
            userQues[i].type == 'select'
          ) {
            outputArr[userQues[i].uuid] = {}
            for (j = 0; j < userQues[i].sublabels.length; j++) {
              for (
                var a = 0;
                a < userQues[i].sublabels[j].options.length;
                a++
              ) {
                if (userQues[i].sublabels[j].options[a].status) {
                  outputArr[userQues[i].uuid][userQues[i].sublabels[j].id] =
                    userQues[i].sublabels[j].options[a].key
                } else {
                }
              }
            }
          }
        } else {
          if (
            userQues[i].type == 'multiselect' ||
            userQues[i].type == 'compoundcheckbox'
          ) {
            outputArr[userQues[i].uuid] = {}
            for (let k = 0; k < userQues[i].options.length; k++) {
              outputArr[userQues[i].uuid][userQues[i].options[k].key] =
                userQues[i].options[k].status
            }
          } else if (
            userQues[i].type == 'compoundradio' ||
            userQues[i].type == 'select'
          ) {
            for (let k = 0; k < userQues[i].options.length; k++) {
              if (userQues[i].options[k].status) {
                outputArr[userQues[i].uuid] = userQues[i].options[k].key
              } else {
              }
            }
          } else if (userQues[i].type == 'input') {
            outputArr[userQues[i].uuid] = userQues[i].options[k].id
          }
        }
      }
    }
    console.log(outputArr)

    outputArr = {}
    alert('Form Submit Successfully')
    userQues = []
    showQues = []
    previousAnsArr = []

    userQuesArrIndex = 0
    this.setState({ dataSource: ds.cloneWithRows(showQues) })
    this.setState({ submitForm: false })

    this.componentWillMount()
    this.setState({ quesDetailsCheck: true })
    this.setState({ botReply: true })
    this.setState({ backBtnOpacity: 'gray', backBtnValidation: true })
  }

  /**
   * @componentDidMount: Represents the life cycle. As soon as the render method has been executed the componentDidMount function is called.
   */
  componentDidMount() {
    debugger
    Keyboard.dismiss()
    SplashScreen.hide()
    this.setState({ botReply: true })
    this.nextQues()
    AppState.addEventListener('change', this._handleAppStateChange)
  }
  /**
   * @componentWillMount:- Represents the life cycle.componentWillMount is called before the render method is executed
   */
  componentWillMount() {
    Actions.refresh({ right: RightButton(Actions.LongAnswerType) })
    this.props.getQues()
  }

  componentWillUnmount() {
    debugger
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    debugger
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      debugger
      console.log('App has come to the foreground!')
      if (this.state.bubbleSize == 0) {
        if (this.state.bankIdForegroungCheck) {
          this.setState({
            bubbleSize: 15,
            opacity: 0,
            loadingAuth: true
          })
          var urlString =
            'https://auth.daking.se/bankid/collect/' + this.state.orderRef // Production
          this.props.loginResponse(urlString)
        }
      }
    }
    this.setState({ appState: nextAppState })
  }

  /**
   * @componentWillReceiveProps: Represents the life cycle.componentWillReceiveProps is only called when the props have changed and when this is not an initial rendering.
   * Note: This function is used to get data from API hit and distribute for further use.
   */
  componentWillReceiveProps(Props) {
    if (Props.timeValue) {
      this.setState({
        switchBtnValue: Props.switchBtnValue,
        timeValue: Props.timeValue
      })
    } else {
      this.setState({ switchBtnValue: false, timeValue: 0 })
    }
    if (Props.quesDetails.questions) {
      if (this.state.quesDetailsCheck) {
        this.setState({ botReply: false })
        quesDetails = Props.quesDetails.questions
        for (i = 0; i < Props.quesDetails.questions.length; i++) {
          var localOptions = []
          var subLabelArr = []
          var sublabelCheckUi = true

          if (Props.quesDetails.questions[i].sublabels) {
            sublabelCheckUi = true
            for (
              let l = 0;
              l < Props.quesDetails.questions[i].sublabels.length;
              l++
            ) {
              if (
                Props.quesDetails.questions[i].sublabels[l].label.en ==
                Props.quesDetails.questions[i].options[0].value.en
              ) {
                sublabelCheckUi = false
              } else {
              }
            }

            if (sublabelCheckUi) {
              for (
                let k = 0;
                k < Props.quesDetails.questions[i].sublabels.length;
                k++
              ) {
                let localOptions = []
                for (
                  j = 0;
                  j < Props.quesDetails.questions[i].options.length;
                  j++
                ) {
                  var localOptionsValue = {
                    sct: '',
                    questions: [],
                    key: '',
                    value: '',
                    status: '',
                    quesType: 'ques'
                  }
                  localOptionsValue.sct =
                    Props.quesDetails.questions[i].options[j].sct
                  localOptionsValue.key =
                    Props.quesDetails.questions[i].options[j].key
                  localOptionsValue.value =
                    Props.quesDetails.questions[i].options[j].value

                  localOptionsValue.status = false
                  localOptionsValue.quesType = 'ques'

                  if (Props.quesDetails.questions[i].options[j].questions) {
                    localOptionsValue.questions =
                      Props.quesDetails.questions[i].options[j].questions
                  }
                  localOptions.push(localOptionsValue)
                }
                subLabelArr.push({
                  label: Props.quesDetails.questions[i].sublabels[k].label,
                  id: Props.quesDetails.questions[i].sublabels[k].id,
                  sct: Props.quesDetails.questions[i].sublabels[k].sct,
                  options: localOptions
                })
              }
            } else {
              for (
                j = 0;
                j < Props.quesDetails.questions[i].options.length;
                j++
              ) {
                var localOptionsValue = {
                  sct: '',
                  questions: [],
                  key: '',
                  value: '',
                  status: '',
                  quesType: 'ques'
                }
                localOptionsValue.sct =
                  Props.quesDetails.questions[i].options[j].sct
                localOptionsValue.key =
                  Props.quesDetails.questions[i].options[j].key
                localOptionsValue.value =
                  Props.quesDetails.questions[i].options[j].value

                localOptionsValue.status = false
                localOptionsValue.quesType = 'ques'

                if (Props.quesDetails.questions[i].options[j].questions) {
                  localOptionsValue.questions =
                    Props.quesDetails.questions[i].options[j].questions
                }
                localOptions.push(localOptionsValue)
              }
            }
          } else {
            for (
              j = 0;
              j < Props.quesDetails.questions[i].options.length;
              j++
            ) {
              var localOptionsValue = {
                sct: '',
                questions: [],
                key: '',
                value: '',
                status: '',
                quesType: 'ques'
              }
              localOptionsValue.sct =
                Props.quesDetails.questions[i].options[j].sct
              localOptionsValue.key =
                Props.quesDetails.questions[i].options[j].key
              localOptionsValue.value =
                Props.quesDetails.questions[i].options[j].value

              localOptionsValue.status = false
              localOptionsValue.quesType = 'ques'

              if (Props.quesDetails.questions[i].options[j].questions) {
                localOptionsValue.questions =
                  Props.quesDetails.questions[i].options[j].questions
              }
              localOptions.push(localOptionsValue)
            }
          }
          switch (Props.quesDetails.questions[i].type) {
            case 'multiselect':
            case 'compoundcheckbox':
            case 'select':
            case 'compoundradio':
              userQues.push({
                uuid: Props.quesDetails.questions[i].uuid,

                options: localOptions,
                label: Props.quesDetails.questions[i].label,
                id: Props.quesDetails.questions[i].id,
                subType: Props.quesDetails.questions[i].subType,
                type: Props.quesDetails.questions[i].type,
                sublabels: subLabelArr
              })
              break

            case 'input':
              userQues.push({
                uuid: Props.quesDetails.questions[i].uuid,
                status: '',
                quesType: 'ques',
                label: Props.quesDetails.questions[i].label,
                id: Props.quesDetails.questions[i].id,
                subType: Props.quesDetails.questions[i].subType,
                type: Props.quesDetails.questions[i].type,
                sublabels: subLabelArr
              })
              break
          }
        }

        this.showQuesFun(userQues)

        this.setState({ quesDetailsCheck: false })
      }
    }
    debugger
    if (Props.bankIdToken.autoStartToken) {
      this.setState({
        orderRef: Props.bankIdToken.orderRef,
        bankIdForegroungCheck: true
      })
      this.bankIdAuth(
        Props.bankIdToken.autoStartToken,
        Props.bankIdToken.orderRef
      )
      this.setState({
        bubbleSize: 0,
        opacity: 1,
        loadingAuth: false
      })
    }

    if (Props.bankidResponseCheck == false) {
      debugger
      this.setState({
        bubbleSize: 0,
        opacity: 1,
        loadingAuth: false
      })
      this.setState({ bankIdForegroungCheck: false })
    }
    if (Props.bankIdResponse.birthDate) {
      alert(JSON.stringify(Props.bankIdResponse))
    }
  }

  /**
   *
   * @param {userQues is an array which is having set of all question from api response.} userQues
   *
   * @showQuesFun: This function is used to show question dynamically through chatbot.
   */

  showQuesFun(userQues) {
    if (showQues.length == 0) {
      switch (userQues[userQuesArrIndex].type) {
        case 'multiselect':
        case 'compoundcheckbox':
        case 'select':
        case 'compoundradio':
          showQues.push({
            uuid: userQues[userQuesArrIndex].uuid,

            options: userQues[userQuesArrIndex].options,
            label: userQues[userQuesArrIndex].label,
            id: userQues[userQuesArrIndex].id,
            subType: userQues[userQuesArrIndex].subType,
            type: userQues[userQuesArrIndex].type,
            sublabels: userQues[userQuesArrIndex].sublabels
          })

          break

        case 'input':
          if (userQues[userQuesArrIndex].status) {
            showQues.push({
              uuid: userQues[userQuesArrIndex].uuid,
              label: userQues[userQuesArrIndex].label,
              status: userQues[userQuesArrIndex].status,
              quesType: userQues[userQuesArrIndex].quesType,
              id: userQues[userQuesArrIndex].id,
              subType: userQues[userQuesArrIndex].subType,
              type: userQues[userQuesArrIndex].type,
              sublabels: userQues[userQuesArrIndex].sublabels
            })
          } else {
            showQues.push({
              uuid: userQues[userQuesArrIndex].uuid,
              label: userQues[userQuesArrIndex].label,
              status: '',
              quesType: 'ques',
              id: userQues[userQuesArrIndex].id,
              subType: userQues[userQuesArrIndex].subType,
              type: userQues[userQuesArrIndex].type,
              sublabels: userQues[userQuesArrIndex].sublabels
            })
          }
          break
      }
    } else {
      showQues.pop()
      // for(i=0;i<userQues[userQuesArrIndex+1].options.length;i++)
      // {
      //     userQues[userQuesArrIndex+1].options[i].status=false
      // }

      switch (userQues[userQuesArrIndex].type) {
        case 'multiselect':
        case 'compoundcheckbox':
        case 'select':
        case 'compoundradio':
          showQues.push({
            uuid: userQues[userQuesArrIndex].uuid,

            options: userQues[userQuesArrIndex].options,
            label: userQues[userQuesArrIndex].label,
            id: userQues[userQuesArrIndex].id,
            subType: userQues[userQuesArrIndex].subType,
            type: userQues[userQuesArrIndex].type,
            sublabels: userQues[userQuesArrIndex].sublabels
          })

          break

        case 'input':
          if (userQues[userQuesArrIndex].status) {
            showQues.push({
              uuid: userQues[userQuesArrIndex].uuid,
              id: userQues[userQuesArrIndex].id,
              subType: userQues[userQuesArrIndex].subType,
              label: userQues[userQuesArrIndex].label,
              id: userQues[userQuesArrIndex].id,
              status: userQues[userQuesArrIndex].status,
              quesType: userQues[userQuesArrIndex].quesType,
              type: userQues[userQuesArrIndex].type,
              sublabels: userQues[userQuesArrIndex].sublabels
            })
          } else {
            showQues.push({
              uuid: userQues[userQuesArrIndex].uuid,
              status: '',
              quesType: 'ques',
              label: userQues[userQuesArrIndex].label,
              id: userQues[userQuesArrIndex].id,
              subType: userQues[userQuesArrIndex].subType,
              type: userQues[userQuesArrIndex].type,
              sublabels: userQues[userQuesArrIndex].sublabels
            })
          }
          break
      }
    }

    if (showQues[0].sublabels.length > 0) {
      this.setState({ dataSource1: ds.cloneWithRows(showQues[0].sublabels) })
    } else {
    }

    userQuesArrIndex = userQuesArrIndex + 1
    this.setState({ dataSource: ds.cloneWithRows(showQues) })
  }
  /**
   * @hideShowModel: This functions is used to show/hide model for selecting Languages
   */

  hideShowModel() {
    this.setState({ languageModal: !this.state.languageModal })
  }

  /**
   * @selectLanguage : This function fires when user select any language from language list.
   * @param {Represenths the indes of selected language} index
   */

  selectLanguage(index) {
    language = languageList[index].code
    languageName = languageList[index].language
    for (i = 0; i < languageList.length; i++) {
      if (i == index) {
        languageList[i].status = true
      } else {
        languageList[i].status = false
      }
    }
    this.setState({ homeNo: 'a' })
    this.setState({ dataSource1: ds.cloneWithRows(showQues[0].sublabels) })
    if (previousAnsArr.length > 0) {
      this.setState({
        dataSource2: ds.cloneWithRows(previousAnsArr[0].sublabels)
      })
    } else {
    }
  }
  /**
   * @render: Represents the UI interface of the app
   */
  render() {
    return (
      <View
        pointerEvents={this.state.pointerEvents}
        style={{
          backgroundColor: '#fff',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        {/* <Modal isVisible={this.state.languageModal}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20 }}>
            <View>
              <View style={{ flexDirection: 'row', padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <Image
                    style={{ width: 66, height: 58 }}
                    source={require('../../images/bot-10-2-512.png')}
                  />
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Image
                      style={{ position: 'absolute' }}
                      source={require('../../images/receive.png')}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      maxWidth: WINDOW_WIDTH / 1.6,
                      backgroundColor: '#57d3f2',
                      overflow: 'hidden',
                      borderRadius: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10
                    }}>
                    <Text
                      style={{
                        padding: 10,
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: '#fff'
                      }}>
                      Please select any language
                    </Text>
                  </View>
                </View>
              </View>

              <FlatList
                style={{ paddingTop: 10, marginBottom: 10 }}
                ref={ref => (this.flatList = ref)}
                keyExtractor={this._keyExtractor}
                data={languageList}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomColor: 'grey',
                      borderBottomWidth: 1
                    }}
                    onPress={() => this.selectLanguage(index)}>
                    <View style={globalStyle.radioButton}>
                      {item.status ? (
                        <Icon
                          name="ios-radio-button-on"
                          size={25}
                          color="#008FAC"
                        />
                      ) : (
                        <Icon
                          name="ios-radio-button-off-outline"
                          size={25}
                          color="#94989C"
                        />
                      )}
                    </View>
                    <View style={globalStyle.optionsContainerView}>
                      <Text
                        style={{
                          margin: 10,
                          fontWeight: 'bold',
                          fontSize: 20,
                          color: 'grey'
                        }}>
                        {item.language}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                disabled={this.props.loading}
                style={{
                  backgroundColor: '#87D791',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: WINDOW_WIDTH / 2,
                  height: 50,
                  margin: 20,
                  borderRadius: 30

                  // marginTop: 20
                }}
                onPress={() => this.hideShowModel()}>
                <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View
          style={{
            paddingTop: 25,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: WINDOW_WIDTH,
            backgroundColor: '#87D791'
          }}>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              flexDirection: 'row',
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
              alignItems: 'center'
            }}
            onPress={() => this.hideShowModel()}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {languageName}
            </Text>
            <Icon
              name="ios-arrow-down"
              size={20}
              color="#fff"
              style={{ marginLeft: 5, marginTop: 4 }}
            />
          </TouchableOpacity>

          <View style={{ flexDirection: 'column' }}>
            <Text style={{ color: '#fff' }}>Anna Anderson</Text>
            <Text style={{ color: '#fff' }}>19121212-1212</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Actions.Settings({
                switchBtnValue: this.state.switchBtnValue,
                timeValue: this.state.timeValue
              })
            }>
            <View>
              <Icon
                name="ios-settings"
                size={20}
                color="#fff"
                style={{ marginRight: 10, marginTop: 4 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#fff', flex: 1 }}>
          <ScrollView
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true })
            }}
            style={{
              backgroundColor: '#fff',
              maxHeight: WINDOW_HEIGHT / 1.11
            }}>
            <FlatList
              style={{ paddingTop: 10, marginBottom: 10 }}
              ref={ref => (this.flatList = ref)}
              keyExtractor={this._keyExtractor}
              data={previousAnsArr}
              renderItem={({ item, index }) => (
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={require('../../images/bot-10-2-512.png')}
                      />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end'
                        }}>
                        <Image
                          style={{ position: 'absolute' }}
                          source={require('../../images/receive.png')}
                        />
                      </View>

                      <View
                        style={{
                          maxWidth: WINDOW_WIDTH / 1.25,
                          backgroundColor: '#57d3f2',
                          overflow: 'hidden',
                          borderRadius: 15,
                          marginTop: 20,
                          marginLeft: 9,
                          padding: 2.5
                        }}>
                        <Text
                          style={{
                            padding: 10,

                            fontWeight: 'bold',

                            color: '#fff'
                          }}>
                          {item.label[language]}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {item.type == 'input' ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                      }}>
                      <Image
                        style={{ width: 40, height: 40, opacity: 0 }}
                        source={require('../../images/bot-10-2-512.png')}
                      />
                      <View
                        style={{
                          maxWidth: WINDOW_WIDTH / 1.3,
                          backgroundColor: '#87D791',
                          overflow: 'hidden',
                          borderRadius: 15,
                          marginTop: 5,
                          marginRight: 9.5,
                          alignItems: 'flex-end'
                        }}>
                        <Text
                          style={{
                            padding: 15,
                            marginLeft: 10,
                            fontWeight: 'bold',

                            color: '#fff'
                          }}>
                          {item.status}
                        </Text>
                      </View>

                      <View
                        style={{
                          alignItems: 'flex-end',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          marginRight: 10,
                          marginTop: 10
                        }}>
                        <Image
                          style={{ position: 'absolute' }}
                          source={require('../../images/send.png')}
                        />
                      </View>
                    </View>
                  ) : item.sublabels.length > 0 ? (
                    <ListView
                      dataSource={this.state.dataSource2}
                      renderRow={(rowData, rowID, sectionID) => (
                        <FlatList
                          style={{ paddingTop: 10, marginBottom: 10 }}
                          ref={ref => (this.flatList = ref)}
                          keyExtractor={this._keyExtractor}
                          data={rowData.options}
                          renderItem={({ item, index }) => (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                              }}>
                              {item.status ? (
                                <View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                      alignItems: 'flex-end'
                                    }}>
                                    <Image
                                      style={{
                                        width: 40,
                                        height: 40,
                                        opacity: 0
                                      }}
                                      source={require('../../images/bot-10-2-512.png')}
                                    />
                                    <View
                                      style={{
                                        maxWidth: WINDOW_WIDTH / 1.3,
                                        backgroundColor: '#87D791',
                                        overflow: 'hidden',
                                        borderRadius: 15,
                                        marginTop: 5,
                                        marginRight: 9.5,
                                        flexDirection: 'row',
                                        alignItems: 'flex-end'
                                      }}>
                                      <Text
                                        style={{
                                          padding: 13,
                                          marginRight: 10,
                                          fontWeight: 'bold',

                                          color: '#fff'
                                        }}>
                                        {rowData.label[language]}
                                        :- {item.value[language]}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        alignItems: 'flex-end',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginRight: 10,
                                        marginTop: 10
                                      }}>
                                      <Image
                                        style={{ position: 'absolute' }}
                                        source={require('../../images/send.png')}
                                      />
                                    </View>
                                  </View>
                                </View>
                              ) : (
                                <View />
                              )}
                            </View>
                          )}
                        />
                      )}
                    />
                  ) : (
                    <FlatList
                      style={{ paddingTop: 10, marginBottom: 10 }}
                      ref={ref => (this.flatList = ref)}
                      keyExtractor={this._keyExtractor}
                      data={item.options}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                          }}>
                          {item.status ? (
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  alignItems: 'flex-end'
                                }}>
                                <Image
                                  style={{ width: 40, height: 40, opacity: 0 }}
                                  source={require('../../images/bot-10-2-512.png')}
                                />
                                <View
                                  style={{
                                    maxWidth: WINDOW_WIDTH / 1.3,
                                    backgroundColor: '#87D791',
                                    overflow: 'hidden',
                                    borderRadius: 15,
                                    marginTop: 5,
                                    marginRight: 9.5,
                                    flexDirection: 'row',
                                    alignItems: 'flex-end'
                                  }}>
                                  <Text
                                    style={{
                                      padding: 13,
                                      marginRight: 10,
                                      fontWeight: 'bold',

                                      color: '#fff'
                                    }}>
                                    {item.value[language]}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    alignItems: 'flex-end',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginRight: 10,
                                    marginTop: 10
                                  }}>
                                  <Image
                                    style={{ position: 'absolute' }}
                                    source={require('../../images/send.png')}
                                  />
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View />
                          )}
                        </View>
                      )}
                    />
                  )}
                </View>
              )}
            />

            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData, rowID, sectionID) => (
                <View style={{ flex: 1, marginBottom: 30 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <Image
                        style={{ width: 66, height: 58 }}
                        source={require('../../images/bot-10-2-512.png')}
                      />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end'
                        }}>
                        <Image
                          style={{ position: 'absolute' }}
                          source={require('../../images/receive.png')}
                        />
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          maxWidth: WINDOW_WIDTH / 1.3,
                          backgroundColor: '#57d3f2',
                          overflow: 'hidden',
                          borderRadius: 25,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: 10
                        }}>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 17,
                            fontWeight: 'bold',
                            color: '#fff'
                          }}>
                          {rowData.label[language]}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {rowData.sublabels.length > 0 ? (
                    <View>
                      {rowData.type == 'multiselect' ||
                      rowData.type == 'compoundcheckbox' ? (
                        <ListView
                          style={{ paddingTop: 20 }}
                          dataSource={this.state.dataSource1}
                          renderRow={(rowData1, rowID1, sectionID1) => (
                            <View>
                              <Text
                                style={{
                                  margin: 10,
                                  color: 'grey',
                                  fontWeight: 'bold',
                                  fontSize: 20
                                }}>
                                {rowData1.label[language]}
                              </Text>
                              <FlatList
                                style={{ paddingTop: 10 }}
                                ref={ref => (this.flatList = ref)}
                                keyExtractor={this._keyExtractor}
                                data={rowData1.options}
                                renderItem={({ item, index }) => (
                                  <CheckBox
                                    onPress={() =>
                                      this.sublabelCheckboxFun(
                                        sectionID1,
                                        index,
                                        rowData1.options
                                      )
                                    }
                                    title={item.value[language]}
                                    containerStyle={{
                                      backgroundColor: 'transparent',
                                      borderColor: 'transparent',
                                      borderBottomColor: 'grey'
                                    }}
                                    checked={item.status}
                                  />
                                )}
                              />
                            </View>
                          )}
                        />
                      ) : rowData.type == 'compoundradio' ||
                      rowData.type == 'select' ? (
                        <ListView
                          style={{ paddingTop: 20 }}
                          dataSource={this.state.dataSource1}
                          renderRow={(rowData1, rowID1, sectionID1) => (
                            <View>
                              <Text
                                style={{
                                  margin: 10,
                                  color: 'grey',
                                  fontWeight: 'bold',
                                  fontSize: 20
                                }}>
                                {rowData1.label[language]}
                              </Text>
                              <FlatList
                                style={{ paddingTop: 20, marginBottom: 20 }}
                                ref={ref => (this.flatList = ref)}
                                keyExtractor={this._keyExtractor}
                                data={rowData1.options}
                                renderItem={({ item, index }) => (
                                  <TouchableOpacity
                                    disabled={item.status}
                                    style={{
                                      flexDirection: 'row',
                                      borderBottomColor: 'grey',
                                      borderBottomWidth: 1
                                    }}
                                    onPress={() =>
                                      this.sublabelRadiobtnFun(
                                        sectionID1,
                                        index,
                                        rowData1.options
                                      )
                                    }>
                                    <View style={globalStyle.radioButton}>
                                      {item.status ? (
                                        <Icon
                                          name="ios-radio-button-on"
                                          size={25}
                                          color="#008FAC"
                                        />
                                      ) : (
                                        <Icon
                                          name="ios-radio-button-off-outline"
                                          size={25}
                                          color="#94989C"
                                        />
                                      )}
                                    </View>
                                    <View
                                      style={globalStyle.optionsContainerView}>
                                      <Text>{item.value[language]}</Text>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              />
                            </View>
                          )}
                        />
                      ) : (
                        <View />
                      )}
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'column' }}>
                      {rowData.type == 'input' ? (
                        <View style={{ alignItems: 'center' }}>
                          {rowData.subType == 'number' ? (
                            <Input
                              keyboardType={'numeric'}
                              style={{
                                color: 'grey',
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                                width: WINDOW_WIDTH / 1.1
                              }}
                              // value={this.state.message}
                              placeholder="Enter your value here.."
                              value={rowData.status}
                              placeholderTextColor="#aaaaaa"
                              onChangeText={text =>
                                this.inputFun(text, rowData)
                              }
                            />
                          ) : (
                            <Input
                              style={{
                                color: 'grey',
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                                width: WINDOW_WIDTH / 1.1
                              }}
                              // value={this.state.message}
                              placeholder="Enter your value here.."
                              value={rowData.status}
                              placeholderTextColor="#aaaaaa"
                              onChangeText={text =>
                                this.inputFun(text, rowData)
                              }
                            />
                          )}
                        </View>
                      ) : rowData.type == 'multiselect' ||
                      rowData.type == 'compoundcheckbox' ? (
                        <View>
                          <FlatList
                            style={{ paddingTop: 20 }}
                            ref={ref => (this.flatList = ref)}
                            keyExtractor={this._keyExtractor}
                            data={rowData.options}
                            renderItem={({ item, index }) => (
                              <CheckBox
                                onPress={() =>
                                  this.checkboxFun(index, rowData.options)
                                }
                                title={item.value[language]}
                                containerStyle={{
                                  backgroundColor: 'transparent',
                                  borderColor: 'transparent',
                                  borderBottomColor: 'grey'
                                }}
                                checked={item.status}
                              />
                            )}
                          />
                        </View>
                      ) : rowData.type == 'compoundradio' ||
                      rowData.type == 'select' ? (
                        <FlatList
                          style={{ paddingTop: 20, marginBottom: 20 }}
                          ref={ref => (this.flatList = ref)}
                          keyExtractor={this._keyExtractor}
                          data={rowData.options}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              disabled={item.status}
                              style={{
                                flexDirection: 'row',
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1
                              }}
                              onPress={() =>
                                this.radioBtnFun(index, rowData.options)
                              }>
                              <View style={globalStyle.radioButton}>
                                {item.status ? (
                                  <Icon
                                    name="ios-radio-button-on"
                                    size={25}
                                    color="#008FAC"
                                  />
                                ) : (
                                  <Icon
                                    name="ios-radio-button-off-outline"
                                    size={25}
                                    color="#94989C"
                                  />
                                )}
                              </View>
                              <View style={globalStyle.optionsContainerView}>
                                <Text>{item.value[language]}</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      ) : (
                        <View />
                      )}
                    </View>
                  )}
                </View>
              )}
            />

            {this.state.submitForm ? (
              // (true) ?
              this.state.botReply ? (
                <View
                  style={{
                    flexDirection: 'row'
                  }}>
                  <Image
                    style={{ width: 66, height: 58 }}
                    source={require('../../images/bot-10-2-512.png')}
                  />
                  <View>
                    <Bubbles size={10} color="#57d3f2" />
                  </View>
                </View>
              ) : (
                <View />
              )
            ) : this.state.botReply ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <Image
                  style={{ width: 66, height: 58 }}
                  source={require('../../images/bot-10-2-512.png')}
                />
                <View style={{ alignItems: 'center' }}>
                  <Bubbles size={10} color="#57d3f2" />
                </View>
              </View>
            ) : (
              <View />
            )}
          </ScrollView>
        </View>
        {this.state.botReply ? (
          <View />
        ) : this.state.submitForm ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 7,
              backgroundColor: 'gray'
            }}>
            <TouchableOpacity
              disabled={this.state.backBtnValidation}
              onPress={() => {
                this.backQues()
              }}
              style={styles.quesButton}>
              <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="ios-arrow-back"
                  size={20}
                  color={this.state.backBtnOpacity}
                  style={{ marginRight: 5, marginTop: 4 }}
                />
                <Text
                  style={{ color: this.state.backBtnOpacity, fontSize: 17 }}>
                  {' '}
                  Back
                </Text>
              </View>
            </TouchableOpacity>
            {this.state.btnValidation ? (
              <View />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.submitForm()
                }}
                style={styles.quesButton}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Text style={{ color: '#fff', fontSize: 17, disabled: true }}>
                    {' '}
                    Submit
                  </Text>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    color="#fff"
                    style={{ marginLeft: 7, marginTop: 4 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 7,
              backgroundColor: 'gray'
            }}>
            <TouchableOpacity
              disabled={this.state.backBtnValidation}
              onPress={() => {
                this.backQues()
              }}
              style={styles.quesButton}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Icon
                  name="ios-arrow-back"
                  size={20}
                  color={this.state.backBtnOpacity}
                  style={{ marginRight: 5, marginTop: 4 }}
                />
                <Text
                  style={{ color: this.state.backBtnOpacity, fontSize: 17 }}>
                  {' '}
                  Back
                </Text>
              </View>
            </TouchableOpacity>
            {this.state.btnValidation ? (
              <View />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.nextQues()
                }}
                style={styles.quesButton}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Text style={{ color: '#fff', fontSize: 17, disabled: true }}>
                    {' '}
                    Next
                  </Text>
                  <Icon
                    name="ios-arrow-forward"
                    size={20}
                    color="#fff"
                    style={{ marginLeft: 7, marginTop: 4 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        )} */}

        <TouchableOpacity
          disabled={this.state.loadingAuth}
          onPress={() => {
            this.bankIdToken()
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 21,
              opacity: this.state.opacity
            }}>
            click for auth
          </Text>
          <View>
            <Bubbles size={this.state.bubbleSize} color="#57d3f2" />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

/**
 * @styles: Represents the styling section
 */

const styles = StyleSheet.create({
  textInputContainer: {
    height: 80,
    backgroundColor: 'white',
    padding: 5,
    marginTop: 10
  },

  titleContainer: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderColor: 'black',
    padding: 10
  },

  title: {
    fontSize: 20,
    color: '#696E75',
    textAlign: 'left',
    fontWeight: 'bold'
  },

  textInputTitle: {
    fontSize: 15,
    color: 'black',
    textAlign: 'left'
  },

  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
    padding: 10
  },
  calendarContainer: {
    flex: 0.7,
    paddingVertical: height * 0.02
  },

  quesButton: {
    margin: 5,

    overflow: 'hidden',

    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 'bold',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalDetail)
