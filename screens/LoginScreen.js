import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Button,Input, Image } from 'react-native-elements';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { auth } from '../firebase';


export default function LoginScreen({navigation}) {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    useEffect(()=>{
     const unsubscribe = auth.onAuthStateChanged((authUser)=>{
        if(authUser){
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      });

      return unsubscribe;
    },[])

    const signIn = () =>{
      auth.signInWithEmailAndPassword(email,password).catch((error)=>alert(error));
    }

  return (
    
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar style="light"/>
        <Image source={{
            uri:"http://techbruce.com/wp-content/uploads/2021/12/chat.png"
        }}
        style={{width:150,height:150}}
        />
        <View style={styles.inputContainer}>
            <Input 
                placeholder="Email" 
                autoFocus
                type="email" 
                onChangeText={(text)=>setEmail(text)} 
                value={email}
                leftIcon={
                  <AntDesign name="mail" size={24} color="#003B46" />
              }/>
            <Input 
                placeholder="Password" 
                secureTextEntry 
                type="password" 
                onChangeText={(text)=>setPassword(text)} 
                value={password}
                onSubmitEditing={signIn}
                leftIcon={
                  <AntDesign name="eyeo" size={24} color="#003B46" />
              }/>
        </View>
        <Button 
            title="Login" 
            containerStyle={styles.button} 
            titleStyle={{color:"white"}} 
            type="outline"
            onPress={signIn}
            />
        <Button 
            title="Register" 
            containerStyle={{width:200,marginTop:10}} 
            titleStyle={{color:"#003B46"}} 
            type="outline"
            onPress={()=>navigation.navigate('Register')}
            />

        <View style={{height:100}}></View>
    </KeyboardAvoidingView>
    
    
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    padding:10,
    backgroundColor:"white"
    },
  inputContainer: {
    width:300,
    marginTop:10
  },
  button:{
      backgroundColor:"#003B46",
      color:"white",
      width:200,
      marginTop:10
  }
});
