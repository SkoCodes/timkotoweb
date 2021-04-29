import logo from '../../logo.png';
import { Button, Container, Grid, makeStyles } from "@material-ui/core";

function RegistrationSuccess() {
    return (
        
        <div style={{width:'100%'}}>
            <Container maxWidth="xs" >
                <Grid container className="container-style">
                    <Grid item xs={12} md={12} style={{textAlign:'center'}}>
                        <img src={logo} className="app-logo" alt="logo" />
                    </Grid>
                </Grid>
                <Grid container className="container-style">
                    <div className="center-content">
                    Registration succeeded. An activation email from Timkoto has been sent to your email, please follow the instruction in the email to activate your account.
                    </div>
                    
                </Grid>
            </Container>
        </div>

    );
}

export default RegistrationSuccess;