import React, {Component} from 'react';
import axios from 'axios';
import {Route} from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

import classes from './Failure.module.css';
import Logo from '../../assets/images/Failure.png';
import Spinner from '../../components/Spinner/Spinner';
import {initGA, PageView, Event} from '../../components/Tracking/Tracking';

class Failure extends Component {
    state = {
        loading: false,
        redirect: false
    };

    componentDidMount () {
        initGA();
        PageView('/Failure');
        Event('Failure', 'Payment Failure', 'User redirected to /Failure');

        const options = {
            autoConfig: true, 	// set pixel's autoConfig
            debug: false, 		// enable logs
        };

        ReactPixel.init('875791426252291', options);
        ReactPixel.pageView();
        ReactPixel.fbq('trackCustom', '/Failure');
    }
    
    tryAgainHandler = async (id) => {
        let userData = null;
        this.setState({loading: true});
        
        await axios.post('https://us-central1-resume-easy-60ea0.cloudfunctions.net/ResumeFunc/retry', {requestId: id})
            .then(async response => {
                console.log(response.data);
                // await this.setState({ link: response.data});
                userData = response.data;

                await axios.post('https://us-central1-resume-easy-60ea0.cloudfunctions.net/ResumeFunc/backend', userData)
                    .then(async response => {
                        console.log(response.data);
                        await this.setState({ link: response.data, loading: false, redirect: true });
                    })
                    .catch(err => console.log(err));

                console.log(userData);
                }
            )
            .catch(err => console.log(err));
    }

        // await axios.post('https://us-central1-resume-easy-testing.cloudfunctions.net/ResumeFunc/backend', userData)
        //     .then(async response => {
        //         console.log(response.data);
        //         await this.setState({ link: response.data, loading: false, redirect: true });
        //     })
        //     .catch(err => console.log(err));

    
    render() {
        let display = (
            <div className={classes.Main}>
                <div className={classes.Whole}>
                    <img src={Logo} alt="Failure" className={classes.Red}/>
                    <p>Payment failed</p>
                    <button onClick={() => {
                        this.tryAgainHandler(this.props.location.state.requestId);
                        Event('Try Again', 'Retrying Payment', 'Retrying Payment in /Failure');
                        ReactPixel.fbq('trackCustom', 'Try Again button  clicked');
                        }}>Try Again</button>
                </div>
            </div>
        );

        if(this.state.loading) {
            display = (
                <Spinner />
            );
        }

        if(this.state.redirect) {
            display = (
                <Route path='/' component={() => { 
                    window.location.href = this.state.link; 
                    return null;
               }}/>
            );
        }
        
        return (
            <>
                {display}
            </>
        );
    }
}
export default Failure;