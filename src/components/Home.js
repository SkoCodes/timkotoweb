import logo from '../logo.png';
import Footer from './common/Footer';
import {Link} from 'react-router-dom';

function Home(){        
    return(
        <div>
            <header className="app-header">
                <img src={logo} className="app-logo" alt="logo" />
            </header>
            <main className="center-content">
                <Link to="/signin" className="btn btn-primary mr-4">Sign-in</Link>                
                <Link to="/register"className="btn btn-secondary">Register</Link>                
            </main>
            <Footer/>
      </div>
    );
}

export default Home;