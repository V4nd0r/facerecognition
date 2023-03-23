import React from "react";

class Register extends React.Component {
    // Constructor function that sets the initial state of the component
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name:''
        }
    }

    // Event handler function to update the "name" state when the input changes
    onNameChange = (event) => {
        this.setState({name:event.target.value})
    }

    // Event handler function to update the "email" state when the input changes
    onEmailChange = (event) => {
        this.setState({email:event.target.value})
    }

    // Event handler function to update the "password" state when the input changes
    onPasswordChange = (event) => {
        this.setState({password:event.target.value})
    }


    // Event handler function for the submit button that makes a POST request to the server
    onSubmitSignIn = () => {
        fetch('https://smart-brain-api-baed.onrender.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
        .then(response => response.json())
        .then(user => {
            // If the server returns a valid user ID, load the user data and switch to the home page
            if (user.id) {
                this.props.loadUser(user)
                this.props.onRouteChange('home');
            }
        })
    }

    // Render method that returns the JSX code to create the registration form
    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f2 fw6 ph0 mh0">Register</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input 
                            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="text" 
                            name="name"  
                            id="name"
                            onChange={this.onNameChange}    
                        />
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input 
                            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" 
                            name="email-address"  
                            id="email-address"
                            onChange={this.onEmailChange}
                        />
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input 
                            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="password" 
                            name="password"  
                            id="password"
                            onChange={this.onPasswordChange}
                         />
                    </div>
                    </fieldset>
                    <div className="">
                    <input 
                        onClick={this.onSubmitSignIn}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Register me!"
                        />
                    </div>

                </div>
            </main>
        </article>    
    );
}
}

export default Register;