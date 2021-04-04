import { Button, Container, Grid, TextField } from "@material-ui/core";
import { authenticationService } from "../../services/authenticationService"
import logo from "../../logo.png"
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useState } from "react";
import InputMask from "react-input-mask";
import { FaSpinner } from "react-icons/fa";
import settings from "../../settings";
import Message from "./Message";
import adapter from "../../utils/adapter";

export default function Profile() {
    const history = useHistory();
    const currentUser = authenticationService.getCurrentUser();
    const [values, setValues] = useState({
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        userName: currentUser.userName,
        userNameError: "",
        role: currentUser.role,
    });
    const [message, setMessage] = useState({
        message: "",
        messageType: ""
    })
    const [submitting, setSubmitting] = useState(false);    

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        const isValid = validate();

        if (isValid) {
            const url = `${settings.apiRoot}/api/v1/registrationcode/updateUser`;
            const content = {
                id: currentUser.id,
                userName: values.userName,
                phoneNumber: values.phoneNumber
            };

            setSubmitting(true);
            const response = await adapter.Post(url, content);
            setSubmitting(false);

            if (response.ok) {
                setMessage({
                    message: "Profile successfully updated.",
                    messageType: "success"
                });

                authenticationService.updateSessionProfile({
                    userName : values.userName,
                    phoneNumber : values.phoneNumber    
                });

            } else
                if (response.status === 403) {
                    const jsonResponse = await response.json();
                    setMessage({
                        message: jsonResponse.result.description,
                        messageType: "error"
                    });
                }
                else {
                    setMessage({
                        message: "An error occured, please contact your agent.",
                        messageType: "error"
                    });
                }
        }
    };

    const validate = () => {
        let userNameError = "";

        if (!values.userName) {
            userNameError = "Name is required."
        }

        if (values.userName && !/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*.{1,}$/i.test(values.userName)) {
            userNameError = "Name must be at least 2 characters.";
        }

        if (userNameError) {
            setValues({ ...values, userNameError: userNameError });
            return false;
        }

        return true;
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.id]: e.target.value, userNameError: "" })
    }

    const handleHome = () => {
        if (values.role == 'Operator'){
            history.push("/operator")
        }
        if (values.role == 'Agent'){
            history.push("/agent")
        }
        if (values.role == 'Player'){
            history.push("/player")
        }
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <header>
                    <div className="center-content">
                        <Link to="/">
                            <img src={logo} className="app-logo" alt="logo" />
                        </Link>
                    </div>
                </header>
                <Message text={message.message} messageType={message.messageType} />
                <form onSubmit={handleSubmitProfile}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <TextField
                                fullWidth
                                id="emailAddress"
                                type="email"
                                label="Email Address"
                                variant="outlined"
                                className="form-input-style"
                                size='small'
                                style={{ margin: '10px 0px' }}
                                value={values.email}
                                disabled
                            />
                            <TextField
                                onChange={handleChange}
                                error={values.userNameError !== "" ? true : false}
                                fullWidth
                                required
                                id="userName"
                                type="text"
                                label="Name"
                                helperText={values.userNameError}
                                variant="outlined"
                                className="form-input-style"
                                size='small'
                                style={{ margin: '10px 0px' }}
                                value={values.userName}
                            />

                            <InputMask
                                mask="0999-999-9999"
                                value={values.phoneNumber}
                                maskChar=" "
                                onChange={handleChange}>
                                {() => <TextField
                                    size='small'
                                    type="text"
                                    variant="outlined"
                                    className="form-input-style"
                                    style={{ margin: '10px 0px' }}
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                />}
                            </InputMask>
                        </Grid>
                        <Grid item xs={12} md={12} style={{marginTop : '20px', marginBottom :'40px'}}>                            
                            <Button href="#" color="primary" onClick={() => history.push("/reset-password")} fullWidth>
                                Change Password
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={submitting}
                                startIcon={submitting && <FaSpinner className="spinner" />}>
                                {submitting ? "Updating" : "Update"}
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="button"
                                disabled={submitting}
                                onClick={handleHome}>Home
                             </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </div>
    )
}