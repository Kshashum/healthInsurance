import { React, useState, useEffect } from 'react'
import {useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import './Login.css'
import { useStateValue } from '../context/StateContext'
import {TextField, Typography, Button} from '@material-ui/core'

const Login = () => {
    const [{login},dispatch] = useStateValue()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory()
    useEffect(() => {
        if (login) {
            history.push('/')
        }
    }, [login, history])
    const handleSubmit = async (e) => {
        e.preventDefault()
        axios.post('http://localhost:4000/api/v1/auth/login', { email, password }).then((res) => { return res.data }).then((data) => {
            if (data.token) {
                dispatch({
                    type:"AUTHORIZE",
                    item:{
                        name:data.name,
                        token:data.token,
                        userid:data.userid
                    }
                })
                history.push('/')
            }
            else {
                history.push("/login")
            }
        }).catch(err => { console.log(err.message) })
    }
    return (
        <div className='login'>
        <div className="container" >
            <div className="login_split">
            <Typography variant="h4">Login</Typography>
            <form className="login_form">
                    <Typography variant='h6' style={{marginTop:"5px"}}>Email</Typography>
                    <TextField
                        type="email"
                        style={{marginTop:"5px"}}
                        placeholder="something@mail.com"
                        name="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    ></TextField>
                    <Typography variant='h6' style={{marginTop:"5px"}}>Password</Typography>
                    <TextField
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        style={{marginTop:"5px"}}
                    ></TextField>
                    <Button style={{backgroundColor: '#f0c14b', color: '#111', width:"30%",marginTop:"10px"}} onClick={handleSubmit}>Submit</Button>
                    <p style={{marginTop:"5px"}}>Not a memeber? <Button component={ Link } to="/signup" variant="contained" color="primary">Signup
                    </Button></p>
            </form>
            </div>
        </div>
        </div>
    )
}

export default Login
