import React, {useEffect, useContext} from "react";
import '../App.css';
import queries from '../queries';
import {  useParams } from 'react-router-dom';
import { useMutation, useLazyQuery} from '@apollo/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import BookmarkRemoveSharpIcon from '@mui/icons-material/BookmarkRemoveSharp';
import {AuthContext} from '../firebase/Auth';
import { makeStyles} from '@material-ui/core';
import { Grid } from "@mui/material";
import noImage from '../img/download.jpeg';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";



const useStyles = makeStyles({
	card: {
		maxWidth: 300,
		height: 'auto',
		marginLeft: '2cm',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const SavedMovies = (props) => {

    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;
    let card = null
    const {id}=useParams();
    const {currentUser} = useContext(AuthContext);

      const [getmoviesbyIDS, {data: saved_movies}] = useLazyQuery(
        queries.Get_Movies_By_IDS,
        {
        }
      ); 
      
    const [getusersavedmovies, {loading, error, data, refetch:refetchSaved}] = useLazyQuery(
        queries.GET_USER_SAVEDMOVIES,
        {
        }
      );

      const [removefromSave] = useMutation(queries.REMOVE_SAVEFORLATER, {
    });

      useEffect(() => {
		console.log('on load useeffect1');
        console.log(id);
		async function fetchData() 
        {
            if(currentUser)
            {
                console.log(currentUser.email);
                getusersavedmovies({variables:{userId:currentUser.email}});
                console.log(data);
                const idArray = data?.savedMovies?.map((node)=> node.id)
            console.log(idArray);
                getmoviesbyIDS({variables:{ids:idArray}});
            }
		}
		fetchData();

    }	, [data]);

    const removeSave=(email,id)=>
    {
      removefromSave({
        variables: { userId:email, movieId: id},
        onCompleted: refetchSaved
     })
     getusersavedmovies({ variables: { userId:currentUser.email}});
    }



    const buildCard = (show) => {
        return (
            <div key={show.id}>
          <Card  className={classes.card} sx={{ maxWidth: 345 }} >
          <Link to={{pathname:`/movie/${show.id}`}} >

            <CardHeader 
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {show.title.charAt(0)}
                </Avatar>
              }
              title={show.title}
            />
            <CardMedia
              component="img"
              height="400"
              image={show.image!=="0"?show.image:noImage  }
              alt={show.title}
            />
              </Link>
            <CardActions disableSpacing>
               <Button aria-label="Remove saved movie" 
                onClick={() => {removeSave(currentUser.email,show.id)}}>
                 <BookmarkRemoveSharpIcon/> Remove from Save
                </Button>
                
            </CardActions>         
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='span'>
                {show.plot.replace(regex, '').substring(0, 139) + '...'}
                </Typography>
              </CardContent>
            
          </Card>
          <br></br>
          </div>
        )
    }

  if(saved_movies && saved_movies.moviesByIds.length!==0){
    card =
      saved_movies &&
      saved_movies.moviesByIds.map((show) => {
        return buildCard(show);
      });
  } else {
    return(
      <div style={{color:"white"}}>
        "Kindly save movies to show!"
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return <div>{error.message}</div>;
  } else {
    return (
      <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", marginTop: "10rem", width: "100%"}}>
        <Grid container className={classes.grid} spacing={3}>
          {card}
        </Grid>
      </div>
    );
  }
}

export default SavedMovies