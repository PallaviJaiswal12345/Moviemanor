import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState} from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import  {AuthProvider}  from './firebase/Auth';
import MovieById from './components/MovieById';
import SavedMovies from './components/SavedMovies';
import WatchList from './components/WatchList';
import UserProfile from './components/UserProfile';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  useQuery 
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});


function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [noOfBookmarks, setNoOfBookmarks] = useState(0)
  const [noOfWatchedMovies, setNoOfWatchedMovies] = useState(0)
  const [moodMovieList, setMoodMovieList] = useState(false)
  const [moodId, setMoodId] = useState(0)

  return (
    <AuthProvider>
    <ApolloProvider client = {client}>
      <Router>
        <div className="App">
          <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setMoodId={setMoodId} noOfBookmarks={noOfBookmarks} noOfWatchedMovies={noOfWatchedMovies} loggedIn={setLoggedIn}/>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={ <Home searchTerm={searchTerm} moodId={moodId} setMoodId={setMoodId} setNoOfBookmarks={setNoOfBookmarks} setNoOfWatchedMovies={setNoOfWatchedMovies}/> } />

              <Route path='/SignIn' element={ <SignIn/> } />
              <Route path='/SignUp' element={ <SignUp/> } />
              <Route path='/movie/:id' element={ <MovieById setSearchTerm={setSearchTerm}/> } />
              <Route path='/SavedMovies' element={ <SavedMovies setSearchTerm={setSearchTerm}/> } />
              <Route path='/WatchList' element={ <WatchList setSearchTerm={setSearchTerm}/> } />
              <Route path='/UserProfile' element={<UserProfile setSearchTerm={setSearchTerm}/>} />
            </Routes>
          </div>
        </div>
      </Router>

    </ApolloProvider>
    </AuthProvider>

  );
}

export default App;