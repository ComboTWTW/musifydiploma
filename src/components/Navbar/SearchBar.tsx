import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "#E6E6EB", // Set text color
    "& .MuiInputBase-input::placeholder": {
        color: "#E6E6EB", // Set placeholder color
        opacity: 1, // Ensure placeholder is not transparent
    },
}));

const SearchBar = () => {
    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 280,
                height: 32,
                borderRadius: "8px",
                backgroundColor: "#2A2A35",
                border: "solid #E6E6EB 1px",
            }}
        >
            <StyledInputBase
                sx={{
                    m: 1,
                    flex: 1,
                    fontSize: 16,
                    fontFamily: "Poppins, sans-serif",
                }}
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
            />
            <IconButton
                type="submit"
                sx={{ p: "5px", color: "#E6E6EB" }}
                aria-label="search"
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;
