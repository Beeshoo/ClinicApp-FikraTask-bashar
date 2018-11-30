import React from 'react'
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD2ZyoGcvztCDWaGqtwhGgl223EmudnUkQ",
    authDomain: "clinicapp-74c0b.firebaseapp.com",
    databaseURL: "https://clinicapp-74c0b.firebaseio.com",
    projectId: "clinicapp-74c0b",
    storageBucket: "clinicapp-74c0b.appspot.com",
    messagingSenderId: "1032424112016"
  };
firebase.initializeApp(config);


let Navbar = styled.header `display:flex;justify-content: space-between; align-items: center; height: 70px; /* background: #2DB261; */ box-shadow: 1px 2px 10px #D6D6D6; padding: 5px 10%`

let Logo = styled.div `/* color: white */; font-size: 25px;`

let Search = styled.input `border: none; border-radius: 20px; height:40px; width:250px; padding-left:10px; background: #D6D6D6; color:white; outline:none; font-size: 20px;`

let Big = styled.div `display: flex; background: #2FA7E3;`
let AddClinic = styled.section `margin: 50px 2%; /* box-shadow: 1px 2px 10px #D6D6D6 */; border-radius: 5px; padding-bottom:20px; width: 30%; background: white`
let Container = styled.section `margin: 50px 2%; /* box-shadow: 1px 2px 10px #D6D6D6 */; border-radius: 5px; padding-bottom:20px; width: 60%; background: white`

let NewClinic = styled.div `width:100%; background: #D6D6D6; height: 60px; border-radius: 5px 5px 0 0; display: flex; align-items: center; `

let ListClinic = styled.article `display:flex; justify-content:space-between; align-items: center; max-height: 150px; background: #808080; box-shadow: 1px 2px 6px #B6B8B4; border-radius: 5px; margin-bottom: 20px; padding: 15px; width: 90%; margin: 20px auto; color:white`

let PrintBtn = styled.button `border:none; border-radius: 5px; background: #D6D6D6; outline:none; color: #808080; cursor:pointer; padding: 7px 15px;`

let NewPrescription = styled.button `background: #808080; padding: 7px 15px; border: none; border-radius: 5px; color:white; margin-left: 40px; cursor:pointer; outline: none`

let PatientName = styled.input `border: none; border-bottom: 1px solid gray; height: 50px; font-size: 15px; margin: 10px 0 0 20px; width:80%; outline:none; padding-left:10px;` 

let SelectDrug = styled.select `border: none; border-bottom: 1px solid gray; height: 50px; font-size: 15px; margin: 10px 20px 20px 20px; width:70%; outline:none; padding-left:10px;`

let DrugName = styled.div `border: none; border-bottom: 1px solid gray; font-size: 15px; margin: 10px 0 0 20px; width:80%; outline:none; padding-left:10px;`

let TitleList= styled.div `font-size: 20px; margin-left: 30px;`



class Clinic extends React.Component {

    constructor(){
        super()

        this.state = {
            clinics: [
                {
                    /* name: 'Bashar Methaq',
                    drug: ["Ibuprofen","Oxygen","Gabapentin"],
                    age:'15' */
                }/* , 
                {
                    name: 'Ahmed Kadum',
                    drug: ["Amoxicillin","Hand Sanitizer"],
                    age:'21'
                }, 
                {
                    name:'Abbaas Mohammed',
                    drug: ["Cephalexin"],
                    age:'40'
                }, 
                {
                    name:'Saleem Anwer',
                    drug: ["Metronidazole", "Levetiracetam", "Lorazepam"],
                    age:'28'
                } */
            ],
            drugs: [],
            patient: '',
            ages: '',
            oneDrug:'',
            allDrugs: []

        }

        this.getDrugs()

        firebase.firestore().collection('prescription').orderBy('date', 'desc').onSnapshot((snapshot)=>{
            let pre = []
            snapshot.forEach((doc)=>{
                pre.push(doc.data())
                this.setState({
                    clinics: pre
                })
            })
        })
        
    }
    
    getDrugs(){
        fetch(`https://api.fda.gov/drug/label.json?count=openfda.brand_name.exact&limit=1000`)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            this.setState({
                drugs: data.results
            })
        })
    }

    onChangeName(event){
        this.setState({
            patient: event.target.value
        })
        
    }

    onChangeDrug(event){
        this.setState({
            ages: event.target.value
        })
        /* console.log(this.state.pdrugs) */
    }
    
    onChangeSelectDrug(event){
        this.setState({
            oneDrug: event.target.value
        })
        console.log(this.state.oneDrug)
    }

    /* onClickNewPatient(){
        let clinics = this.state.clinics;
        clinics.push({
            name: this.state.patient,
            drug: this.state.pdrugs
        })
        this.setState({
            clinics: clinics,
            patient:'',
            pdrugs:''
        })
        console.log(this.state.clinics)
        console.log(this.state.drugs)
    } */

    render() { 
        return ( 
            <React.Fragment>
                <Navbar>
                    <Logo>Clinic App</Logo>
                    <div><Search placeholder='Search Clinic...'/></div>
                </Navbar>
                <Big>
                    <AddClinic>
                        <NewClinic>
                            <div><NewPrescription onClick={()=>{
                                /* let clinics = this.state.clinics; */
                                firebase.firestore().collection('prescription').add({
                                    patientName : this.state.patient,
                                    drugs : this.state.allDrugs,
                                    date: Date.now(),
                                    age: this.state.ages
                                })
                                /* clinics.push({
                                    name: this.state.patient,
                                    drug: this.state.allDrugs,
                                    age: this.state.ages
                                }) */
                                this.setState({
                                    patient:'',
                                    allDrugs:[],
                                    ages:''
                                })
                            }}>+ Save Prescription</NewPrescription></div>
                        </NewClinic>
                        <div>
                            <PatientName 
                                placeholder='Patient Name'
                                value={this.state.patient}
                                onChange={this.onChangeName.bind(this)}
                            />
                        </div>
                        <div>
                            <PatientName 
                                placeholder='Age'
                                value={this.state.ages}
                                onChange={this.onChangeDrug.bind(this)}
                                /* onKeyUp={this.onClickNewPatient.bind(this)} */
                            />
                        </div>
                        <div>
                            <SelectDrug onChange={this.onChangeSelectDrug.bind(this)}>
                                <option value="0">Choose a Drug</option>
                                {
                                    this.state.drugs.map((item,i)=>{
                                        return(
                                            <option 
                                                key={i} 
                                                value={item.term}
                                            >
                                                {item.term}
                                            </option>
                                        )
                                    })
                                }
                            </SelectDrug>
                            <PrintBtn onClick={()=>{
                                let allDrugs = this.state.allDrugs;
                                allDrugs.push( this.state.oneDrug)
                                this.setState({
                                    allDrugs: allDrugs
                                })
                            }}>Add</PrintBtn>
                        </div>
                        <div>
                            {
                                this.state.allDrugs.map((item, i)=>{
                                    return (
                                        <DrugName key={i}>- {item}</DrugName>
                                    )
                                })
                            }
                        </div>
                    </AddClinic>
                    <Container>
                        <NewClinic>
                            <TitleList>Patients List</TitleList>
                        </NewClinic>
                        {
                            this.state.clinics.map((item, i)=>{
                                return (
                                    <ListClinic key={i}>
                                        <div>{item.patientName}</div>
                                        <div><PrintBtn onClick={()=>{
                                            let doc = new jsPDF();
                                            doc.text("Patient Name:   " + item.patientName,50,50);
                                            doc.text("Age               :   " + item.age,50,60);
                                            doc.text("Date              :   " + item.date,50,70);
                                            doc.setLineWidth(0.5)
                                            doc.line(20, 75, 200, 75)
                                            doc.text("Prescription", 50,90);
                                            let h = 100
                                            item.drugs.forEach(element => {
                                                doc.text("-  " + element, 50, h)
                                                h+=10
                                            });
                                            doc.save('Prescription.pdf')
                                        }
                                        }><b>+</b> Print</PrintBtn></div>
                                    </ListClinic>
                                )
                            })
                        }
                            
                    </Container>
                </Big>
            </React.Fragment>
         );
    }
}

function App() {
    return (
        <Clinic/>       
    )
}

ReactDOM.render(<App/>, document.getElementById("root"))