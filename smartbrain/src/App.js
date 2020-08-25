import React from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecog from './Components/FaceRecog/FaceRecog';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const particleOptions = {
  "particles": {
      "number": {
          "value": 75,
          density: {
            enable: true,
            value_area: 800
          }
      },
      "size": {
          "value": 3
      }
  }
}

const clarApp = new Clarifai.App({
  apiKey: '1461e82e9e6d49fba3ad268ccfe425ab'
})

class App extends React.Component {
  constructor() {
    super();
    this.state={
      input:'',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }})
  }

  calcFaceLoc = (data) => {
    console.log(data);
    const clarFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarFace.left_col * width,
      topRow: clarFace.top_row * height,
      rightCol: width - (clarFace.right_col * width),
      bottomRow: height - (clarFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log('click');
    this.setState({imageUrl: this.state.input}, () => {
    console.log('click2');
      clarApp.models.predict(
        "a403429f2ddf4b49b307e318f00e528b", 
        this.state.imageUrl)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox(this.calcFaceLoc(response))
      })
      .catch(err => console.log(err));
    })
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions} 
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        <Logo />
        { this.state.route === 'home' 
        ?   <div>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecog box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
        : (
            ( this.state.route === 'signin' || this.state.route === 'signout' )
            ? <Signin onRouteChange={this.onRouteChange}  loadUser={this.loadUser}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          ) 
      }
      </div>
    );
  }
}

export default App;

// https://i.ytimg.com/vi/igkKs9O5wPg/maxresdefault.jpg