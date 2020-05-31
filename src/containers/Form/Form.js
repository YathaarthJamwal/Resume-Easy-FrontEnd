import React, {Component} from 'react';
import axios from 'axios';
import {Route} from 'react-router-dom';
// import Select from 'react-select';
import ReactPixel from 'react-facebook-pixel';

import classes from './Form.module.css';
import Spinner from '../../components/Spinner/Spinner';
import {initGA, PageView, Event} from '../../components/Tracking/Tracking';

class Form extends Component {
    state = {
        redirect: false,
        loading: false,
        link: null,
        class10: false,
        class12: false,
        college: false,
        training: false,
        jobKindValid: false,
        work: 1,
        userData: {
            jobKind: {
                callCentre: false,
                dataEntry: false,
                receptionist: false,
                sales: false,
                cashier: false,
                other: false
            },
            name: null,
            age: null,
            income: null,
            email: null,
            phone: '',
            // city: null,
            // postal: null,
            state: null,
            collegeName: null,
            collegeCourse: null,
            collegeGrade: null,
            collegeGrad: null,
            schoolName12: null,
            schoolGrade12: null,
            schoolEnd12: null,
            schoolCity12: null,
            schoolName10: null,
            schoolGrade10: null,
            schoolCity10: null,
            schoolEnd10: null,
            languages: [null],
            softwares: null,
            hobbies: null,
            awards: null,
            training: null,
            jobs: [
                {
                    company: null,
                    jobDesig: null,
                    jobStart: null,
                    jobEnd: null,
                    jobDesc: null
                }
            ],
            smsSent: false
        }
      };

    componentDidMount() {
        initGA();
        PageView('/Form');

        const options = {
            autoConfig: true, 	// set pixel's autoConfig
            debug: false, 		// enable logs
        };

        ReactPixel.init('875791426252291', options);
        ReactPixel.pageView();
        ReactPixel.fbq('trackCustom', '/Form');

        let stateData = localStorage.getItem('data');
        stateData = JSON.parse(stateData);
        console.log(stateData);
        this.setState(stateData);

        console.log(this.state);
    }
    componentDidUpdate() {
        console.log(this.state);
    }

    showHandler = (e) => {
        const id = e.target.name;
        const value = e.target.value;

        if(value==="yes")
            this.setState({[id]: true});
        else
            this.setState({[id]: false});
    }

    changeHandler = (e) => {
        const id = e.target.name;
        const value = e.target.value;

        let newUserData = {
        ...this.state.userData
        };

        newUserData[id] = value;
        
        console.log(newUserData);

        this.setState({userData: newUserData});
    }

    workChangeHandler = (e, i) => {
        const id = e.target.name;
        const value = e.target.value;

        let data = {...this.state.userData};

        data.jobs[i][id] = value;

        this.setState({userData: data});
    }

    langChangeHandler = (e,i) => {
        let newUserData = {...this.state.userData};
        newUserData.languages.splice(i, 1, e.target.value);
        this.setState({userData: newUserData});
    }

    submitHandler = async (e) => {
        e.preventDefault();
        
        if(this.state.jobKindValid) {
            // store.setState('data', this.state);
            localStorage.setItem('data', JSON.stringify(this.state));
            
            this.setState({loading: true});
            e.preventDefault();
            console.log(this.state.userData);

            const data = {
                ...this.state.userData,
                amount: '150.00',
                purpose: 'resume-easy'
            };

            await this.getLink(data);
            // https://us-central1-resume-easy-testing.cloudfunctions.net/ResumeFunc
            // this.setState({redirect: true, link: 'https://stackoverflow.com/questions/45089386/what-is-the-best-way-to-redirect-a-page-using-react-router'});
        } else {
            alert('Select at least 1 checkbox for first question!');
        }
        
    }

    addWorkHandler = (e) => {
        e.preventDefault();
        let newUserData = {...this.state.userData};

        const newJobData = {
            company: null,
            jobDesig: null,
            jobStart: null,
            jobEnd: null,
            jobDesc: null
        };

        newUserData.jobs.push(newJobData);

        this.setState({userData: newUserData, work: this.state.work + 1});
    }

    deleteWorkHandler = (e, i) => {
        e.preventDefault();
        let newUserData = {...this.state.userData};

        newUserData.jobs.splice(i, 1);

        this.setState({userData: newUserData, work: this.state.work - 1});
    }

    addLangHandler = (e) => {
        e.preventDefault();
        let newUserData = {...this.state.userData};

        newUserData.languages.push(null);

        this.setState({userData: newUserData});
    }

    // jobHandler = (e) => {
    //     let data = this.state.userData;
    //     console.log(e);
    //     let i = 0;

    //     for (let el of e) {
    //         data.jobKind[i] = el.value;
    //         i++;
    //     }
    //     console.log(data);
    //     this.setState({userData: data});
    // }

    checkBoxHandler = (e) => {
        const id = e.target.value;
        console.log(e.target.value);

        let data = {...this.state.userData};
        data.jobKind[id] = !data.jobKind[id];
        let valid = false;

        for (let el in data.jobKind) {
            if(data.jobKind[el]) {
                valid = true;
            }
        }

        this.setState({userData: data, jobKindValid: valid});
    }

    // stateHandler = (e) => {
    //     let data = {...this.state.userData};
    //     console.log(e);
    //     data.state = e.value;

    //     this.setState({userData: data});
    // }

    // courseHandler = (e) => {
    //     let data = {...this.state.userData};
    //     console.log(e);
    //     data.collegeCourse= e.value;

    //     this.setState({userData: data});
    // }

    // https://us-central1-resume-easy-60ea0.cloudfunctions.net/ResumeFunc/backend

    getLink = async (data) => {
        await axios.post('https://us-central1-resume-easy-60ea0.cloudfunctions.net/ResumeFunc/backend', data)
            .then(async response => {
                console.log(response.data);
                await this.setState({ link: response.data, redirect: true, loading: false });
            })
            .catch(err => console.log(err));
    }

    render () {
        // const optionsLang = [
        //     { value: 'Hindi', label: 'Hindi' },
        //     { value: 'English', label: 'English' },
        //     { value: 'Bengali', label: 'Bengali' },
        //     { value: 'Marathi', label: 'Marathi' },
        //     { value: 'Telegu', label: 'Telegu' },
        //     { value: 'Tamil', label: 'Tamil' },
        //     { value: 'Gujrati', label: 'Gujrati' },
        //     { value: 'Urdu', label: 'Urdu' },
        //     { value: 'Kannada', label: 'Kannada' },
        //     { value: 'Assamese', label: 'Assamese' },
        //     { value: 'Odia', label: 'Odia' },
        //     { value: 'Malayalam', label: 'Malayalam' },
        //     { value: 'Punjabi', label: 'Punjabi' },
        //     { value: 'Bhili/Bhilodi', label: 'Bhili/Bhilodi' },
        //     { value: 'Bodo', label: 'Bodo' },
        //     { value: 'Dogri', label: 'Dogri' },
        //     { value: 'Garo', label: 'Garo' },
        //     { value: 'Gondi', label: 'Gondi' },
        //     { value: 'Ho', label: 'Ho' },
        //     { value: 'Kashmiri', label: 'Kashmiri' },
        //     { value: 'Khandeshi', label: 'Khandeshi' },
        //     { value: 'Khasi', label: 'Khasi' },
        //     { value: 'Konkani', label: 'Konkani' },
        //     { value: 'Kurukh', label: 'Kurukh' },
        //     { value: 'Maithili', label: 'Maithili' },
        //     { value: 'Meitei (Manipuri)', label: 'Meitei (Manipuri)' },
        //     { value: 'Mundari', label: 'Mundari' },
        //     { value: 'Nepali', label: 'Nepali' },
        //     { value: 'Sanskrit', label: 'Sanskrit' },
        //     { value: 'Santali', label: 'Santali' },
        //     { value: 'Sindhi', label: 'Sindhi' },
        //     { value: 'Tripuri', label: 'Tripuri' },
        //     { value: 'Tulu', label: 'Tulu' }
        //   ];
        
        // const optionsState = [
        //     {value: "Andhra Pradesh", label: "Andhra Pradesh"},
        //     {value:"Andaman and Nicobar Islands" ,label: "Andaman and Nicobar Islands"},
        //     {value: "Arunachal Pradesh", label: "Arunachal Pradesh"},
        //     {value: "Assam", label: "Assam"},
        //     {value: "Bihar", label: "Bihar"},
        //     {value: "Chandigarh", label: "Chandigarh"},
        //     {value: "Chhattisgarh", label: "Chhattisgarh"},
        //     {value: "Dadar and Nagar Haveli", label: "Dadar and Nagar Haveli"},
        //     {value: "Daman and Diu", label: "Daman and Diu"},
        //     {value: "Delhi", label: "Delhi"},
        //     {value: "Lakshadweep", label: "Lakshadweep"},
        //     {value:"Puducherry", label: "Puducherry"},
        //     {value: "Goa", label: "Goa"},
        //     {value: "Gujarat", label: "Gujarat"},
        //     {value: "Haryana", label: "Haryana"},
        //     {value: "Himachal Pradesh", label: "Himachal Pradesh"},
        //     {value: "Jammu and Kashmir", label: "Jammu and Kashmir"},
        //     {value: "Jharkhand", label: "Jharkhand"},
        //     {value: "Karnataka", label: "Karnataka"},
        //     {value: "Madhya Pradesh", label: "Madhya Pradesh"},
        //     {value: "Maharashtra", label: "Maharashtra"},
        //     {value: "Manipur", label: "Manipur"},
        //     {value: "Meghalaya", label: "Meghalaya"},
        //     {value: "Mizoram", label: "Mizoram"},
        //     {value: "Nagaland", label: "Nagaland"},
        //     {value: "Odisha", label: "Odisha"},
        //     {value: "Punjab", label: "Punjab"},
        //     {value: "Rajasthan", label: "Rajasthan"},
        //     {value: "Sikkim", label: "Sikkim"},
        //     {value: "Tamil Nadu", label: "Tamil Nadu"},
        //     {value: "Telangana", label: "Telangana"},
        //     {value: "Tripura", label: "Tripura"},
        //     {value: "Uttar Pradesh", label: "Uttar Pradesh"},
        //     {value: "Uttarakhand", label: "Uttarakhand"},
        //     {value: "West Bengal", label: "West Bengal"}
        // ];

        // const optionsCourse = [
        //     {value: "General", label: "General"},
        //     {value: "arts", label: "Arts"},
        //     {value: "Engineering or Science", label: "Engineering or Science"},
        //     {value: "Law", label: "Law"},
        //     {value: "Commerce", label: "Commerce"},
        //     {value: "Medical", label: "Medical"},
        //     {value: "Other", label: "Other"}
        // ];


        // const customStyles = {
        //     option: (provided, state) => ({
        //         ...provided,
        //         border: '1px solid #e0e0e0',
        //         color: state.isSelected ? 'black' : 'gray'
        //      }),
        //     control: (provided, state) => ({
        //     // none of react-select's styles are passed to <Control />
        //         ...provided,
        //         height: 30,
        //         color: state.isSelected ? '#e0e0e0' : 'white',
        //         borderTop: 'none',
        //         borderLeft: 'none',
        //         borderRight: 'none',
        //         borderRadius: 0,
        //         borderColor: '#e0e0e0'

        //     }),
        //     container: (provided, state) => ({
        //         ...provided,
        //         display:'inline-block',
        //         height: 30,
        //         width: '90%',
        //         color: state.isSelected ? '#e0e0e0' : 'white',
        //         marginLeft: '5%',
        //         marginBottom: 30,
        //         borderTop: 'none',
        //         marginTop: 20
        //     }),
        //     valueContainer: (base) => ({
        //         ...base,
        //         height: 25
        //     }),
        //     singleValue: (provided, state) => {
        //         const opacity = state.isDisabled ? 0.5 : 1;
        //         const transition = 'opacity 300ms';

        //         return { ...provided, opacity, transition };
        //     }
        // }

        let displayWork = this.state.userData.jobs.map((jobData, i) => (
            <>
                <legend>Work details {i+1}</legend>
                {this.state.work >=2 && i >= 1 ? (<div>
                    <div>
                        <button onClick={(event) => this.deleteWorkHandler(event, i)}>X</button>
                    </div>
                </div>) : null}
                <label >Company Name</label><br/>
                <input type="text" name="company" onChange={(event) => this.workChangeHandler(event, i)} value={this.state.userData.jobs[i].company}/><br/>
                <label >Designation</label><br/>
                <input type="text" name="jobDesig" placeholder="e.g.: Manager, Assistant, Supervisor" onChange={(event) => this.workChangeHandler(event, i)} value={this.state.userData.jobs[i].jobDesig}/><br/>
                <label >Job Start Date</label><br/>
                <input type="month" name="jobStart" onChange={(event) => this.workChangeHandler(event, i)} value={this.state.userData.jobs[i].jobStart}/><br/>
                <label >Job End Date</label><br/>
                <input type="month" name="jobEnd" onChange={(event) => this.workChangeHandler(event, i)} value={this.state.userData.jobs[i].jobEnd}/><br/>
                <label >Job Description</label><br/>
                <textarea name="jobDesc" placeholder="Provide details of your work in this company" onChange={(event) => this.workChangeHandler(event, i)} value={this.state.userData.jobs[i].jobDesc}/><br/>
            </>
        ));

        let displayLang = this.state.userData.languages.map((lang, i) => (
            <>
                <label>Language {i+1} <i>*</i></label> <br/>
                {/* <Select options={optionsLang} placeholder="Choose a language" styles={customStyles} onChange={(event) => this.langChangeHandler(event, i)}/> */}
                <select name="languages" onChange={(event) => this.langChangeHandler(event, i)} required value={this.state.userData.languages[i]}>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Telegu">Telegu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Gujrati">Gujrati</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Assamese">Assamese</option>
                    <option value="Odia">Odia</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Bhili/Bhilodi">Bhili/Bhilodi</option>
                    <option value="Bodo">Bodo</option>
                    <option value="Dogri">Dogri</option>
                    <option value="Garo">Garo</option>
                    <option value="Gondi">Gondi</option>
                    <option value="Ho">Ho</option>
                    <option value="Kashmiri">Kashmiri</option>
                    <option value="Khandeshi">Khandeshi</option>
                    <option value="Khasi">Khasi</option>
                    <option value="Konkani">Konkani</option>
                    <option value="Kurukh">Kurukh</option>
                    <option value="Maithili">Maithili</option>
                    <option value="Meitei (Manipuri)">Meitei (Manipuri)</option>
                    <option value="Mundari">Mundari</option>
                    <option value="Nepali">Nepali</option>
                    <option value="Sanskrit">Sanskrit</option>
                    <option value="Santali">Santali</option>
                    <option value="Sindhi">Sindhi</option>
                    <option value="Tripuri">Tripuri</option>
                    <option value="Tulu">Tulu</option>
                </select> <br/>
            </>
        ));

        let class10 = (
           <>
            <legend>Class 10 details:</legend>
            <label >School Name <i>*</i></label><br/>
            <input type="text" name="schoolName10" onChange={this.changeHandler} required value={this.state.userData.schoolName10}/> <br/>
            <label >School City <i>*</i></label><br/>
            <input type="text" name="schoolCity10" onChange={this.changeHandler} required value={this.state.userData.schoolCity10}/> <br/>
            <label >Percentage <i>*</i></label><br/>
            <input type="text" name="schoolGrade10" onChange={this.changeHandler} required value={this.state.userData.schoolGrade10}/> <br/>
            <label >Passing year <i>*</i></label><br/>
            <input type="number" name="schoolEnd10" placeholder="e.g.: 1990" pattern="[0-9]{4}" onChange={this.changeHandler} required value={this.state.userData.schoolEnd10}/> <br/>
           </>
        );
        if(!this.state.class10) {
            class10 = null;
        }


        let class12 = (
            <>
            <legend>Class 12 details:</legend>
            <label >School Name <i>*</i></label><br/>
            <input type="text" name="schoolName12" onChange={this.changeHandler} required value={this.state.userData.schoolName12}/> <br/>
            <label >School City <i>*</i></label><br/>
            <input type="text" name="schoolCity12" onChange={this.changeHandler} required value={this.state.userData.schoolCity12}/> <br/>
            <label >Percentage <i>*</i></label><br/>
            <input type="text" name="schoolGrade12" onChange={this.changeHandler} required value={this.state.userData.schoolGrade12}/> <br/>
            <label >Passing year <i>*</i></label><br/>
            <input type="number" name="schoolEnd12" placeholder="e.g.: 1990" pattern="[0-9]{4}" onChange={this.changeHandler} required value={this.state.userData.schoolEnd12}/> <br/>
            </>
        );
        if(!this.state.class12) {
            class12 = null;
        }


        let college = (
            <>
            <legend>College details:</legend>
            <label >College Name: <i>*</i></label><br/>
            <input type="text" name="collegeName" onChange={this.changeHandler} required value={this.state.userData.collegeName}/> <br/>
            <label >Course Name:</label><br/>
            <select name="collegeCourse" onChange={this.changeHandler} required value={this.state.userData.collegeCourse}>
                <option value="General">General</option>
                <option value="Arts">Arts</option>
                <option value="Engineering or Science">Engineering or Science</option>
                <option value="Law">Law</option>
                <option value="Commerce">Commerce</option>
                <option value="Medical">Medical</option>
                <option value="Other">Other</option>
            </select><br/>
            {/* <Select options={optionsCourse} placeholder="Choose a course" styles={customStyles} onChange={this.courseHandler}/> */}
            <label >Percentage/CGPA <i>*</i></label><br/>
            <input type="text" name="collegeGrade" onChange={this.changeHandler} placeholder="e.g: 92%, A, B" required value={this.state.userData.collegeGrade}/> <br/>
            <label >Graduation Year <i>*</i></label><br/>
            <input type="number" pattern="[0-9]{4}" name="collegeGrad" onChange={this.changeHandler} required placeholder="e.g.: 1990" value={this.state.userData.collegeGrad}/> <br/>
            </>
        );
        if(!this.state.college) {
            college = null;
        }

        let training = (
            <>
                <label>Please provide details of training/workshop: <i>*</i></label><br/>
                <textarea name="training" onChange={this.changeHandler} required value={this.state.userData.training}/> <br/>
            </>
        );
        if(!this.state.training) {
            training= null;
        }



        let display = (
            <div className={classes.Whole}>
                <div className={classes.Header}>
                    <p className={classes.Heading}>Your resume details</p>
                    <hr className={classes.HeadLine}/>
                </div>
                <form className={classes.Form} onSubmit={this.submitHandler}>

                    <label>What job are you looking for? <i>*</i></label> <br/>
                    {/* <select name="typeOfJob" onChange={this.changeHandler} multiple required>
                        <option value="Call centre">Call centre</option>
                        <option value="Data entry">Data entry</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Sales">Sales</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Other">Other</option>
                    </select> <br/> */}
                    <div>
                        <input type="checkbox" name="callCentre" value="callCentre" checked={this.state.userData.jobKind.callCentre} chec onChange={this.checkBoxHandler}/> <label>Call Centre</label>
                        <input type="checkbox" name="dataEntry" value="dataEntry" checked={this.state.userData.jobKind.dataEntry} onChange={this.checkBoxHandler}/><label>Data Entry</label>
                        <input type="checkbox" name="receptionist" value="receptionist" checked={this.state.userData.jobKind.receptionist} onChange={this.checkBoxHandler}/><label>Receptionist</label> <br/>
                        <input type="checkbox" name="sales" value="sales" checked={this.state.userData.jobKind.sales} onChange={this.checkBoxHandler}/><label>Sales</label>
                        <input type="checkbox" name="cashier" value="cashier" checked={this.state.userData.jobKind.cashier} onChange={this.checkBoxHandler}/><label>Cashier</label>
                        <input type="checkbox" name="other" value="other" checked={this.state.userData.jobKind.other} onChange={this.checkBoxHandler}/><label>Other</label> <br/>
                    </div>
                    {/* <Select options={options} styles={customStyles} isMulti onChange={this.jobHandler}/> */}

                    <legend>Personal details</legend>
                    <label>Name <i>*</i></label> <br/>
                    <input type="text" name="name" required onChange={this.changeHandler} value={this.state.userData.name}/><br/>
                    <label >Age <i>*</i></label> <br/>
                    <input type="number" placeholder="e.g.: 27" name="age" min="1" max="100" required onChange={this.changeHandler} value={this.state.userData.age}/> <br/>
                    {/* <label >How much is your monthly household income?</label> <br/>
                    <select name="income" onChange={this.changeHandler}>
                        <option value="0-20000">0-20,000</option>
                        <option value="20001-50000">20,001-50,000</option>
                        <option value="50000-100000">50,001-1,00,000</option>
                        <option value="100000+">1,00,000+</option>
                    </select> <br/> */}
                    <label >Email</label><br/>
                    <input type="email" placeholder="name@example.com" name="email" onChange={this.changeHandler} value={this.state.userData.email}/> <br/>
                    <label >Phone no. (Enter only 10 digit phone number) <i>*</i></label><br/>
                    <b>+91</b><input type="tel" name="phone" onChange={this.changeHandler} pattern="[0-9]{10}" placeholder="Example: 987643210" required value={this.state.userData.phone}/> <br/>
                    {/* <label >City:</label><br/>
                    <input type="text" name="city" onChange={this.changeHandler} required/> <br/>
                    <label >Postal Code/Pin Code (6 digits)</label><br/>
                    <input type="text" name="postal" onChange={this.changeHandler} pattern="[0-9]{6}" required/> <br/> */}
                    <label>State: <i>*</i></label>
                    <select name="state" onChange={this.changeHandler} required value={this.state.userData.state}>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                    </select> <br/>
                    {/* <Select options={optionsState} value={this.state.userData.state} placeholder="Select a state" styles={customStyles} onChange={this.stateHandler}/> */}

                    {displayWork}

                    <button onClick={this.addWorkHandler}> + Add work</button> <br/>

                    <label>Did you pass class 10?</label> <br/>
                    <select name="class10" onChange={this.showHandler} value={this.state.class10}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select> <br/>
                    {class10}

                    <label>Did you pass class 12?</label> <br/>
                    <select name="class12" onChange={this.showHandler} value={this.state.class12}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select> <br/>
                    {class12}

                    <label>Did you go to college</label> <br/>
                    <select name="college" onChange={this.showHandler} value={this.state.college}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select> <br/>
                    {college}

                    <legend>Other skills</legend>
                    <label >Languages you speak</label><br/><br/>
                    {/* <textarea name="languages" required onChange={this.changeHandler}/> <br/> */}
                    {displayLang}
                    <button onClick={this.addLangHandler}> + Add Language</button> <br/>

                    <label >Softwares you know</label><br/>
                    <textarea name="softwares" placeholder="e.g.: MS Office, excel, powerpoint, programming, etc." onChange={this.changeHandler} value={this.state.userData.softwares}/> <br/>
                    <label >Any 3 Interests/Hobbies <i>*</i></label><br/>
                    <textarea name="hobbies" placeholder="e.g.: Music,, cricket, dance, sports, singing, etc." onChange={this.changeHandler} required value={this.state.userData.hobbies}/> <br/>
                    <label >Any 3 awards/achievements you want to mention</label><br/>
                    <textarea name="awards" placeholder="e.g.: Winner in poster presentation competition" onChange={this.changeHandler} value={this.state.userData.awards}/> <br/>

                    <label>Any training/workshop completed?</label> <br/>
                    <select name="training" onChange={this.showHandler} value={this.state.training}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select> <br/>
                    {training}

                    <div>
                        <button type="submit" onClick={() => {
                                Event('Submitted', 'Submitted Form', 'Clicked Submit form button in /Form');
                                ReactPixel.fbq('trackCustom', 'Submit button clicked');
                            }}> Submit and pay ₹150</button>
                    </div>
                </form>
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

export default Form;