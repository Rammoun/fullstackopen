import * as React from 'react';
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from 'react-router-dom'


function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >              
              <MenuItem>
                <Typography sx={{ textAlign: 'center' }}>
                  <Link style={{marginLeft: 10}} to="/">blogs</Link>
                </Typography>
              </MenuItem>             
              <MenuItem>
                <Typography sx={{ textAlign: 'center' }}>
                  <Link style={{marginLeft: 10,marginRight: 10}} to="/users">users</Link>
                </Typography>
              </MenuItem>             
              <MenuItem>
                <Typography sx={{ textAlign: 'center' }}>
                  {user.name} logged in
                </Typography>
              </MenuItem>             
              <MenuItem>
                <Typography sx={{ textAlign: 'center' }}>
                  <button onClick={props.handleLogout} style={{marginLeft: 5}}>Logout</button>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button sx={{ my: 2, color: 'white', display: 'block' }} >            
              <Link style={{marginLeft: 10}} to="/">blogs</Link>
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }} >
              <Link style={{marginLeft: 10,marginRight: 10}} to="/users">users</Link> 
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }} > 
              {user.name} logged in
            </Button>
            <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={props.handleLogout} style={{marginLeft: 5}} >             
                <Typography sx={{ textAlign: 'center' }}>
                  Logout
                </Typography>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
