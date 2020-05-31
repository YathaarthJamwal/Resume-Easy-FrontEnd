import React, {Component} from 'react';

import classes from './Success.module.css';
import Logo from '../../assets/images/Success.png';
import Face from '../../assets/images/MaskGroup.png';
import {initGA, PageView, Event} from '../../components/Tracking/Tracking';
import ReactPixel from 'react-facebook-pixel';

class success extends Component {
    componentDidMount () {
        initGA();
        PageView('/Success');
        Event('Success', 'Payment Success', 'User redirected to /Success');

        const options = {
            autoConfig: true, 	// set pixel's autoConfig
            debug: false, 		// enable logs
        };

        ReactPixel.init('875791426252291', options);
        ReactPixel.pageView();
        ReactPixel.fbq('trackCustom', '/Success');

        localStorage.removeItem('data');
    }
    
    render() {
        return (
            <div className={classes.Main}>
                <div className={classes.Whole}>
                    <img src={Logo} alt ="Success" className={classes.Green}/>
                    <p className={classes.Success}>Payment Received</p>
                    <p className={classes.IIT}>An IITian is working on your resume</p>
                    <img src={Face} alt="Pic" className={classes.Face}/>
                    <p className={classes.Name}>Ashris Choudhary</p>
                    <p className={classes.College}>IIT Kharagpur, Batch of 2016</p>
                    <hr className={classes.Line}/>
                    <p className={classes.SMS}>We will send an SMS to your number when your resume is ready</p>
                    <p className={classes.Time}>This may take upto 2 days</p>
                    <a onClick={() => Event('Navigation', 'Contact Whatsapp', 'Contact Whatsapp in /Success')} href="https://wa.me/919001127731" className={classes.Whatsapp}>Contact us on Whatsapp</a>
                </div>
            </div>
        );
    }
}
export default success;