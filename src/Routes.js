import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Actions, Router, Scene, Stack } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Ionicons';
import PersonalDetail from './containers/PersonalDetail';
import Settings from "./containers/Settings"
import LongAnswerType from './containers/LongAnswerType'
import DateSelection from './containers/DateSelection'
import SliderTypeAnswer from './containers/SliderTypeAnswer'
import SelectCountry from './containers/Selectcountry'
import RadioTypeAnswer from './containers/RadioTypeAnswer'
import CheckboxTypeAnswer from './containers/CheckboxTypeAnswer'
import RadioTypeAnswer2 from './containers/RadioTypeAnswer2'
import LongDescriptionType from './containers/LongDescriptionType'
import QandA from './containers/QandA'
import SliderTypeA from './../Test/SliderTypeA.js'

const { height, width } = Dimensions.get('window');
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
class RouterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this._renderBackButton = this._renderBackButton.bind(this)
        this._renderRightButton = this._renderRightButton.bind(this)
        this._renderTitle = this._renderTitle.bind(this)
    }

    _renderBackButton() {
        return (
            <TouchableOpacity onPress={Actions.pop} style={{
                flex: 1,
                padding: height * 0.01,
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>

                <Image style={{ width: 34, height: 40 }} source={require('./images/previous.png')} />
            </TouchableOpacity>
        )
    }

    _renderRightButton() {
        return (
            <TouchableOpacity onPress={null} style={{
                flex: 1,
                padding: height * 0.01,
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <Image style={{ width: 34, height: 40 }} source={require('./images/next.png')} />
            </TouchableOpacity>
        )
    }

    _renderTitle(name, patientId) {

        return (
            <View style={{ flex: 1, flexDirection: "row",alignItems:"center", justifyContent: "space-between", width: WINDOW_WIDTH }}>

                <View>
                    <Icon name="ios-help-buoy" size={20} color="#fff" style={{ marginRight: 5, marginTop: 4,opacity:0 }} />
                </View>
                <View style={{ flexDirection: "column", }}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.title}>{patientId}</Text>
                </View>
                <View style={{marginRight:10}} >
                    <Icon name="ios-help-buoy" size={20} color="#fff" style={{ marginRight: 5, marginTop: 4,}} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <Router>
                <Scene
                  
                    key="root"
                    headerTintColor="white"
                    hideNavBar
                    navigationBarStyle={{ backgroundColor: '#87D791' }}
                    renderBackButton={this._renderBackButton}
                    renderRightButton={this._renderRightButton}
                >
                    <Stack>
                        <Scene  hideNavBar key='PersonalDetail' component={PersonalDetail}
                            
                        />
                        <Scene  hideNavBar key='Settings' component={Settings}
                            
                            />
                        <Scene key="LongAnswerType" component={LongAnswerType}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="DateSelection" component={DateSelection}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="SliderTypeAnswer" component={SliderTypeAnswer}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="SelectCountry" component={SelectCountry}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="CheckboxTypeAnswer" component={CheckboxTypeAnswer}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="RadioTypeAnswer" component={RadioTypeAnswer}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="RadioTypeAnswer2" component={RadioTypeAnswer2}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="LongDescriptionType" component={LongDescriptionType}
                            //initial
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        <Scene key="QandA" component={QandA}
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                            renderRightButton={() => {
                                return (<View></View>)
                            }}
                        />
                        <Scene key="SliderTypeA" component={SliderTypeA}
                            //initial
                            renderTitle={() => this._renderTitle("Anna Anderson", "19121212-1212")}
                        />
                        
                    </Stack>
                </Scene>
            </Router>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',

    },
})
export default RouterComponent;
