// File: LandingPage.js
import React from 'react';
import { TextField, Button, Container, Typography, Box, ToggleButtonGroup, ToggleButton ,Alert} from '@mui/material';
import { useState } from 'react';
import axios from 'axios'

function LandingPage() {

  const [isLogIn,setIsLogin] = useState(1);
  const [userName,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login",{name:userName,password:password});
    setMessage(res.data.msg);
    
    

       setUserName("");
     setPassword("");

      
    } catch (error) {
    // Check if backend sent a response
    if (error.response) {
      setMessage(error.response.data.msg);  // Show backend error
    } else {
      setMessage("Login failed. Please try again.");  // Generic fallback
        setTimeout(() => {
      setMessage("");
    }, 3000);
    
    }
  }
    
    



  }
  const handleSignUp= async(e)=>{
    e.preventDefault();
   try{
    const res = await axios.post("http://localhost:8000/signup",{
     name:userName,password:password});

     setMessage(res.data.msg);
     setUserName("");
     setPassword("");
  }catch(error){
    if(error.response){
      setMessage(error.response.data.msg);
    }
    else{
      setMessage("SignUp Failed!")
        setTimeout(() => {
      setMessage("");
    }, 3000);
    
    }

  }

  }

  






  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        onSubmit={isLogIn===1?handleLogin:handleSignUp}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to My App
        </Typography>

        <ToggleButtonGroup
          color="primary"
          exclusive
          sx={{ mb: 3 }}
        >
          <Button value="login" variant={isLogIn===1?"contained":" "} onClick={()=>{setIsLogin(1)}}>Login</Button>
          <Button value="signup" variant={isLogIn===0?"contained":" " } onClick={()=>{setIsLogin(0)}}>Sign Up</Button>
        </ToggleButtonGroup>
        <div>
          {isLogIn===1?<h1>Login</h1>:<h1>SignUp</h1>}
        </div>

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userName}
             onChange={(event)=>setUserName(event.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(event)=>setPassword(event.target.value)}
          />
          
          {/* Only show this in Signup mode (you can handle visibility through logic) */}
      

          <Button
          type='submit'
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
       <p>{message}</p>
      </Box>
    </Container>
  );
}

export default LandingPage;