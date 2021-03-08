import React, { Component } from "react";
import { Button, 
  Grid, 
  Typography, 
  TextField, 
  FormHelperText, 
  Radio, 
  FormControl, 
  RadioGroup, 
  FormControlLabel,
  Collapse } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Alert } from '@material-ui/lab';


export default class RoomJoinPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      msg: '',
    }
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanChange = this.handleGuestCanChange.bind(this);
    this.handleCreateRoomButtonPressed = this.handleCreateRoomButtonPressed.bind(this);
    this.handleUpdateRoomButtonPressed = this.handleUpdateRoomButtonPressed.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    })
  }

  handleGuestCanChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    })
  }

  handleCreateRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room/", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push('/room/' + data.code));
  }

  handleUpdateRoomButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room/", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.setState({
            msg: 'Room Updated',
          });
        } else {
          this.setState({
            msg: 'ERROR!',
          });
        }
        this.props.updateCallback();
      })
  }

  renderCreateButton() {
    return(
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Button color='secondary' variant='contained' onClick={this.handleCreateRoomButtonPressed}>
            Create Room
          </Button>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button color='secondary' variant='contained' to='/' component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    )
  }

  renderUpdateButton() {
    return (
      <Grid item xs={12} align='center'>
        <Button color='secondary' variant='contained' onClick={this.handleUpdateRoomButtonPressed}>
          Update Room
        </Button>
      </Grid>
    )
  }

  render() {
    const title = this.props.update ? 'Update Room' : 'Create Room';
    let alert;
    if(this.state.msg == 'Room Updated') {
      alert = <Alert severity='success' onClose={() => this.setState({
        msg: '',
      })}>
        {this.state.msg}
      </Alert>
    } else {
      alert = <Alert severity='error' onClose={() => this.setState({
        msg: '',
      })}>
        {this.state.msg}
      </Alert>
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Collapse in={this.state.msg != ''}>
            {alert}
          </Collapse>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography component='h4' varient='h4'>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <FormControl component="fieldset">
            <FormHelperText>
              <div align='center'>
                Guest Control of Playback State
              </div>
            </FormHelperText>
            <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanChange}>
              <FormControlLabel 
                value='true' 
                control={<Radio color='primary'></Radio>} 
                label='Play/Pause' 
                labelPlacement='bottom'>
              </FormControlLabel>
              <FormControlLabel 
                value='false' 
                control={<Radio color='secondary'></Radio>} 
                label='No Control' 
                labelPlacement='bottom'>
              </FormControlLabel>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField 
              required={true} 
              type='number' 
              defaultValue={this.state.votesToSkip} 
              inputProps={{
                min: 1,
                style: {textAlign: 'center'},
              }}
              onChange={this.handleVotesChange}>
            </TextField>
            <FormHelperText>
              <div align='center'>
                Votes Required To Skip
              </div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {this.props.update ? this.renderUpdateButton() : this.renderCreateButton()}
      </Grid>
    );
  }
}