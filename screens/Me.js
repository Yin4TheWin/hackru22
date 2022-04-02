import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import {useAuthState} from 'react-firebase-hooks/auth';
import Authenticator from '../components/Authenticator'

export default function Me({navigation}){
  //State 0 is log in, 1 is sign up
  const [loginState, setLoginState] = React.useState(0)
  //States for all text fields, namely email, password, name and location
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [name, setName] = React.useState("")
  const [location, setLocation] = React.useState("")
  //Firebase user object
  const [user, loading, error] = useAuthState(Authenticator.auth); 

  /*Begin signup, login and profile components*/
  SignUp=()=>{
    return (<View> 
      <TextInput style={styles.input} placeholder="Name" onChangeText={setName} value={name}/>  
      <TextInput style={styles.input} placeholder="Location" onChangeText={setLocation} value={location}/>  
      <TouchableOpacity style={styles.button} onPress={()=>{Authenticator.signUpUser(email, password, name, location)}}>
        <Text style={{color: 'white'}}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={{marginTop: '5%', marginLeft: '5%',  marginRight: '5%'}}>Already have an account? <Text onPress={()=> setLoginState(0)} style = {{ color: 'blue' }}>Log In</Text></Text>
      </View>)
  }
  Login=()=>{
    return (<View>
      <TouchableOpacity style={styles.button} onPress={()=>{Authenticator.loginUser(email, password)}}>
        <Text style={{color: 'white'}}>Log In</Text>
      </TouchableOpacity>
      <Text style={{marginTop: '5%', marginLeft: '5%',  marginRight: '5%'}}>Don't have an account? <Text onPress={()=> setLoginState(1)} style = {{ color: 'blue' }}>Sign Up</Text></Text>
    </View>)
  }
  Profile=()=>{
    return (<View>
        <TouchableOpacity style={styles.button} onPress={()=>{Authenticator.signOutUser()}}>
          <Text style={{color: 'white'}}>Sign Out</Text>
        </TouchableOpacity>
    </View>)
  }
  /*End signup, login, and profile components*/ 

  //What the Home function returns
  return (
    <View style={{ flex: 1, alignItems: 'center'}}>
        <View style={{paddingTop: '10%'}}>
          {user ?
            Profile() :
            <View style={{ flex: 1, alignItems: 'center'}}> 
              <Text>Sign up or login to start playing and tracking fit data.</Text>
              <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email}/>  
              <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password}/>
              {loginState===0? Login() : SignUp()}
            </View>
          }
        </View> 
    </View>
    )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderColor: "gray",
    width: Dimensions.get('window').width*0.8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  button: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  }
});