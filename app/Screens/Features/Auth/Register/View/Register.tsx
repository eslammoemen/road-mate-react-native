import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { React, useState } from "react";
import { Colors } from "@/colors/colors";
import { fonts } from "@/fonts/fonts";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or use react-native-vector-icons
import { DataReponse } from "../../Login/Model/interfaces";
import { URLS } from "@/app/Screens/URLS";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FlashMessage, { showMessage } from "react-native-flash-message";

interface RegisterResponse {
  id: number;
  token?: string;
}
const Register = () => {
  const [secure, setSecure] = useState(true);
  const phoneRegex = /^(10|11|12|15)\d{8}$/;
  const [loading, setLoading] = useState(false);

  const [form, setFrom] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validForm, setValidForm] = useState({
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    name: false,
  });

  const registerUser = async () => {
    if (validForm.phone === false || validForm.password === false || validForm.name === false || validForm.email === false || validForm.confirmPassword === false) {
      showMessage({
        type: "danger",
        message: "Please fill all fields correctly.",
        duration: 3000,
        icon: "danger",
        floating: true,
        style: { borderRadius: 10, marginTop: 20 },
      });
      return;
    }
    setLoading(true);
    const params = {
      name: form.name,
      phone: `+20${form.phone}`,
      email: form.email,
      password: form.password,
    };
    try {
      const response = await fetch(
        `${URLS.baseURL}/api/user/register`, // Replace with your API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );
      const data: DataReponse<RegisterResponse> = await response.json();
      if (response.status === 200 && data?.data?.token) {
        await SecureStore.setItemAsync("userToken", data.data.token);
        console.log("Token stored successfully");
        router.replace("/Screens/Features/HomeTrips/View/HomeTrips");
        // Handle successful registration (e.g., navigate to another screen)
      } else {
        throw new Error(data.message || "Registration failed");
        // Handle registration failure (e.g., show error message)
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
      {Platform.OS === "ios" ? (
        <BackView />
      ) : (
        <View style={{ height: 40 }}></View>
      )}
      <FlashMessage position="top" />
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: 100,
          marginLeft: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign up</Text>
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
                !validForm.name && form.name.length > 0 ? "red" : "transparent",
            },
          ]}
        >
          <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>
            name
          </Text>
          <TextInput
            placeholder="john doe"
            style={{
              marginLeft: 15,
              fontFamily: "Poppins-Medium",
              fontSize: 14,
              flex: 1,
              paddingHorizontal: 10,
              color: Colors.secodary,
            }}
            placeholderTextColor={Colors.secodary}
            value={form.name}
            onChangeText={(text) => {
              setFrom({ ...form, name: text });
              setValidForm({
                ...validForm,
                name: text.length > 3,
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
                !validForm.confirmPassword && form.confirmPassword.length > 0
                  ? "red"
                  : "transparent",
            },
          ]}
        >
          <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}>
            confirm password
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
            value={form.confirmPassword}
            onChangeText={(text) => {
              setFrom({ ...form, confirmPassword: text });
              setValidForm({
                ...validForm,
                confirmPassword: text.length >= 8,
                confirmPassword: text === form.password,
              });
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
            onPress={registerUser}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Bold",
                fontSize: 16,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Register;
