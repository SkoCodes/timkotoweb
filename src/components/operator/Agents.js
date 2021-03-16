import React from 'react';
import Footer from '../common/Footer';
import '../css/Registration.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'

class OperatorAgents extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            agents : []
        };
      }

    async componentWillMount() {
        const url = `${settings.apiRoot}/api/v1/Operator/Agents/10010`;
        const response = await adapter.Get(url);
        if (response.ok)
        {   
            const jsonResponse = await response.json();
            this.setState({agents: jsonResponse.data.agents})
        }
        else if (response.status === 403) {

        }
        else{

        }
    }

    validate = () => {        
        return true;
    }

    render() {
        return (
            <div className="container">
                <header>
                    <div className="center-content">
                        <h3>Agents</h3>
                    </div>
                </header>
                <main>
                    <form>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                </tr>
                            <tbody>
                                {
                                    this.state.agents.map((agent, index) => 
                                        <tr>
                                            <td>{agent.userName}</td>
                                            <td>{agent.email}</td>
                                            <td>{agent.phoneNumber}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            </thead>
                        </table>
                    </form>
                </main>
                <Footer />
            </div>
        );
    }
}

export default OperatorAgents;