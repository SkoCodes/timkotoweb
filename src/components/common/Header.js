//this is the common header for all the pages
import {Link} from 'react-router-dom';

function Header(props){
    return(
        <div>
            <div className="header-menu">
                Timokoto web header
                <Link to="/">Sign In</Link>                    
                <Link to="/register">Register</Link>
            </div>
            <div>
                {props.children}
            </div>
        </div>        
    )
}

export default Header;