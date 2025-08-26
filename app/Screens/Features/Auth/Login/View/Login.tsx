import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { React, useState, useEffect } from "react";
import { Colors } from "@/colors/colors";
import { fonts } from "@/fonts/fonts";
import { Ionicons } from "@expo/vector-icons"; // or use react-native-vector-icons
import bcrypt from "bcryptjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { store } from "../../../../firebase";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeString } from "../../../../Models/storage"; // Adjust the import path as necessary
import { LoginResponse, DataReponse } from "../Model/interfaces";
import { URLS } from "@/app/Screens/URLS";
import * as SecureStore from "expo-secure-store"
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [form, setFrom] = useState({
    email: "",
    password: "",
  });
  const [validForm, setValidForm] = useState({
    email: false,
    password: false,
  });

  const loginuser = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${URLS.baseURL}/api/user/login`, // Replace with your API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: form.email, password: form.password}),
        }
      );
      const data: DataReponse<LoginResponse> = await response.json()
      console.log("Login response data:", data);
      if (data.data.token !== undefined) {
        await SecureStore.setItemAsync("userToken", data.data.token);
        // await storeString(data.data.token, "userToken");
        router.replace("/Screens/Features/HomeTrips/View/HomeTrips");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: 100,
          marginLeft: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign in</Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          marginHorizontal: 20,
          gap: 20,
          marginTop: 50,
        }}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.highlight,
              borderRadius: 8,
              height: 45,
              paddingHorizontal: 10,
              borderWidth: 0.7,
              borderColor:
                !validForm.email && form.email.length > 0
                  ? "red"
                  : "transparent",
            },
          ]}
        >
          <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>
            email
          </Text>
          <TextInput
            placeholder="email@example.com"
            style={{
              marginLeft: 15,
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              flex: 1,
              paddingHorizontal: 10,
              color: Colors.secodary,
            }}
            placeholderTextColor={Colors.secodary}
            value={form.email}
            onChangeText={(text) => {
              setFrom({ ...form, email: text });
              setValidForm({
                ...validForm,
                email: text.includes("@") && text.includes("."),
              });
            }}
          ></TextInput>
        </View>

        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.highlight,
              borderRadius: 8,
              height: 45,
              paddingHorizontal: 10,
              borderWidth: 0.7,
              borderColor:
                !validForm.password && form.password.length > 0
                  ? "red"
                  : "transparent",
            },
          ]}
        >
          <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>
            password
          </Text>
          <TextInput
            placeholder="a14iz^d!ms"
            style={{
              marginLeft: 15,
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              flex: 1,
              paddingHorizontal: 10,
              color: Colors.secodary,
            }}
            placeholderTextColor={Colors.secodary}
            secureTextEntry={secure}
            value={form.password}
            onChangeText={(text) => {
              setFrom({ ...form, password: text });
              setValidForm({ ...validForm, password: text.length >= 8 });
            }}
          ></TextInput>
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off" : "eye"}
              size={18}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (<ActivityIndicator style={{marginTop: 30, marginHorizontal: 20}} size="large" color={Colors.primary} />) : (<TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          borderRadius: 8,
          height: 45,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 30,
        }}
        onPress={loginuser}
      >
        <Text
          style={{ color: "white", fontFamily: "Poppins-Bold", fontSize: 16 }}
        >
          Login
        </Text>
      </TouchableOpacity>)}
      
    </SafeAreaView>
  );
};

export default Login;
