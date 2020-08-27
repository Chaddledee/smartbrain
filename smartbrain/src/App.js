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

const initialState = {
  input:'',
  imageUrl: '',
  boxes: [],
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

class App extends React.Component {
  constructor() {
    super();
    this.state={
      input:'',
      imageUrl: '',
      boxes: [],
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
          joined: data.joined,

        }})
  }

  calcFaceLoc = (data) => {
    console.log(data);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    let boxes = [];
    data.outputs[0].data.regions.forEach(region => {
      let clarFace = region.region_info.bounding_box;
      boxes.push({
        leftCol: clarFace.left_col * width,
        topRow: clarFace.top_row * height,
        rightCol: width - (clarFace.right_col * width),
        bottomRow: height - (clarFace.bottom_row * height)
      });
    })
    return boxes;
  }

  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({
      boxes: boxes
    })
    console.log(this.state.boxes);
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}, () => {
      fetch('https://ancient-tundra-36359.herokuapp.com/image', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.imageUrl
        })
      })
      .then(res => res.json())
      .then(response => {
        if (response) {
          fetch('https://ancient-tundra-36359.herokuapp.com/image', {
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
          .catch(console.log)
        }
        this.displayFaceBox(this.calcFaceLoc(response))
      })
      .catch(err => console.log(err));
    })
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
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
              <FaceRecog boxes={this.state.boxes} imageUrl={this.state.imageUrl}/>
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