import logo from '../../logo.png';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';

function RegistrationSuccess() {
    return (
        <div className="container">
            <header className="center-content">
                <Link to="/">
                    <img src={logo} className="app-logo" alt="logo" />
                </Link>
            </header>
            <main>
                <div className="center-content">
                    <p>Successfull registration you may now sign-in.</p>
                </div>
                <div className="center-content">
                    <p>
                        <Link to="/signin" className="btn btn-primary">Sign-In</Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default RegistrationSuccess;