import React, { Component,useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DatePicker from 'react-datepicker'
import Paper from '@material-ui/core/Paper';
import moment from 'moment/moment.js'
import ApexCharts from 'apexcharts'
var dat = [];
let total_dur = [];
var total =[];
var str = [];
var  end = [];
var str_time = '';
var end_time='';
var day ='';


class App extends Component {
 

    state = {
        todos: [],
        display:'block',
        btndisp:'block',
        name:'',
       da:[],
        open: false

    }

  showchart=() => {  //function to show chart of active hours of user
        this.setState({btndisp: "none"});
        this.setts();
        var options = {
            chart: {
              type: 'bar'
                   },
            series: [{
              name: 'hours',
              data: dat
                   }],
              xaxis: {
              categories: dat
                    },
              yaxis: {
              categories: dat
                      }
}
                 
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
};// end of showchart

componentDidMount() {
    fetch('https://run.mocky.io/v3/9bf9afa2-02ff-4205-b13d-ed474c9b11b6')
        .then(res => res.json())
        .then((data) => {
        this.setState({ todos: data.members })
        console.log(this.state.todos[0].activity_periods[0].start_time)
    })
        .catch(console.log)
  }//end of componenetDidMount


openDialog() {  //oen dialog box onclick
    this.setState({ open: true });
}//end of  openDialog


closeDialog (){  //close dialog box onclick
    this.setState({ open: false });
    window.location.reload(false);
    
}// end of closeDialog
      

handleClick = (e) => {  						//function to get day,start_time, end_time of clicked  user
      day = ''
      str_time ='';			
      end_time='';
       
  this.setState({name: JSON.stringify(e.real_name).replace(/['"]+/g, '')});
        var len = e.activity_periods.length;
    
  for(var i = 0;i < len;i++){
          day +=JSON.stringify(e.activity_periods[i]).replace(/['"]+/g, '')+'\n';
          str_time +=  JSON.stringify(e.activity_periods[i].start_time).replace(/['"]+/g, '').slice(11, 20)+'\n' ;
          end_time +=  JSON.stringify(e.activity_periods[i].end_time).replace(/['"]+/g, '').slice(11, 20)+'\n' ;
  }   
 

}//end of handleclick

 setts(){  //push active user hours
    dat =[];
      for(var j =0;j<total_dur.length;j++){
        dat.push(total_dur[j])
    }
 };//end of setts
   
    
GetDuration = (start_time,end_time) => {		//function return difference of end time and start time i.e total duration
    str.push(start_time);
    end.push(end_time);
        let str1 = str.filter((item, i, ar) => ar.indexOf(item) === i);
        let end1 = end.filter((item, i, ar) => ar.indexOf(item) === i);
     
    for(var i =0;i<=3;i++){
        var startTime=moment(str1[i], "HH:mma");
        var endTime=moment(end1[i], "HH:mma");
        var duration = moment.duration(endTime.diff(startTime));
        var hours = parseInt(duration.asHours());
        var minutes = parseInt(duration.asMinutes())-hours*60;
        total.push(hours + ' H and '+ minutes+' Min.' +"\n");
        total_dur = total.filter((item, i, ar) => ar.indexOf(item) === i);
        var theRemovedElement = total_dur.shift();
        
    }
}//end of GetDuration







render() {
  
    const dis = {
        display: this.state.display,
        width:'300px',
        marginRight:'auto',
        marginLeft:'auto',
        marginTop:'30px'
    };

    const dis1 = {
        display: this.state.display,
        width:'auto',
        height:'auto',
        marginRight:'auto',
        marginLeft:'auto',
        marginTop:'30px'
    };

    const btn = {
        display:'flex',
        justifyContent:'center',
        marginTop:'40px'
    };
    
    const tiltle = {
      display:'flex',
      justifyContent:'center',
      color:'white'
    };

    const rowsty = {
      height:'30px',
      fontSize:'18px',
    };
    
    const name_sty = {
      marginTop:"50px",
     
      fontSize:'26px'
    };
    const idchart = {
      width:'400px',
      marginLeft:'auto',
      marginRight:'auto'
    }


return (
       <div >
        <AppBar position="static">
          <Toolbar style={tiltle}>
          <Typography  variant="h3" >
            USER  DATA
          </Typography>
         
          </Toolbar>
        </AppBar>


      <div style={btn}>
          <Button variant="contained" color="primary"><b>Click any records to view the activity of user</b></Button>
      </div>
     
      <TableContainer style={dis}  component={Paper}>
      <Table  style={{border: '1px solid #D5D5D5'}}  size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align='center'><h1>User List</h1></TableCell>
          </TableRow>
        </TableHead>
          {this.state.todos.map((row) => (
            <TableBody>
                <TableRow  hover onClick={ () =>  this.openDialog(this)} >
                <TableCell style={rowsty} hover onClick={() => this.handleClick(row)}  align="center">{row.real_name}</TableCell>
                </TableRow> 
            </TableBody>
          ))}
      </Table>
    </TableContainer>


    <Dialog  open={this.state.open}>
        <DialogContent> 
        <center> <p style={name_sty}>{this.state.name}</p></center>
            <TableContainer    style={dis1}  component={Paper}>
              <Table   size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align='center'><h2>Date</h2></TableCell>
                    <TableCell align='center'><h2>Start Time </h2></TableCell>
                    <TableCell align='center'><h2>End Time </h2></TableCell>
                    <TableCell align='center'><h2>Total Duration Time </h2></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow  >

                    <TableCell align="center" style={{width:'100px'}}>{day.split("\n").map((i,j) => {
                       return <p >{i.slice(12, 22)}</p>;
                    })}</TableCell>
    
                    <TableCell  align="center">{str_time.split("\n").map((i,key) => {
                       return <p>{i}{this.GetDuration(i,'')} </p>;
                    })}</TableCell>

                    <TableCell  align="center">{end_time.split("\n").map((i,key) => {
                       return <p>{i}{this.GetDuration('',i)} </p>;
                    })}</TableCell>

                    <TableCell  align="center">{total_dur.map((i,key) => {
                       return <p>{i}</p>;
                    })} </TableCell>
                  </TableRow>
               
                </TableBody>
              </Table>
  
               <div style={idchart} id="chart"></div>

            </TableContainer>
             <Button align='center' style={{marginLeft:'180px',marginTop:'6px',display:this.state.btndisp}} variant="contained"    onClick={() => this.showchart()}>show activity chart</Button>
          </DialogContent>
             <Button  style={{marginTop:'30px',backgroundColor:'red'}} variant="contained"   color="primary"onClick={this.closeDialog.bind(this)}>close dialog</Button>
        </Dialog>
    </div>
    );
  }
}
export default App;
