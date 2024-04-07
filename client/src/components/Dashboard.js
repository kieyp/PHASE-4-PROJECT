import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const resources = [
    { name: 'Articles', path: '/articles' },
    // Add more resources here
  ];
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    // Check if the user is logged in
    axios.get('/check-login')
      .then((response) => {
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        history.push('/signin'); // Redirect to sign-in page if not logged in
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  if (loading) {
    return <p>Loading...</p>; // Optionally, you can show a loading indicator while checking login status
  }

  return (
    <div className={classes.container}>
      {isLoggedIn && (
        <>
          <h2>Welcome to Your Dashboard</h2>
          {resources.map((resource) => (
            <Card key={resource.name} style={{ width: '300px', margin: '10px' }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {resource.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Click to view {resource.name}
                </Typography>
                <Link to={resource.path}>View {resource.name}</Link>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

export default Dashboard;
