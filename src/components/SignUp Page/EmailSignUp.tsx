import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
    validatePassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "#E6E6EB",
    "& .MuiInputBase-input::placeholder": {
        color: "#E6E6EB",
        opacity: 0.7,
    },
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins, sans-serif",
    padding: "0 8px",
}));

const FormInputContainer = styled(Paper)(({ theme }) => ({
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 320,
    height: 45,
    borderRadius: "5px",
    backgroundColor: "#2A2A35",
    border: "solid #E6E6EB 1px",
    boxShadow: "none",
    transition: "border-color 0.2s",
    "&:focus-within": {
        borderColor: "#C0C0C5",
    },
}));

const ValidationItem = ({
    label,
    isValid,
}: {
    label: string;
    isValid: boolean;
}) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
        }}
    >
        {isValid ? (
            <CheckIcon sx={{ fontSize: 16, color: "#4caf50" }} />
        ) : (
            <CloseIcon sx={{ fontSize: 16, color: "#f44336" }} />
        )}
        <Typography
            sx={{
                fontSize: "12px",
                fontFamily: "Poppins, sans-serif",
                color: isValid ? "#4caf50" : "#f44336",
            }}
        >
            {label}
        </Typography>
    </Box>
);

const ValidationBox = ({
    title,
    requirements,
    visible,
}: {
    title: string;
    requirements: { label: string; isValid: boolean }[];
    visible: boolean;
}) => (
    <Box
        sx={{
            width: "100%",
            zIndex: 50,
        }}
    >
        <Collapse in={visible}>
            <Box
                sx={{
                    p: 1.5,
                    mb: 1.5, // Space between validation and input
                    backgroundColor: "#2A2A35",
                    borderRadius: "5px",
                    border: "1px solid #444",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    position: "relative",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-6px",
                        left: "20px",
                        width: "10px",
                        height: "10px",
                        backgroundColor: "#2A2A35",
                        borderRight: "1px solid #444",
                        borderBottom: "1px solid #444",
                        transform: "rotate(45deg)",
                    },
                }}
            >
                <Typography
                    sx={{
                        fontSize: "10px",
                        color: "#E6E6EB",
                        opacity: 0.6,
                        mb: 0.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontWeight: 600,
                    }}
                >
                    {title}
                </Typography>
                {requirements.map((req, index) => (
                    <ValidationItem
                        key={index}
                        label={req.label}
                        isValid={req.isValid}
                    />
                ))}
            </Box>
        </Collapse>
    </Box>
);

const EmailSignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);

    // Validation Logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);

    const passwordRequirements = [
        { label: "6+ characters", isValid: formData.password.length >= 6 },
        { label: "Uppercase letter", isValid: /[A-Z]/.test(formData.password) },
        { label: "Lowercase letter", isValid: /[a-z]/.test(formData.password) },
        {
            label: "At least one number",
            isValid: /[0-9]/.test(formData.password),
        },
    ];

    const isPasswordValid = passwordRequirements.every((req) => req.isValid);
    const isFormValid =
        isEmailValid && isPasswordValid && formData.name.trim().length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Validate password against Firebase Password Policy
            const status = await validatePassword(auth, formData.password);

            if (!status.isValid) {
                console.log("Password does not match requirements");

                if (!status.containsLowercaseLetter) {
                    console.log("Password must contain lowercase letter");
                }

                if (!status.containsUppercaseLetter) {
                    console.log("Password must contain uppercase letter");
                }

                if (!status.containsNumericCharacter) {
                    console.log("Password must contain number");
                }

                if (!status.meetsMinPasswordLength) {
                    console.log("Password is too short");
                }

                return;
            }

            // Create user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password,
            );

            // Optional: set display name
            await updateProfile(userCredential.user, {
                displayName: formData.name,
            });

            window.location.href = "/profile";
        } catch (error: any) {
            console.error(error);

            if (error.code === "auth/email-already-in-use") {
                console.log("Email already in use");
            }

            if (error.code === "auth/invalid-email") {
                console.log("Invalid email");
            }

            if (error.code === "auth/weak-password") {
                console.log("Weak password");
            }
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "100%",
            }}
        >
            <FormInputContainer>
                <StyledInputBase
                    name="name"
                    placeholder="Name..."
                    value={formData.name}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "name" }}
                />
            </FormInputContainer>

            {/* EMAIL INPUT WITH TOP VALIDATION */}
            <Box sx={{ position: "relative", width: 320 }}>
                <ValidationBox
                    title="Email Format"
                    requirements={[
                        { label: "Valid email format", isValid: isEmailValid },
                    ]}
                    visible={isEmailTouched && !isEmailValid}
                />
                <FormInputContainer>
                    <StyledInputBase
                        name="email"
                        type="email"
                        placeholder="Email..."
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => setIsEmailTouched(true)}
                        inputProps={{ "aria-label": "email" }}
                    />
                </FormInputContainer>
            </Box>

            {/* PASSWORD INPUT WITH TOP VALIDATION */}
            <Box sx={{ position: "relative", width: 320 }}>
                <ValidationBox
                    title="Password Requirements"
                    requirements={passwordRequirements}
                    visible={isPasswordTouched && !isPasswordValid}
                />
                <FormInputContainer>
                    <StyledInputBase
                        name="password"
                        type="password"
                        placeholder="Password..."
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => setIsPasswordTouched(true)}
                        inputProps={{ "aria-label": "password" }}
                    />
                </FormInputContainer>
            </Box>

            <Button
                type="submit"
                fullWidth
                sx={{
                    mt: 1,
                    height: 45,
                    width: 320,
                    backgroundColor: "#E6E6EB",
                    color: "#1E1E26",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    borderRadius: "5px",
                    textTransform: "none",
                    fontSize: "16px",
                    "&:hover": {
                        backgroundColor: "#C0C0C5",
                    },
                    "&.Mui-disabled": {
                        backgroundColor: "#2A2A35",
                        color: "#666",
                        border: "1px solid #3f3f4d",
                    },
                }}
            >
                Sign Up
            </Button>
        </Box>
    );
};

export default EmailSignUp;
