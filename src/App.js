
import './App.css';
import Home from './components/Home';
import Registration from './components/registration/Registration';
import Signin from './components/Signin';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import RegistrationSuccess from './components/RegistrationSuccess';

function App() {
    return (    
      <Router>
           <Route path="/" exact component={Home}/>
           <Route path="/registersuccess" exact component={RegistrationSuccess}/>   
           <Route path="/register" exact component={Registration}/>                              
           <Route path="/signin" exact component={Signin}/>     
      </Router>    
  );
}

export default App;
