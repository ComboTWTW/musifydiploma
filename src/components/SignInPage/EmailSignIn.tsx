import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { signInWithEmailAndPassword } from "firebase/auth";
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

const EmailSignIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Clear error when user starts typing
        if (error) setError(null);

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password,
            );

            window.location.href = `/profile?section=overview&id=${auth.currentUser?.uid}`;
        } catch (err: any) {
            console.error(err);
            setLoading(false);

            switch (err.code) {
                case "auth/invalid-email":
                    setError("Invalid email format");
                    break;
                case "auth/invalid-credential":
                    setError("Invalid email or password");
                    break;
                case "auth/user-not-found":
                    setError("User not found");
                    break;
                case "auth/wrong-password":
                    setError("Wrong password");
                    break;
                case "auth/too-many-requests":
                    setError("Too many attempts. Please try again later");
                    break;
                default:
                    setError("Something went wrong. Please try again");
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
                    name="email"
                    type="email"
                    placeholder="Email..."
                    value={formData.email}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "email" }}
                    required
                />
            </FormInputContainer>

            <FormInputContainer>
                <StyledInputBase
                    name="password"
                    type="password"
                    placeholder="Password..."
                    value={formData.password}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "password" }}
                    required
                />
            </FormInputContainer>

            <Box sx={{ width: 320, mt: 0.5 }}>
                <Collapse in={Boolean(error)}>
                    <Typography
                        sx={{
                            color: "#f44336",
                            fontSize: "13px",
                            fontFamily: "Poppins, sans-serif",
                            textAlign: "center",
                            mb: 1,
                        }}
                    >
                        {error}
                    </Typography>
                </Collapse>

                <Button
                    type="submit"
                    disabled={loading}
                    fullWidth
                    sx={{
                        height: 45,
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
                        },
                    }}
                >
                    {loading ? "Logging in..." : "Log In"}
                </Button>
            </Box>
        </Box>
    );
};

export default EmailSignIn;
