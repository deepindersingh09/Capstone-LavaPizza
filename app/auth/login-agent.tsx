// app/auth/login-agent.tsx - Agent Login Page
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function LoginAgent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Enter both email & password");
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert("Invalid Email", "Enter a valid email");
      return;
    }

    setBusy(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Directly navigate to agent dashboard
      Alert.alert("Welcome Back!", `Logged in as ${cred.user.email}`, [
        {
          text: "OK",
          onPress: () => router.replace("/agent/dashboard"),
        },
      ]);
    } catch (e: any) {
      let msg = "Unable to sign in. Please try again.";

      if (e.code === "auth/user-not-found") {
        msg = "No account found with this email. Please sign up first.";
      } else if (e.code === "auth/wrong-password") {
        msg = "Incorrect password. Please try again.";
      } else if (e.code === "auth/invalid-email") {
        msg = "Invalid email format.";
      } else if (e.code === "auth/user-disabled") {
        msg = "This account has been disabled.";
      } else if (e.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please try again later or reset your password.";
      } else if (e.code === "auth/invalid-credential") {
        msg = "Invalid email or password. Please check your credentials.";
      } else if (e.code === "auth/network-request-failed") {
        msg = "Network error. Please check your internet connection.";
      }

      Alert.alert("Sign In Failed", msg);
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Enter Email", "Enter your email address first");
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert("Invalid Email", "Enter a valid email");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert("Email Sent", "Check your inbox for password reset link");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send reset email");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.header}>
            <Ionicons name="bicycle" size={48} color="#f8a831" style={{ marginBottom: 8 }} />
            <Text style={styles.title}>Agent Login 🚴</Text>
            <Text style={styles.subtitle}>Sign in to start delivering</Text>
          </View>

          {/* Email */}
          <View style={[styles.inputWrap, emailFocused && styles.focusWrap]}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              editable={!busy}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputWrap, passwordFocused && styles.focusWrap]}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 40 }]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              editable={!busy}
            />
            <TouchableOpacity style={styles.eye} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.btn, busy && styles.disabled]}
            disabled={busy}
            onPress={handleLogin}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign In as Agent</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Link href="/auth/signup-delivery" style={styles.link}>
                Sign Up as Agent
              </Link>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffdf0" },
  scroll: { padding: 24, paddingTop: 60 },

  logo: {
    width: 160,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },

  header: { alignItems: "center", marginBottom: 28 },
  title: { fontSize: 28, fontWeight: "900", color: "#1a1a1a" },
  subtitle: { fontSize: 15, color: "#555", marginTop: 4 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#f8a831",
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 14,
  },
  focusWrap: {
    borderColor: "#FFC107",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#1A1A1A" },
  eye: { position: "absolute", right: 14 },

  forgot: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: "#f8a831", fontWeight: "600", fontSize: 14 },

  btn: {
    backgroundColor: "#f8a831",
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginBottom: 18,
  },
  disabled: { opacity: 0.6 },
  btnText: { fontSize: 17, fontWeight: "800", color: "#111" },

  footer: { marginTop: 22, alignItems: "center", paddingBottom: 10 },
  footerText: { fontSize: 15, color: "#444" },
  link: { fontWeight: "900", color: "#f8a831" },
});
