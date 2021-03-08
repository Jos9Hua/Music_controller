import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, IconButton } from '@material-ui/core';
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create',
}

export default function Info(props) {
    const [page, setpage] = useState(pages.JOIN);

    function joinInfo() {
        return 'Join page.';
    }

    function createInfo() {
        return 'Create page.';
    }

    useEffect(() => {
        console.log('rerendered this component');
        return () => {
            console.log('cleanup');
        }
    })

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <Typography component='h4' variant='h4'>
                    How to use Music Party?
                </Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <Typography variant='body1'>
                    { page === pages.JOIN ? joinInfo() : createInfo() }
                </Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <IconButton onClick={() => {page === pages.JOIN ? setpage(pages.CREATE) : setpage(pages.JOIN)}}>
                    { page === pages.CREATE ? <NavigateBeforeIcon/> : <NavigateNextIcon/> }
                </IconButton>
            </Grid>
            <Grid item xs={12} align='center'>
                <Button color='secondary' variant='contained' to='/' component= { Link }>
                    BACK
                </Button>
            </Grid>
        </Grid>
    )
}

