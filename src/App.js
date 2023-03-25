import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/Facerecognition';
import SignIn from './components/SignIn/SignIn';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';

//Defining the initial state of the application
const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signIn',
    isSignedIn:false,
    user: {
      id:'',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }

class App extends Component {
  constructor(){
    super();
    //Setting the initial state of the app
    this.state= initialState;
  }

// Loading user data from the server and updating the state
  loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  }})
}

  //Calculating the location of the face detected in the image
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // Update the state to display the bounding box around the face
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  // Update the state with the input value as the user types in the image URL
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // Fetch the response from the server and display the face recognition box on the image
  onButtonSubmit = () => {
    // Set the 'imageUrl' state to the value of the 'input' state.
    this.setState({imageUrl: this.state.input});
    
    // Send a fetch request to the 'imageurl' endpoint of the API, passing in the 'input' value as a JSON object.
    fetch('https://smart-brain-api-baed.onrender.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
     // When the response is received, convert it to a JSON object.
    .then(response => response.json())
    // If the response is not empty:
    .then (response => {
        if(response){
          // Send a fetch request to the 'image' endpoint of the API, passing in the 'id' of the current user as a JSON object.
          fetch('https://smart-brain-api-baed.onrender.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          // When the response is received, convert it to a JSON object and update the 'entries' property of the 'user' state.
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }

        // Calculate the location of the face in the image and display a bounding box around it.
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  // This function is triggered when the user changes the route (i.e., clicks on the 'Sign Out' button).
  onRouteChange = (route) => {
    // If the new route is 'signout', reset the state to its initial values.
    if (route === 'signout') {
      this.setState(initialState)
    // If the new route is 'home', set the 'isSignedIn' state to 'true'.
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    // Set the 'route' state to the new route.
    this.setState({route: route});
  }

  // This function renders the app.
  render() {
   const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <ParticlesBg color= 'ffffff' type='cobweb' bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/> 
      <Logo />
      {route === 'home' 
      // If the current route is 'home', display the 'Rank', 'ImageLinkForm', and 'FaceRecognition' components.
        ? <div> 
        <Rank
          name={this.state.user.name}
          entries={this.state.user.entries}
        />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        // If the current route is 'signIn', display the 'SignIn' component. If the current route is 'register', display the 'Register' component.
        :(
          route ==='signIn'
        ? <SignIn loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
        : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
        )
      }
    </div>
  );
}
}
export default App;
