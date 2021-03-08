import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";


export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      error: '',
    }
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    this._roomButtonPressed = this._roomButtonPressed.bind(this);
  }

  render() {
    return (
      <Grid container spacing={1} alignItems='center'>
        <Grid item xs={12} align='center'>
          <Typography variant='h4' component='h4'>
            Join a room
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <TextField
            error={this.state.error}
            label='Code'
            placeholder='Enter a room code pls'
            value={this.state.roomCode}
            helperText={this.state.error}
            variant='outlined'
            onChange={this._handleTextFieldChange}>
            </TextField>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant="contained" color='primary' onClick={this._roomButtonPressed}>
            Join
          </Button>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant="contained" color='secondary' to='/' component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
      );
  }

  _handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    })
  }

  _roomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.roomCode,
      }),
    };
    fetch('/api/join-room/', requestOptions)
    .then((response) => {
      if(response.ok) {
        this.props.history.push(`/room/${this.state.roomCode}`)
      } else {
        this.setState({error: 'Room not found!'})
      }
    })
    .catch((error) => {console.log(error)});
  }
}