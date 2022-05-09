import {gql} from '@apollo/client';

const GET_MOVIES = gql`
query MovieList($title: String, $pageNum: Int) {
  movieList(title: $title, pageNum: $pageNum) {
    id
    title
    plot
    image
    tmDbRating
    page
  }
}
  
`;

const GET_MOVIES_BY_ID=gql`
query MovieById($id: String) {
  movieById(id: $id) {
    id
    title
    image
    plot
    tmDbRating
    page
    tagline
    releaseDate
    adult
  }
}
`;

const Get_Movies_By_IDS =  gql`
query MoviesByIds($ids: [String]) {
  moviesByIds(ids: $ids) {
    id
    title
    image
    plot
    page
    tmDbRating
    tagline
    releaseDate
    adult
  }
}
`;

const GET_USER_WATCHEDMOVIES = gql`
query CheckIfwatched($userId: String) {
  checkIfwatched(userId: $userId) {
    id
  }
} 
`;

const GET_USER_SAVEDMOVIES = gql`
query SavedMovies($userId: String) {
  savedMovies(userId: $userId) {
    id
  }
}
`;

const GET_MOOD_BASED_MOVIES = gql`
  query MoodBasedMovies($moodId: ID!, $pageNum: Int) {
    moodBasedMovies(moodId: $moodId, pageNum: $pageNum) {
      id
      title
      image
      plot
      page
    }
  }
`;


const ADD_TOWATCHLIST = gql`
mutation AddtowacthList($userId: String, $movieId: String) {
  AddtowacthList(userId: $userId, movieID: $movieId) {
    id
  }
}
  
`;

const REMOVE_FROM_WATCHLIST = gql`
mutation RemoveFromWatchList($userId: String, $movieId: String) {
  removeFromWatchList(userId: $userId, movieID: $movieId)
}
`;

const ADD_SAVEFORLATER = gql`
mutation AddSaveforLater($userId: String, $movieId: String) {
  AddSaveforLater(userId: $userId, movieID: $movieId) {
    id
  }
}
`;

const REMOVE_SAVEFORLATER = gql`
mutation RemoveSaveforLater($userId: String, $movieId: String) {
  removeSaveforLater(userId: $userId, movieID: $movieId)
}
`;

const ADD_COMMENT = gql`
mutation AddComments($movieId: String, $userId: String, $comment: String) {
  addComments(movieID: $movieId, userID: $userId, comment: $comment)
}
`;


const SHOW_COMMENTS = gql`
query ListOfComments($movieId: String) {
  listOfComments(movieId: $movieId) {
    MovieId
    comment {
      UserID
      comment
      like
      dislike
      id
    }
  }
}
`;

const ADD_LIKE = gql`
mutation AddLike($movieID: String, $commentID: String, $emailID: String) {
  addLike(movieID: $movieID, commentID: $commentID, emailID: $emailID)
}

`;

const ADD_DISLIKE = gql`
mutation AddDislike($movieID: String, $commentID: String, $emailID: String) {
  addDislike(movieID: $movieID, commentID: $commentID, emailID: $emailID)
}
`;







let exported = {
  GET_MOVIES,
  ADD_TOWATCHLIST,
  GET_USER_WATCHEDMOVIES,
  REMOVE_FROM_WATCHLIST,
  GET_USER_SAVEDMOVIES,
  ADD_SAVEFORLATER,
  REMOVE_SAVEFORLATER, 
  GET_MOVIES_BY_ID,
  Get_Movies_By_IDS,
  GET_MOOD_BASED_MOVIES,
  ADD_COMMENT,
  SHOW_COMMENTS,
  ADD_LIKE,
  ADD_DISLIKE
  };
  
export default exported
