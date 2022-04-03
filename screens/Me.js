import * as React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import {useAuthState} from 'react-firebase-hooks/auth';
import Authenticator from '../components/Authenticator'
import GoogleFit, { Scopes } from 'react-native-google-fit'
import { ref, child, get, update, onValue } from "firebase/database";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const reducer = (state, action) => {

  switch (action.colorToChange) {
      case 'red':
          return {...state, red: state.red + action.amount};
      case 'green':
          return {...state, green: state.green + action.amount};
      case 'blue':
          return {...state, blue: state.blue + action.amount};
      default:
          return state;
  }
};
export default function Me({navigation}){
  //State 0 is log in, 1 is sign up
  const [dailySteps, setDailySteps] = React.useState(0);
  const [lifeSteps, setLifeSteps] = React.useState(0)
  const [lifeCals, setLifeCals] = React.useState(0)
  const [dailyCals, setDailyCals] = React.useState(0)
  const [armorLevel, setArmorLevel] = React.useState(1)
  const [armorXp, setArmorXp] = React.useState(0)
  const [weaponLevel, setWeaponLevel] = React.useState(1)
  const [weaponXp, setWeaponXp] = React.useState(0)
  const [state, dispatch] = React.useReducer(reducer, {red: 0, green: 0, blue: 0});
  const [loginState, setLoginState] = React.useState(0)
  //States for all text fields, namely email, password, name and location
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
    ],
  };
  //Firebase user object
  const [user, loading, error] = useAuthState(Authenticator.auth); 
  React.useEffect(()=>{
    if(user){
      get(child(ref(Authenticator.db), `users/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val().name);
          // Attach an asynchronous callback to read the data at our posts reference
          onValue(ref(Authenticator.db,`users/${user.uid}`), (newVal) => {
            let axp=newVal.val().lifeCals
            let level=1
            while(axp-(level*level*1000)>0){
              axp-=(level*level*1000)
              level+=1
            }
            setWeaponXp(axp)
            setWeaponLevel(level)
            setLifeCals(newVal.val().lifeCals)
            setDailyCals(newVal.val().dailyCals)
          }, (errorObject) => {
            console.log('The read failed: ' + errorObject.name);
          }); 
          GoogleFit.checkIsAuthorized().then(() => {
            var authorized = GoogleFit.isAuthorized;
            console.log(authorized);
            if (authorized) {
              // if already authorized, fetch data
 
            } else {
              // Authentication if already not authorized for a particular device
              GoogleFit.authorize(options)
                .then(authResult => {
                  if (authResult.success) {
                    console.log('AUTH_SUCCESS');
                    GoogleFit.getDailySteps().then((steps)=>{steps.forEach(el=>{
                      let daily=0
                      if(el.source.includes("google")&&el.source.includes("estimate")){
                        setDailySteps(el.steps[0].value)
                        daily=el.steps[0].value
                      }
                      if(snapshot.val().lifeSteps>0){
                        const opt = {
                          startDate: snapshot.val().lastOn, // required ISO8601Timestamp
                          endDate: new Date().toISOString(), // required ISO8601Timestamp
                          bucketInterval: 1, // optional - default 1. 
                        };
                        GoogleFit.getDailyStepCountSamples(opt).then((res)=>{res.forEach(el=>{
                          if(el.source.includes("google")&&el.source.includes("estimate")){
                            const allSteps = el.steps
                            let newSteps=0
                            allSteps.forEach(step=>{
                              newSteps+=step.value
                            })
                            let lifesteps=snapshot.val().lifeSteps+newSteps
                            setLifeSteps(lifesteps)
                            let xp=lifesteps
                            let level=0
                            while(xp-(level*level*1000)>0){
                              xp-=(level*level*1000)
                              level+=1
                            }
                         //   console.log(level, xp)
                            setArmorLevel(level)
                            setArmorXp(lifesteps)
                            update(ref(Authenticator.db, `users/${user.uid}`), {
                              lifeSteps: lifesteps,
                              lastOn: new Date().toISOString()
                            })
                          }
                        })}) 
                      } else {
                        setLifeSteps(daily)
                        let xp=daily
                        while(xp-(level*level*1000)>0){
                          xp-=(level*level*1000)
                          level+=1
                        }
                        setArmorLevel(level)
                        setArmorXp(daily)
                        update(ref(Authenticator.db, `users/${user.uid}`), {
                          lifeSteps: daily
                        })
                      }
                    })}).catch()
                    // if successfully authorized, fetch data
                  } else {
                    console.log('AUTH_DENIED ' + authResult.message);
                  }
                })
                .catch((err) => {
                  console.log(err)
                });
            }
         });
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
      
    }
  }, [user])
  /*Begin signup, login and profile components*/
  SignUp=()=>{
    return (<View>
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={setConfirm} value={confirm}/>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} value={username}/>    
      <TouchableOpacity style={styles.button} onPress={()=>{if(password===confirm&&username.length!==0) Authenticator.signUpUser(email, password, username) 
        else alert('Passwords must match and username must be a nonempty string!')}}>
        <Text style={{color: 'white'}}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={{marginTop: '5%', marginLeft: '5%',  marginRight: '5%'}}>Already have an account? <Text onPress={()=> setLoginState(0)} style = {{ color: 'blue' }}>Log In</Text></Text>
      </View>)
  }
  Login=()=>{
    return (<View>
      <TouchableOpacity style={styles.button} onPress={()=>{Authenticator.loginUser(email, password)}}>
        <Text style={{color: 'white', fontFamily:'Roboto'}}>Log In</Text>
      </TouchableOpacity>
      <Text style={{marginTop: '5%', marginLeft: '5%',  marginRight: '5%', fontFamily:'Roboto'}}>Don't have an account? <Text onPress={()=> setLoginState(1)} style = {{ color: 'blue', fontFamily:'Roboto' }}>Sign Up</Text></Text>
    </View>)
  }
  Profile=()=>{
    const DATA = [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Armor',
        image1: require("../images/armor1.png"),
        image2: require("../images/armor2.png"),
        image3: require("../images/armor3.png")
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Weapon',
        image1: require("../images/weapon1.png"),
        image2: require("../images/weapon2.png"),
        image3: require("../images/weapon3.png")
      }
    ];
    const getXp = (xp)=>{
      let level=0
      while(xp-((level+1)*(level+1)*1000)>0){
        xp-=((level+1)*(level+1)*1000)
        level+=1
      }
      return xp
    }
    const renderItem = ({ item }) => (
      <View style={{padding: '5%', flexDirection: 'row'}}>
          <Image
            style={{ height: 100, width: 100}}
            source={item.title==='Armor'?(armorLevel<4?item.image1:(armorLevel[item.title]<7?item.image2:item.image3)):(weaponLevel<4?item.image1:(weaponLevel[item.title]<7?item.image2:item.image3))}
            resizeMode="contain"
          />
        <Text style={{fontSize: 30}}>{item.title+"\n"} Lv. {item.title==='Armor'?armorLevel:weaponLevel} <Text style={{fontSize: 15}}>({item.title==='Armor'?getXp(armorXp):getXp(weaponXp)}/{item.title==='Armor'?(armorLevel*armorLevel*1000):(weaponLevel*weaponLevel*1000)})</Text></Text>
      </View>
    );
    return (<View>
      <Text style={{fontSize: 30, paddingBottom: '3%', fontFamily:'Roboto'}}>Welcome back, {username}</Text>
      <View style={{paddingTop: '3%', height:"auto", flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Text style={{paddingRight: '3%', fontSize: 15, fontFamily:'Roboto'}}>Today's stats: </Text>
        <Text style={{paddingRight: '3%', fontSize: 15, fontFamily:'Roboto'}}>{dailySteps} <FontAwesome5 name="shoe-prints" size={20} color="#010333"/> </Text>
        <Text style={{paddingLeft: '3%', fontSize: 15, fontFamily:'Roboto'}}>{dailyCals} <MaterialCommunityIcons name="lightning-bolt" size={22} color="#f7eb40"/></Text>
      </View>
      <View style={{paddingTop: '3%', height:"auto", flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Text style={{paddingRight: '3%', fontSize: 15, fontFamily:'Roboto'}}>Lifetime stats: </Text>
        <Text style={{paddingRight: '3%', fontSize: 15, fontFamily:'Roboto'}}>{lifeSteps} <FontAwesome5 name="shoe-prints" size={20} color="#010333"/> </Text>
        <Text style={{paddingLeft: '3%', fontSize: 15, fontFamily:'Roboto'}}>{lifeCals} <MaterialCommunityIcons name="lightning-bolt" size={22} color="#f7eb40"/></Text>
      </View>
      <FlatList
      style={{paddingTop: '10%'}}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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