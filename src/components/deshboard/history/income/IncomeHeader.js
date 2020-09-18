import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function IncomeHeader({income}) {
    const classes = useStyles();
    return (
        <>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} variant="h5" component="h2" color="primary" gutterBottom>
                      Your Income
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {income} Rs
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        adjective
                    </Typography>
                    <Typography variant="body2" component="p">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                    </Typography>
                </CardContent>

            </Card>
        </>
    );
}