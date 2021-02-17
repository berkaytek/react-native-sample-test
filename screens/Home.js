import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, Text, FlatList, Button } from 'react-native';
import { Block, theme } from 'galio-framework';
import { Input, Icon } from "galio-framework";
import articles from '../constants/articles';


const { width } = Dimensions.get('screen');


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      inputText:'',
      searchingData:true
    };
  }
  
  /*componentDidMount() {
    fetch('https://localhost:44391/api/Keyword/get/htt')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }*/

  /*componentDidMount() {
    fetch('https://reactnative.dev/movies.json')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.movies });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }*/
  getData(searchText) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/xml");
    
    var raw = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <Get xmlns=\"http://tempuri.org/\">\r\n      <username>batu@ucmak.net</username>\r\n      <password>1234</password>\r\n      <searchText>"+searchText+"</searchText>\r\n    </Get>\r\n  </soap:Body>\r\n</soap:Envelope>";
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://crossword.hucumkedi.com/keyword.asmx?op=Get", requestOptions)
      .then(response => response.text())
      .then(result =>{ 
        
        
        var XMLParser = require('react-xml-parser');
        var xml = new XMLParser().parseFromString(result);    // Assume xmlText contains the example XML
        var resultDatas=xml.children[0].children[0].children[0].children;

        var Datas=[];
        resultDatas.forEach(k=>{


          var item= {

            NoteId:k.children[0].value,
            TableId:k.children[1].value,
            Keyword:k.children[2].value
          }
          
          Datas.push(item);



        })

        this.setState({data:Datas});

      })

      .catch(error => console.log('haha error go brr brr', error));

  }
  getDataById(noteId) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/xml");
    
    var raw = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n  <soap:Body>\r\n    <GetNoteById xmlns=\"http://tempuri.org/\">\r\n      <username>batu@ucmak.net</username>\r\n      <password>1234</password>\r\n      <noteId>"+noteId+"</noteId>\r\n    </GetNoteById>\r\n  </soap:Body>\r\n</soap:Envelope>";
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://crossword.hucumkedi.com/keyword.asmx?op=Get", requestOptions)
      .then(response => response.text())
      .then(result => {
        
        //console.log(result)
      
        var XMLParser = require('react-xml-parser');
        var xml = new XMLParser().parseFromString(result);    // Assume xmlText contains the example XML
        var resultDatas=xml.children[0].children[0].children[0];



        var Datas=[];
        
        var item= {

          StatusId:resultDatas.children[0].value,
          InsertionTime:resultDatas.children[1].value,
          NoteId:resultDatas.children[2].value,
          Note:resultDatas.children[3].value

        }

         Datas.push(item);



        

        this.setState({data:Datas});
        
        
      
      }
      )
      .catch(error => console.log('error', error));
  }

  onTextChangeHandler(text) {
    this.setState({inputText: text});
    this.setState({searchingData:true});
    if(text.length>1)
    {
    this.getData(text);
    }
    else{
      this.setState({data:[]});
    }
  }


  renderArticles = () => {
    const { data, isLoading, inputText, searchingData} = this.state;
    
    return (
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
        <Input
        right
        color="black"
        style={styles.search}
        placeholder="Aradığınız yazılım terimini giriniz..."
        placeholderTextColor={'#8898AA'}
        onChangeText={(text) =>{ this.onTextChangeHandler(text) }}

        iconContent={<Icon size={28} color={theme.COLORS.MUTED} name="search" family="Fontisto" onPress={() => {this.setState({searchingData:true}); this.getData({inputText})}}/>}
      />

      {searchingData  ?
      
      
        <FlatList
            data={data}
            keyExtractor={({ TableId }, index) => TableId}
            renderItem={({ item }) => (
              <Text style= {styles.results} onPress={() => {this.getDataById(item.NoteId); this.setState({searchingData:false})}}>{item.Keyword}</Text>
            )}
          />
          :
          <FlatList
            data={data}
            keyExtractor={({ InsertionTime }, index) => InsertionTime}
            renderItem={({ item }) => (
              <Text>{item.Note}</Text>
            )}
          />
          }
        </Block>
      </ScrollView>
    )
  }

  render() {
    
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  results:{
    fontSize:24,
    marginTop:8

  }
});

export default Home;


/*        <FlatList
            data={data}
            keyExtractor={({ TableId }, index) => TableId}
            renderItem={({ item }) => (
              <Text>{item.NoteId}, {item.Keyword}</Text>
            )}
          />
                   
          */