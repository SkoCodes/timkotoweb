import { authenticationService } from "../../services/authenticationService"
import Navbar from "../common/Navbar";

export default function PlayerContestResult(){
    const currentUser = authenticationService.getCurrentUser();

    return(
        <div>
            <Navbar userType={currentUser.role} title="Contest Result" />
            Player contest result goes here.
        </div>
    )
}