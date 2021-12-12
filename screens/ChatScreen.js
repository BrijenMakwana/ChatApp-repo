import React, { useLayoutEffect, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  Keyboard,
  LogBox,
} from "react-native";
import { ListItem, Avatar, Text } from "react-native-elements";
import { AntDesign, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import firebase from "firebase/compat/app";

export default function ChatScreen({ navigation, route }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: messages[messages.length - 1]?.data.photoURL,
            }}
          />
          <Text style={{ color: "white", fontWeight: "bold", marginLeft: 10 }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <TouchableOpacity style={{ marginRight: 30 }}>
            <AntDesign name="videocamera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth?.currentUser?.displayName,
      email: auth?.currentUser?.email,
      photoURL: auth?.currentUser?.photoURL,
    });

    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    LogBox.ignoreAllLogs();
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : -200}
      >
        <>
          <ScrollView>
            {messages.map(({ id, data }) =>
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.receiver}>
                  <Text style={styles.receiverText}>{data.message}</Text>
                  <Text style={styles.receiverName}>{data.displayName}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            )}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput
              placeholder="Enter Message"
              style={styles.textInput}
              onChangeText={(text) => setInput(text)}
              value={input}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#003B46" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4DFE6",
  },
  receiver: {
    padding: 15,
    backgroundColor: "#07575B",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    marginTop: 10,
  },
  receiverText: {
    color: "white",
    fontWeight: "500",
  },
  senderText: {
    color: "black",
    fontWeight: "500",
  },
  senderName: {
    color: "black",
    fontSize: 10,
    marginTop: 5,
  },
  receiverName: {
    color: "white",
    fontSize: 10,
    marginTop: 5,
  },
  sender: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    color: "grey",
    borderRadius: 30,
  },
});
