import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { React, useState, useEffect } from "react";
import { Colors } from "@/colors/colors";
import { fonts } from "@/fonts/fonts";
import { Ionicons } from "@expo/vector-icons"; // or use react-native-vector-icons
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeString } from "../../../../Models/storage"; // Adjust the import path as necessary
import { LoginResponse, DataReponse } from "../Model/interfaces";
import { URLS } from "@/app/Screens/URLS";
import * as SecureStore from "expo-secure-store";
import { showMessage } from "react-native-flash-message";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const phoneRegex = /^(10|11|12|15)\d{8}$/;

  const [form, setFrom] = useState({
    phone: "",
    password: "",
  });
  const [validForm, setValidForm] = useState({
    phone: false,
    password: false,
  });

  const loginuser = async () => {
    if (validForm.phone === false || validForm.password === false) {
      showMessage({
        type: "danger",
        message: "Please enter valid phone and password (min 8 characters).",
        duration: 3000,
        icon: "danger",
        floating: true,
        style: { borderRadius: 10, marginTop: 20 },
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${URLS.baseURL}/api/user/login`, // Replace with your API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: `+20${form.phone}`, password: form.password }),
        }
      );
      const data: DataReponse<LoginResponse> = await response.json();
      console.log("Login response data:", data);
      if (response.status === 200 && data?.data?.token) {
        await SecureStore.setItemAsync("userToken", data.data.token);
        // await storeString(data.data.token, "userToken");
        router.replace("/Screens/Features/HomeTrips/View/HomeTrips");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      showMessage({
        type: "danger",
        message: error instanceof Error ? error.message : String(error),
        duration: 3000,
        icon: "danger",
        floating: true,
        style: { borderRadius: 10, marginTop: 20 },
      });
    } finally {
      setLoading(false);
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
                !validForm.phone && form.phone.length > 0
                  ? "red"
                  : "transparent",
            },
          ]}
        >
          <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>
            phone
          </Text>
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              marginLeft: 5,
            }}
          >
            +20
          </Text>
          <TextInput
            placeholder="10|11|12|15xxxxxxxx"
            style={{
              marginLeft: 15,
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              flex: 1,
              paddingHorizontal: 10,
              color: Colors.secodary,
            }}
            placeholderTextColor={Colors.secodary}
            value={form.phone}
            keyboardType="phone-pad"
            onChangeText={(text) => {
              setFrom({ ...form, phone: text });
              setValidForm({
                ...validForm,
                phone: phoneRegex.test(text),
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
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 30, marginHorizontal: 20 }}
          size="large"
          color={Colors.primary}
        />
      ) : (
        <TouchableOpacity
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
        </TouchableOpacity>
      )}
      <View style={{ marginLeft: 20, marginTop: 40 }}>
        <Text
          style={{
            marginTop: 20,
            marginBottom: 0,
          }}
        >
          dotn't have an account
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/Screens/Features/Auth/Register/View/Register");
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              marginTop: 0,
              textDecorationLine: "underline",
              fontFamily: "Poppins-Bold",
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
