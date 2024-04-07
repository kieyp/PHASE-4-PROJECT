import React from 'react';
import { Link } from 'react-router-dom';
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
  const resources = [
    { name: 'Articles', path: '/articles' },
    // Add more resources here
  ];
  const classes = useStyles();

  return (
    <div className={classes.container}>
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
    </div>
  );
}

export default Dashboard;