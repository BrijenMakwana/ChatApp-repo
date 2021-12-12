import React, { useLayoutEffect, useState } from "react";
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
import { auth, db } from "../firebase";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

export default function AddChatScreen({ navigation }) {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Input
        placeholder="Enter a Chat Name"
        autoFocus
        type="text"
        onChangeText={(text) => setInput(text)}
        value={input}
        leftIcon={<AntDesign name="wechat" size={24} color="#003B46" />}
        onSubmitEditing={createChat}
      />
      <Button
        title="Create New Chat"
        containerStyle={styles.button}
        titleStyle={{ color: "white" }}
        type="outline"
        onPress={createChat}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    height: "100%",
  },
  button: {
    backgroundColor: "#003B46",
    color: "white",
    width: 200,
    marginTop: 10,
  },
});
