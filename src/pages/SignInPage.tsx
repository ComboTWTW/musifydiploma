import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db, googleProvider } from "../config/firebase";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import EmailSignUp from "../components/SignUp Page/EmailSignUp";
import EmailSignIn from "../components/SignInPage/EmailSignIn";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignInPage = () => {
    // Google sign up
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const user = result.user;

            const userRef = doc(db, "Users", user.uid);
            const userSnap = await getDoc(userRef);

            // create only if user doesn't exist yet
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    id: user.uid,

                    // profile
                    name: user.displayName || "",
                    email: user.email || "",
                    photoURL: user.photoURL || "",

                    role: "user", // user | moderator | admin
                    status: "",

                    // social
                    followers: [],
                    following: [],

                    // profile comments
                    comments: [],

                    // private messsages metadata
                    conversations: [],

                    // activity feed
                    activity: [],

                    // lists
                    lists: [
                        {
                            id: crypto.randomUUID(),
                            name: "Favorites",
                            visibility: "private",
                            createdAt: new Date(),

                            items: [],
                        },
                        {
                            id: crypto.randomUUID(),
                            name: "Listen Later",
                            visibility: "private",
                            createdAt: new Date(),

                            items: [],
                        },
                    ],

                    createdAt: new Date(),
                });
            }

            window.location.href = "/profile";
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box className="w-full min-h-screen flex flex-col items-center py-20 gap-8">
            <Typography
                variant="h4"
                sx={{
                    color: "#E6E6EB",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    textAlign: "center",
                }}
            >
                Login with Email
            </Typography>
            {/* Sign In With Email Component */}
            <EmailSignIn />

            <Typography
                variant="h5"
                sx={{
                    color: "#E6E6EB",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    mt: 2,
                }}
            >
                Or Continue With Google
            </Typography>

            {/* Google Sign In Button */}
            <Button
                onClick={signInWithGoogle}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    alignItems: "center",
                    backgroundColor: "#E6E6EB",
                    width: 320,
                    height: 45,
                    borderRadius: "5px",
                    cursor: "pointer",
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "#C0C0C5",
                    },
                }}
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google Logo"
                    style={{ width: 24 }}
                />
                <Typography
                    sx={{
                        color: "#1E1E26",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                    }}
                >
                    Sign Up With Google
                </Typography>
            </Button>
        </Box>
    );
};

export default SignInPage;
