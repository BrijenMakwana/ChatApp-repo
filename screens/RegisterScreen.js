import React, { useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Input, Image, Text } from "react-native-elements";
import { auth } from "../firebase";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageUrl ||
            "http://techbruce.com/wp-content/uploads/2021/12/chat.png",
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 20, color: "#003B46" }}>
        Create New Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          type="text"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <Input
          placeholder="Email"
          type="email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <Input
          placeholder="Image"
          type="text"
          onChangeText={(text) => setImageUrl(text)}
          value={imageUrl}
          onSubmitEditing={register}
        />
      </View>

      <Button
        title="Register"
        containerStyle={{ width: 200, marginTop: 10 }}
        titleStyle={{ color: "#003B46" }}
        type="outline"
        raised
        onPress={register}
      />

      <View style={{ height: 100 }}></View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
    marginTop: 10,
  },
});
