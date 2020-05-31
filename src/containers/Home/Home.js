import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import classes from './Home.module.css';
import Image from '../../assets/images/ResumeDesign.png';
import {initGA, PageView, Event} from "../../components/Tracking/Tracking";
import ReactPixel from 'react-facebook-pixel';

class Home extends Component {
    componentDidMount() {
        initGA();
        PageView('/Home');

        const options = {
            autoConfig: true, 	// set pixel's autoConfig
            debug: false, 		// enable logs
        };

        ReactPixel.init('875791426252291', options);
        ReactPixel.pageView('/Home');
        ReactPixel.fbq('trackCustom', '/Home');
    }

    render () {
        return (
            <div className={classes.Whole}>
                <div className={classes.Top}>
                    <p className={classes.Logo}>Resume <strong className={classes.Easy}>Easy</strong></p>
                </div>
                <img src={Image} alt="Resume Design" className={classes.Image}/>
                <div className={classes.TextArea}>
                    <p className={classes.TopText}>CV/Resume made by IITians</p>
                    <p className={classes.MidText}>Call Centre, Data entry, Receptionist & more</p>
                    <p className={classes.BottomText}>For ₹150 only</p>
                </div>
                <div className={classes.Bottom}>
                </div>
                <NavLink to="/Form"><button className={classes.Button} onClick={() => Event('Navigation', 'Create Resume Now', 'Moved to /Form')}>Get resume now</button></NavLink><br/>
                <a className={classes.Whatsapp} onClick={() => {
                        Event('Navigation', 'Contact Whatsapp', 'Contact on Whatsapp from /Home');
                        ReactPixel.fbq('trackCustom', 'Button to form clicked');
                    }} href="https://wa.me/919001127731" alt="Whatsapp Link"><p>Contact us on Whatsapp</p></a>
            </div>
        );
    }
}

export default Home;