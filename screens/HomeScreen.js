import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Image, Text, Avatar } from "react-native-elements";
import CustomListItem from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { SpeedDial } from "react-native-elements";

export default function HomeScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Vacta",
      headerLeft: () => (
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={signOutUser}>
            <Avatar
              rounded
              source={{
                uri: auth?.currentUser?.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <TouchableOpacity style={{ marginRight: 30 }}>
            <AntDesign name="camerao" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
            <SimpleLineIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            id={id}
            chatName={chatName}
            key={id}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
      <SpeedDial
        style={{ marginBottom: 30, marginRight: 10 }}
        isOpen={open}
        icon={{ name: "edit", color: "white" }}
        openIcon={{ name: "close", color: "white" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
        color="#003B46"
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "white" }}
          title="Add"
          onPress={() => {
            setOpen(!open);
            navigation.navigate("AddChat");
          }}
          color="#003B46"
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "white" }}
          title="Delete"
          onPress={() => console.log("Delete Something")}
          color="#003B46"
        />
      </SpeedDial>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
