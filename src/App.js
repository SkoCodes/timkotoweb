
import './App.css';
import Home from './components/Home';
import Registration from './components/registration/Registration';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import RegistrationSuccess from './components/registration/RegistrationSuccess';
import Player from './components/player/Player'

function App() { 
  return (    
      <Router>
           <Route path="/" exact component={Home}/>
           <Route path="/register/:code" exact component={Registration}/>           
           <Route path="/registersuccess" exact component={RegistrationSuccess}/>                      
           <Route path="/player" exact component={Player}/>     
      </Router>    
  );
}

export default App;
