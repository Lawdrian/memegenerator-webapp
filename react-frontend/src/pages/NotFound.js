import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Button } from '@material-ui/core';

export default function NotFound() {
    return (
        <Container style={{ textAlign: 'center', marginTop: '100px' }}>
            <Typography variant="h3" color="error" gutterBottom>
                Page not found!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                The requested page could not be found.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
            >
                Return to homepage
            </Button>
        </Container>
    );
}