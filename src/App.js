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
import AgentPlayerPoints from './components/agent/AgentPlayerPoints';
import Footer from './components/common/Footer'
import OperatorAgenPoints from './components/operator/AgentPoints'
import RegistrationLink from './components/operator/RegistrationLink'
import AgentContestPlayers from './components/agent/AgentContestPlayers';
import ContestsPage from './components/operator/Contests';
import CreateTeam from './components/player/CreateTeam';
import PlayerContest from './components/player/PlayerContest';
import PlayerTeamHistory from './components/player/PlayerTeamHistory';

class App extends React.Component {
  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/register/:code" exact component={Registration} />
          <Route path="/registersuccess" exact component={RegistrationSuccess} />

          <ProtectedRoute path="/agent" exact component={AgentPlayers} roles={["Agent"]} />
          <ProtectedRoute path="/agent/players" exact component={AgentPlayers} roles={["Agent"]} />
          <ProtectedRoute path="/agent/player-points/:id" exact component={AgentPlayerPoints} roles={["Agent"]} />
          <ProtectedRoute path="/agent/contest/players" exact component={AgentContestPlayers} roles={["Agent"]}/>
          <ProtectedRoute path="/player" exact component={Player} roles={["Player"]}/>
          <ProtectedRoute path="/player/create-team" exact component={CreateTeam} roles={["Player"]} />
          <ProtectedRoute path="/player/contest" exact component={PlayerContest} roles={["Player"]}/>
          <ProtectedRoute path="/player/teamhistory" exact component={PlayerTeamHistory} roles={["Player"]}/>
          <ProtectedRoute path="/operator" exact component={OperatorAgents} roles={["Operator"]} />
          <ProtectedRoute path="/operator/contests" exact component={ContestsPage} roles={["Operator"]} />
          <ProtectedRoute path="/operator/registration-link" exact component={RegistrationLink} roles={["Operator", "Agent"]} />
          <ProtectedRoute path="/operator/agent-points/:id" exact component={OperatorAgenPoints} roles={["Operator"]} />
        </Switch>
      </Router>
      <Footer />
      </div>
    )

  }
}

export default App;
