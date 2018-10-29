import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Dimensions
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CalendarPicker from 'react-native-calendar-picker';
import {Actions} from 'react-native-router-flux'
import { RightButton } from '../../components/RightButton';
import moment from 'moment'
import  {globalStyle} from '../../constants/GlobalStyleSheet.js';

const { height, width } = Dimensions.get('window');
const dateFormat = 'YYYY-MM-DD';
export default class DateSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new moment().format(dateFormat),
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    componentWillMount(){
      Actions.refresh({ right: RightButton(Actions.SliderTypeAnswer) })
    }

    componentDidMount(){
       Keyboard.dismiss()
    }

    onDateChange(date) {
        this.setState({
            selectedDate: date.format(dateFormat),
        });
    }

    render() {
        return (
            <View style={globalStyle.container}>
                 {/* <View style={globalStyle.headerView}>
                    <Text style={globalStyle.headerText}>Which Day/Date did your earproblems begin?</Text>
                </View> */}
                {/* <View style={styles.dateView}>
                    <Text style={[globalStyle.headerText,{fontWeight: 'normal'}]}>Selected Date: {this.state.selectedDate}</Text>
                </View>  */}
                <View style={styles.calendarContainer}>
                    <CalendarPicker
                       maxDate={new moment()}
                        onDateChange={this.onDateChange}

                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    dateView: {
        flex: 0.1,
        paddingHorizontal: height * 0.03,
        borderBottomWidth: 1,
        justifyContent: 'center'
    },

    calendarContainer:{
      flex: 0.7,
      paddingVertical: height*0.02
    }
});
