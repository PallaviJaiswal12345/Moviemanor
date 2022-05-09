import React, {useEffect, useState,useContext} from "react";
import '../App.css';
import { styled, alpha } from '@mui/material/styles';
import {AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { doSignOut } from '../firebase/FirebaseFunctions';
import {BrowserRouter as Router, Route, Link, Routes,NavLink, useNavigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';

 
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.3),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
  backdropFilter: "blur(30px)",
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavDiv = styled("div")(({ theme }) => ({
    display: "flex",
    width: "auto",
    height: 122,
    backgroundColor: "#000000",
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
}));

const NavBar = (props) => {
	const [anchorEl, setAnchorEl] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const navigate=useNavigate();
    const isMenuOpen = Boolean(anchorEl);
    const menuId = 'primary-search-account-menu';

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    

    const loggedInDiv = (x) => {
        if (x) {
            return (
            <div style={{display: "flex"}}>
                <Search aria-autocomplete="false" color="#dedede">
                    <SearchIconWrapper>
                        <SearchIcon sx={{color: "#dedede"}}/>
                    </SearchIconWrapper>
                    <StyledInputBase
                    id="searchInput"
                    placeholder="Search…"
                    autoComplete="off"
                    inputProps={{ 'aria-label': 'search' }}
                    sx={{color: "#dedede"}}
                    value={props.searchTerm}
                    onChange= {(e) => {
                        props.setSearchTerm(e.target.value)
                        console.log(e.target.value);
                        navigate("/")
                    }}
                    />
                </Search>
                <Link to={"/SavedMovies"} onClick={() => {props.setSearchTerm("")}} title="My Saved Movies">
                    <IconButton size="large" color="secondary" aria-label={`show ${props.noOfBookmarks} watchlisted movies`} title="My Saved Movies">
                        <Badge badgeContent={props.noOfBookmarks} color="error">
                            <BookmarksIcon />
                        </Badge>
                    </IconButton>
                    <p style={{display: "none"}}>My Saved Movies</p>
                </Link>
                <Link to={"/WatchList"} onClick={() => {props.setSearchTerm("")}} title="My Watched Movies">
                    <IconButton size="large" color="secondary" aria-label={`show ${props.noOfWatchedMovies} watched movies`} title="My Watched Movies">
                        <Badge badgeContent={props.noOfWatchedMovies} color="error">
                            <ListAltIcon />
                        </Badge>
                    </IconButton>
                    <p style={{display: "none"}}>My Watched Movies</p>
                </Link>
                <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                title="Profile"
                color="secondary"
                >
                    <AccountCircle />
                </IconButton>
            </div>
            );
        } else {
            return (
                <div style={{ display: "flex", columnGap: "1rem" }}>
                    <Link style={{textDecoration: "none"}} to={"/SignIn"}>
                        <Button variant="contained" sx={{ backgroundColor: "blue", height: 60, width:150, borderRadius: "20px", fontSize: "25px", textDecoration: "none" }} >Sign In </Button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={"/SignUp"}>
                        <Button variant="contained" sx={{ backgroundColor: "blue", height: 60, width:150, borderRadius: "20px", fontSize: "25px", textDecoration: "none" }} > Sign Up</Button>
                    </Link>
  
                </div>
            );
        }
    }

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            sx={{marginTop: "4rem", color: "#202226 !important"}}
        >
        <Link to={"/UserProfile"} sx={{textDecoration: "none"}}>
            <MenuItem sx={[{color: "#515ce2", fontSize: "20px", backgroundColor: alpha("#fff", 0.3), backdropFilter: "blur(30px)"}, () => ({'&:hover': {textDecoration: "none", backgroundColor: alpha("#515ce2", 0.5)}})]}
            onClick={handleMenuClose}>Profile</MenuItem>
        </Link>
        <Link to={"/SavedMovies"} sx={{textDecoration: "none"}}>
            <MenuItem sx={[{color: "#515ce2", fontSize: "20px", backgroundColor: alpha("#fff", 0.3), backdropFilter: "blur(30px)"}, () => ({'&:hover': {textDecoration: "none", backgroundColor: alpha("#515ce2", 0.5)}})]}
            >My Saved Movies</MenuItem>
        </Link>
        <Link to={"/WatchList"} sx={{textDecoration: "none"}}>
            <MenuItem sx={[{color: "#515ce2", fontSize: "20px", backgroundColor: alpha("#fff", 0.3), backdropFilter: "blur(30px)"}, () => ({'&:hover': {textDecoration: "none", backgroundColor: alpha("#515ce2", 0.5)}})]}
            >My Watched List</MenuItem>
        </Link>
        <Link to={"/"} sx={{textDecoration: "none"}}>
            <MenuItem sx={[{color: "#515ce2", fontSize: "20px", backgroundColor: alpha("#fff", 0.3), backdropFilter: "blur(30px)"}, () => ({'&:hover': {textDecoration: "none", backgroundColor: alpha("#515ce2", 0.5)}})]}
            onClick={(e) => { 
                e.preventDefault()
                props.setSearchTerm("")
                doSignOut() 
                handleMenuClose()
                navigate("/")
            }} >Log out</MenuItem>
        </Link>
        </Menu>
    );

    return (
        <NavDiv className="navbar" >
            <Toolbar sx={{ columnGap: '25rem', justifyContent: "space-evenly" }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' }, fontSize: "50px !important" }} 
                    fontWeight={"bold"}
                >
                   <Link to={"/"} onClick={(e) => {
                       e.preventDefault()
                       props.setSearchTerm("")
                       props.setMoodId(0)
                       navigate("/")
                       if(currentUser){
                           let searchBox = document.getElementById("searchInput")
                           searchBox.value = ""
                       }
                   }} style={{textDecoration: "none", color: "inherit"}}>
                        Moviemanor  
                   </Link> 
                </Typography>
                {loggedInDiv(currentUser)}
            </Toolbar>
            {renderMenu}
        </NavDiv>
    );
}

export default NavBar;