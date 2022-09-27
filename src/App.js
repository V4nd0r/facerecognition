import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/Facerecognition';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey:'a5631b3fd6d648ee9b29d320e93cdbb0'
});


class App extends Component {
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input
      ).then (
      function(response){
        
      },
      function(err){

      }
    );
    
  }

  render() {
  return (
    <div className="App">
      <ParticlesBg type='cobweb' bg={true}/>
      <Navigation />
      <Logo />
      <Rank/>
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition imageUrl={this.state.imageUrl}/>

    </div>
  );
}
}
export default App;
