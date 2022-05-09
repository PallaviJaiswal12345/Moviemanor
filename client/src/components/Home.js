import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import queries from '../queries';
import {useQuery, useMutation, useLazyQuery} from '@apollo/client';
import {AuthContext} from '../firebase/Auth';
import { makeStyles } from '@material-ui/core';
import HomeDataGrid from "./HomeDataGrid";
import MoodDetector from "./MoodDetector";


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

const Home = (props) => {
  const {currentUser} = useContext(AuthContext);
  const[searchTerm,setSearchTerm]=useState();
  let card=null;
  let pagination=null;
  const classes = useStyles();
  const regex = /(<([^>]+)>)/gi;

  const [getAllMovies,{loading, error, data, refetch}] = useLazyQuery(
      queries.GET_MOVIES,
      {
          fetchPolicy:"cache-and-network", 
      }
    );

  const [addToWatchList] = useMutation(queries.ADD_TOWATCHLIST)
  const [removefromWatchList] = useMutation(queries.REMOVE_FROM_WATCHLIST)
  const [addToSave] = useMutation(queries.ADD_SAVEFORLATER)
  const [removefromSave] = useMutation(queries.REMOVE_SAVEFORLATER)
  const [pageNum,setPageNum] = useState();
  const [getUserWatchedMovies,{data: data1, loading: watchedLoading, refetch:refetchWatched}] = useLazyQuery(queries.GET_USER_WATCHEDMOVIES, {});
  const [getUserSavedMovies,{data: data2, loading: savedLoading, refetch:refetchSaved}] = useLazyQuery(queries.GET_USER_SAVEDMOVIES,{});
  const [getMoodBasedMovies, {data: moodData, loading: moodMoviesLoading, refetch: moodRefetch}] = useLazyQuery(queries.GET_MOOD_BASED_MOVIES, {})

  useEffect(() => {
    console.log('on load useeffect '+props.searchTerm);
          // setSearchTerm(props.searchTerm);
    async function fetchData() {
      console.log("i am here inside the useEffect in Home Component");
      if(props.moodId !== 0){
        await getMoodBasedMovies({
          variables: {
            moodId: props.moodId
          }
        })
      }
      if(props.searchTerm!==searchTerm) {
        setPageNum(1)
      }
      setSearchTerm(props.searchTerm)
      if(currentUser) {
        getAllMovies({variables:{"title":props.searchTerm,"pageNum":pageNum}}); 
        getUserWatchedMovies({variables: { userId:currentUser.email}});
        getUserSavedMovies({ variables: { userId:currentUser.email}});
      }
      if(props.searchTerm=="") {
        getAllMovies({variables:{"title":props.searchTerm,"pageNum":pageNum}}); 
      }
      console.log("Searched Movie Data", data);
      console.log("Watched Movie Data", data1);
      console.log("Saved Movie Data", data2);
      console.log("Mood Based Movie Data", moodData); 
    }
		fetchData();
    }	, [props.searchTerm, pageNum, props.moodId]);
  
  if (loading || moodMoviesLoading || savedLoading || watchedLoading) {
    return(
      <div style={{color: "white"}}>Loading Movies...</div>
    )
  } else {
    
  }
  return (
    <div className="homeWithoutLogin">
      <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", marginTop: "10rem", width: "100%"}}>
        {searchTerm || props.moodId ? <HomeDataGrid data={data} data1={data1} data2={data2} pageNum={pageNum} setPageNum={setPageNum} searchTerm={searchTerm} getAllMovies={getAllMovies} 
            getUserSavedMovies={getUserSavedMovies} addToSave={addToSave} refetchSaved={refetchSaved} removefromSave={removefromSave} getUserWatchedMovies={getUserWatchedMovies}
            refetchWatched={refetchWatched} removefromWatchList={removefromWatchList} addToWatchList={addToWatchList} moodData={moodData} moodRefetch={moodRefetch}
            getMoodBasedMovies={getMoodBasedMovies} moodId={props.moodId}/>
        : <MoodDetector setMoodId={props.setMoodId} setPageNum={setPageNum}/> }
      </div>
    </div>
    );
  }

export default Home;