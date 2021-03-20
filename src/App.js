import './App.css';
import Login from './components/Login';
import Registration from './components/registration/Registration';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import RegistrationSuccess from './components/registration/RegistrationSuccess';
import Player from './components/player/Player';
import OperatorAgents from './components/operator/index';
import ProtectedRoute from './components/common/ProtectedRoute';
import AgentPlayers from './components/agent/AgentPlayers';
import AgentPlayerPoints from './components/agent/AgetPlayerPoints';
import Footer from './components/common/Footer'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/register/:code" exact component={Registration} />
          <Route path="/registersuccess" exact component={RegistrationSuccess} />

          <ProtectedRoute path="/agent" exact component={AgentPlayers} roles={["Agent"]} />
          <ProtectedRoute path="/agent/players" exact component={AgentPlayers} roles={["Agent"]} />
          <ProtectedRoute path="/agent/player/points" exact component={AgentPlayerPoints} roles={["Agent"]} />

          <ProtectedRoute path="/player" exact component={Player} roles={["Player"]} />
          
          <ProtectedRoute path="/operator" exact component={OperatorAgents} roles={["Operator"]} />

          <Footer />
        </Switch>
      </Router>
    )

  }
}

export default App;
