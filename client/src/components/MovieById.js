import { Link, useParams,useNavigate } from 'react-router-dom';
import '../App.css';
import queries from '../queries';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, { useEffect ,useContext, useState} from 'react';
import {AuthContext} from '../firebase/Auth';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader ,Box} from '@material-ui/core';
import noImage from '../img/download.jpeg';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Avatar from '@mui/material/Avatar';
import { blue,red } from '@mui/material/colors';
import CommentIcon from '@mui/icons-material/Comment';
import { Button, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField } from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUpOutlined';
import { Navigate } from 'react-router-dom';
import { textAlign } from '@mui/system';


const useStyles = makeStyles({
	
	card: {	
		maxWidth: 400,
		height: 'auto',
		borderRadius: 15,
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold',
		fontSize: 'x',

	},
	title:{
			fontSize:"xx-large",
			font:'bold'
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
	},
	commentLikeButton:
	{
		background:'#0A7BF6',fontWeight: 'bold',
		fontSize: 12,
		border:"none"
	},
	commentNormalLikeButton:
	{	color: '#1e8678',
	fontWeight: 'bold',
	fontSize: 12,
	border:"none"	
	},
	commentDisLikeButton:
	{
		background:'#DE1818',fontWeight: 'bold',
		fontSize: 12,
		border:"none"
	}
});

function MovieById(props)
{
    const classes = useStyles();
	const navigate=useNavigate()
    const {id}=useParams();
    const {currentUser} = useContext(AuthContext);
	const [checked,setChecked] = useState(false);
	let displayComment=null;
	const [defaultVal,setDefault]=useState("");
    const [getMoviesById, {loading, error, data}] = useLazyQuery(
        queries.GET_MOVIES_BY_ID,
        {
            fetchPolicy:"cache-and-network",
        }
      );

	  const [showComments, {loading:loading1, error:error1, data:comments,refetch:refetch1}] = useLazyQuery(
        queries.SHOW_COMMENTS,
        {
            fetchPolicy:"cache-and-network",

        }
      );

	  const [addCommentDB, {loading:loading2, error:error2, data:add}] = useMutation(
        queries.ADD_COMMENT,
        {
            fetchPolicy:"network-only",
			onCompleted:refetch1
        }
      );


	  const [addLikeToComment, {loading:loading3, error:error3, data:addLikeComment}] = useMutation(
        queries.ADD_LIKE,
        {
            fetchPolicy:"network-only",
			onCompleted:refetch1
        }
      );
	  const [addDisLikeToComment, {loading:loading4, error:error4, data:addDisLikeComment}] = useMutation(
        queries.ADD_DISLIKE,
        {
            fetchPolicy:"network-only",
			onCompleted:refetch1
        }
      );

      useEffect(() => {
		console.log('on load useeffect');
        console.log(id);
		async function fetchData() 
        {
			console.log(currentUser);
			getMoviesById({variables:{id:id}});
		}
		fetchData();

    }	, [id]);

	const showCommentsOfMovie=()=>{
		setChecked((prev)=>!prev);
		showComments({variables:{movieId:id}})
		console.log(comments);

	}
	const addComment=()=>{
		
		let com=(document.getElementById("comment").value);
		if(currentUser){
		addCommentDB({variables:{movieId: id, userId: currentUser.displayName, comment: com}})
		}
		else{
			alert("Login to add a comment");
			navigate('/SignIn');
		}
		document.getElementById("comment").value="";


	}
	const likeComment=(commentID)=>{
		console.log("here");
		console.log(commentID);
		if(currentUser){
		addLikeToComment({variables:{movieID:id,  commentID: commentID, emailID: currentUser.email}})
		}else{
			alert("Login to add a comment");
			navigate('/SignIn');
		}

	}
	const dislikeComment=(commentID)=>{
		if(currentUser){
		addDisLikeToComment({variables:{movieID:id,  commentID: commentID, emailID: currentUser.email}})
		}
		else{
			alert("Login to add a comment");
			navigate('/SignIn');
		}
	}
const commentCard = (comment)=>{
	return(
		<Paper sx={{m:1}} elevation={4} key={comment.UserID}>
			<List sx={{width:'100%', maxwidth:360, bgcolor:'background.paper'}}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar sx={{ bgcolor: "blue" }} >
							 {comment.UserID?comment.UserID.charAt(0):" "}
						</Avatar>
					</ListItemAvatar>
					<ListItemText 
						  primary={comment.UserID}
						  secondary={
						<React.Fragment>
						  <Typography
						sx={{ display: 'inline' }}
						component="span"
						variant="body2"
						color="text.primary"
					  ></Typography>
						  {comment.comment} 
						</React.Fragment>}/>
						{comment.like.includes(currentUser.email)?
						<button className={classes.commentLikeButton}  onClick={()=>likeComment(comment.id)}><ThumbUpIcon/>Like </button>:
						<button className={classes.commentNormalLikeButton}  onClick={()=>likeComment(comment.id)}><ThumbUpIcon/>Like </button>} &nbsp;&nbsp;&nbsp;&nbsp; 
						{comment.like.length-comment.dislike.length} &nbsp;&nbsp;&nbsp;&nbsp;
						{comment.dislike.includes(currentUser.email)?
						<button className={classes.commentDisLikeButton} onClick={()=>dislikeComment(comment.id)}><ThumbDownIcon/>Dislike</button>:
						<button className={classes.commentNormalLikeButton}   onClick={()=>dislikeComment(comment.id)}><ThumbDownIcon/>Dislike</button>}
						<br></br>
						
				</ListItem>
			</List>
		</Paper>
	 );
	}



	if(comments && comments.listOfComments && comments.listOfComments.comment){
		displayComment =comments.listOfComments.comment.map((comment)=>{
			return commentCard(comment);
		})
	}

    if(data)
    {
        return(
			<div className='homeWithoutLogin' style={{marginTop: "5rem"}}>
				<Link to={"/"} style={{textDecoration: "none", color: "#c384d2", fontSize: "larger", textAlign: "start"}}>Back to all shows...</Link>
				<br /><br />
				<div className='movieDetailsBox'>
					<Card className={classes.card}>
						<CardMedia
							className={classes.media}
							component='img'
							height="700"
							image={data.movieById.image!=="0"?data.movieById.image:noImage  }
							title='show image'  
						/>
					</Card>
					<Typography variant='body1' component="div" color='primary' style={{width: "850px", display: "flex", flexDirection: "column", alignItems: "start"}}>
						<Typography variant='h2' component="h1" style={{color: "#676fe9", fontWeight: "bold"}}>
							{data.movieById.title}
						</Typography>
						<Typography variant='body2' component="div" style={{ display: "flex", width: "auto", columnGap: "1.7rem", maxWidth: "850px"}} >		  
							<Rating
								name="text-feedback"
								value={Number(data.movieById.tmDbRating)/2}
								readOnly
								precision={0.5}
								emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
								size='large'
								title='TMDB Rating'
							/>
							<Typography variant='h6' component="h2" style={{color: "#ffffffb5"}}>
								Released: {data.movieById.releaseDate}
							</Typography>
						</Typography>
						<Typography variant='body2' component="div" style={{display: "flex", fontSize: "30px", color: "whitesmoke", textAlign: "justify", marginTop: "1.5rem"}}>
							{data.movieById && data.movieById.plot ? data.movieById.plot : `N/A`}
						</Typography>
					</Typography>
				</div>
				{/* <Card className={classes.card} variant='outlined' style={{marginBottom: "10rem"}}>
					<CardHeader className={classes.titleHead} classes={{title:classes.title}} title={data.movieById.title} avatar={
					<Avatar sx={{ bgcolor: data.movieById.adult ? red[500] : blue[500] ,width: 55, height: 55,fontSize:"small"}} aria-label="recipe">
					{data.movieById.adult?"ADULT MOVIE":"FAMILY MOVIE"}
					</Avatar>
				} action={
					<Box sx={{ width: 200, sizeWidth:800, alignItems: 'center', alignSelf:'center', marginTop:'0.5cm',}} title='TMDB Rating'>		  
						<Rating
							name="text-feedback"
							value={Number(data.movieById.tmDbRating)/2}
							readOnly
							precision={0.5}
							emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
							size='large'
						/>
					</Box>}>
					</CardHeader>				
					<CardMedia
						className={classes.media}
						component='img'
						image={data.movieById.image!=="0"?data.movieById.image:noImage  }
						title='show image'  
					/>
					<CardContent>	
						<Typography className='tagline'>
							<div className='tagline'> {data.movieById.tagline}</div>
						</Typography>
							<Typography variant='body2' color='textPrimary' component='span'>
								<dl>
									<h1>{data.movieById.name}</h1>
									<p>
										<dt className='title'>Description:</dt><br></br>
										{data.movieById && data.movieById.plot ? <dd>{data.movieById.plot}</dd> : <dd>N/A</dd>}
									</p>
								</dl>
							</Typography>
							<Typography >
							<div className='releaseDate' >Release Date : {data.movieById.releaseDate}</div>
						</Typography>
						<Link to={"/"} style={{textDecoration: "none", color: "brown"}}>Back to all shows...</Link>
					</CardContent>
					<div><Button checked={checked} onClick={()=>showCommentsOfMovie()}><CommentIcon/>Comment</Button></div>
					{checked?<div>
						<TextField required id="comment" label="Enter Comment" />
						<button onClick={addComment}>Submit</button></div>
					:<div></div>}
					{checked?displayComment:<div></div>}
				</Card> */}
				<br />
			</div>
        );
    }
    else
    {
        return(
            <div>Error</div>
        );
    }
}
export default MovieById;