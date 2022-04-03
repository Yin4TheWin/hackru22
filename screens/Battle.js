import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import Modal from 'react-native-modal'
import {useAuthState} from 'react-firebase-hooks/auth';
import Authenticator from '../components/Authenticator'
import { getDatabase, ref, child, get, update } from "firebase/database";
import { isForInStatement } from '@babel/types';

export default function Battle({navigation}){
    const [showModal, setShow] = React.useState(false)
    const [level, setLevel] = React.useState(0)
    const [enemyHealth, setEnemyHealth] = React.useState(0)
    const [playerHealth, setPlayerHealth] = React.useState(0)
    const [currentEnemy, setCurrentEnemy] = React.useState("Three")
    const [playerAtk, setPlayerAtk] = React.useState(0)
    const [alvl, setAlvl] = React.useState(0)
    const [user, loading, error] = useAuthState(Authenticator.auth); 
    const enemyStats = {"Archers": [60, 80], "Orc": [60, 210], "Three": [999, 999]}
    React.useEffect(()=>{
        if(user){
            get(child(ref(Authenticator.db), `users/${user.uid}`)).then((snapshot) => {
                let xp=snapshot.val().lifeSteps
                let level=0
                while(xp>0){
                    xp-=((level+1)*(level+1)*1000)
                    level+=1
                }
                let axp=snapshot.val().lifeCals
                let atk=0
                while(axp>0){
                    axp-=((atk+1)*(atk+1)*1000)
                    atk+=1
                }
                setPlayerAtk(30+10*atk)
                setAlvl(atk)
                console.log("player level", level)
                setLevel(level)
            })
        }
    },[user])
    const DATA = [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          title: 'Vs. Band of Bandits',
          tag: "Archers",
          desc: 'Three archers block your path.',
          image: require("../images/enemy.png")
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Vs. Mega Orc',
          tag: "Orc",
          desc: 'You rest your head against a large rock to recover...but it\'s not a rock!',
          image: require("../images/enemy2.png")
        },
        {
            id: 'boss',
            title: 'Vs. Three Sisters',
            tag: "Three",
            desc: 'If you fight them, these legendary godesses will devour your soul...',
            image: require('../images/enemy3.png')
        }
      ];
      const moves = [
          {
              id: 'holystrike',
              title: 'Holy Strike',
              desc: 'A powerful melee attack which smites evil foes.',
              image: require('../images/holystrike.png')
          },
          {
              id: 'souldrain',
              title: 'Soul Drain',
              desc: "A weaker magic attack which also slightly heals you.",
              image: require('../images/souldrain.png')
          }
      ]
      const renderItem = ({ item }) => (
        <TouchableOpacity style={{padding: '5%', flexDirection: 'row', width: '80%'}} onPress={()=>{setShow(true); 
        setPlayerHealth(50+20*level); 
        setCurrentEnemy(item.tag);
        setEnemyHealth(enemyStats[item.tag][1])}}>
            <Image
              style={{ height: 100, width: 100, borderRadius: 100/2}}
              source={item.image}
              resizeMode="contain"
            />
            <View style={{flexDirection: 'column', paddingLeft: '3%'}}>
                <Text style={{fontSize: 30}}>{item.title}</Text>
                <Text style={{fontSize: 18}}>{item.desc}</Text>
            </View>
        </TouchableOpacity>
      );
      const renderMoves = ({ item }) => (
        <TouchableOpacity style={{padding: '5%', flexDirection: 'row', width: '80%'}} onPress={()=>{
            let heal=0
            if(item.id==='holystrike')
                setEnemyHealth(enemyHealth-playerAtk)
            else {
                setEnemyHealth(enemyHealth-playerAtk*0.6)
                heal=playerAtk
            }
            setPlayerHealth(playerHealth-enemyStats[currentEnemy][0]+heal)
        }}>
            <Image
              style={{ height: 70, width: 70, borderRadius: 70/2}}
              source={item.image}
              resizeMode="contain"
            />
            <View style={{flexDirection: 'column', paddingLeft: '3%'}}>
                <Text style={{fontSize: 25}}>{item.title}</Text>
                <Text style={{fontSize: 15}}>{item.desc}</Text>
            </View>
        </TouchableOpacity>
      );
      const defeatScreen = () => {
          return(<View style={{ flex: 1, backgroundColor: 'white', borderRadius: 25, alignItems: 'center' }}>
          <Text style={{margin: '5%', paddingTop: '3%', fontSize:30}}>YOU HAVE FALLEN 💀</Text>
          <Text style={{margin: '5%', paddingTop: '3%', fontSize:20}}>But your story is not over yet. Try raising your {(alvl<level)?"strength by eating more nutritious meals!":"stamina by going for regular exercises!"}</Text>
          <Button color="yellow" title="   Rise   " onPress={()=>{setShow(false)} }/>
        </View>)
      }
      const victoryScreen = () => {
          return(<View style={{ flex: 1, backgroundColor: 'white', borderRadius: 25, alignItems: 'center' }}>
          <Text style={{margin: '5%', paddingTop: '3%', fontSize:25}}>YOU ARE VICTORIOUS 🎺</Text>
          <Text style={{margin: '5%', paddingTop: '3%', fontSize:20}}>You have triumphed over evil. Now boast about your accomplishments!</Text>
          <Button color="green" title="   Celebrate   " onPress={()=>{setShow(false)} }/>
        </View>)
      }
    return (    <View style={{ flex: 1, alignItems: 'center'}}>
        <Modal isVisible={showModal} swipeDirection="down">
        {(playerHealth>0&&enemyHealth>0)?<View style={{ flex: 1, backgroundColor: 'white', borderRadius: 25, alignItems: 'center' }}>
            <Text style={{margin: '5%', paddingTop: '3%', fontWeight: 'bold', fontSize: 20}}>Fight!</Text>
            <View style={{flexDirection: 'row'}}>
                <Text style={{margin: '5%', paddingTop: '3%', paddingRight: '7%', fontWeight: 'bold', fontSize: 20}}>You {"\n"} {playerHealth}/{50+20*level}</Text>
                <Text style={{margin: '5%', paddingTop: '3%', paddingLeft: '7%', fontWeight: 'bold', fontSize: 20}}>Them {"\n"} {enemyHealth}/{enemyStats[currentEnemy][1]}</Text>
            </View>
            <Text style={{fontSize:20}}>Choose a Move:</Text>
            <FlatList
            style={{paddingTop: '10%'}}
                data={moves}
                renderItem={renderMoves}
                keyExtractor={item => item.id}
            />
            <Button color="red" title="   Flee   " onPress={()=>{setShow(false)} }/>
          </View>:((enemyHealth>0)?defeatScreen():victoryScreen())}
        </Modal>
    <View style={{paddingTop: '10%'}}>
        <Text style={{fontSize: 30, alignSelf: 'center'}}>BATTLE</Text>
        <Text style={{fontSize: 18, alignSelf: 'center'}}>Test your hard-earned equipment against dangerous foes.</Text>
    <FlatList
      style={{paddingTop: '10%'}}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View> 
</View>)
}