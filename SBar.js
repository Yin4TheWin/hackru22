import { SearchBar, Keyboard } from 'react-native-elements';
import Modal from "react-native-modal";
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

let responseData = null;
let exportScore = -1;
let searchedWord = "";
function getData(InputString)
{
    const axios = require("axios");
    const options = {
      method: 'GET',
      url: 'https://api.spoonacular.com/recipes/guessNutrition?',
      header: {'Content-Type': 'application/json'},
      params: {apiKey:'cd65c6a5839742d7947bfface7ac62ad', title: InputString}
    };
    return axios.request(options).then(function (response) {
        responseData = response.data;
        calculateScore(responseData);
    }).catch(function (error) {
        console.error(error);
    });
}

function calculateScore(data)
{
    let maxFat = 30;
    let maxCarbs = 40;
    let proteinV = data.protein.value;
    let proteinW = 1.5;
    let fatV = data.fat.value;
    let fatW = .55;
    let carbV = data.carbs.value;
    let carbW = .70;
    let calV = data.calories.value;
    let calW = calV - calV/fatV - calV/(1.2*carbV);

    if(fatV > maxFat)
        fatW = -.15;
    if(carbV > maxCarbs)
        carbW = -.07;

    exportScore = Math.round(proteinV*proteinW + calW/10 + fatW*fatV + carbW*carbV)
    console.log(exportScore);
}

export default class SBar extends React.Component{
    
    state = {
      search: '',
      modalVisible: false,
    };
    
  
    updateSearch = (search) => {
      this.setState({search: search, modalVisible: this.modalVisible });
    };
  
    render() {
      const { search } = this.state;
      const  modalV  = this.state.modalVisible;
      return (
        <View> 
            <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              onSubmitEditing={() => {  getData(search).then(()=>{searchedWord = search;this.setState({search: search, modalVisible: true})});} }
              value={search} />
              <View>
              <Modal style = {styles.modalContainer}
              isVisible = {modalV}
              onBackdropPress={() => this.setState({search: search, modalVisible: false})}>
              <View style={styles.modal}>
                <View>
                    <Text style = {styles.title}> You ate {searchedWord} and gained {exportScore} strength</Text>
                </View>
              </View>
            </Modal>
            </View>
        </View>
      );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal:{
      backgroundColor:"white",
      width:"60%",
      height:"auto",
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:5
    },
    modalContainer:{
        alignItems: 'center',
    },
    title:{
      fontWeight:"bold",
      fontSize:20,
      padding:15,
      color:"#000"
    },
    divider:{
      width:"100%",
      height:1,
      backgroundColor:"lightgray"
    },
    actions:{
      borderRadius:5,
      marginHorizontal:10,
      paddingVertical:10,
      paddingHorizontal:20
    },
    actionText:{
      color:"#fff"
    }
  });