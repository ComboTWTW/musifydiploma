import {
    Routes,
    Route,
    BrowserRouter as Router,
    Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import Profile from "./pages/Profile";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { useState } from "react";
import SearchBar from "./components/Navbar/SearchBar";
import SearchPage from "./pages/SearchPage";
import Artist from "./pages/Artist";
import Track from "./pages/TrackPage";
import TrackPage from "./pages/TrackPage";
import AlbumPage from "./pages/AlbumPage";
import SignInPage from "./pages/SignInPage";
import EmailSignUp from "./components/SignUp Page/EmailSignUp";
import { useQuery } from "@tanstack/react-query";
import { getUser, type UserT } from "./functions/firebase/getUser";
import Footer from "./components/Footer";

const App = () => {
    const [isSigned, setIsSigned] = useState<boolean | null>(null);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            setIsSigned(true);

            // Create default lists if they don't exist
        } else {
            setIsSigned(false);
        }
    });

    return (
        <div className="w-full min-h-screen overflow-hidden flex flex-col items-center bg-bgMain ">
            {isSigned !== null && (
                <Router>
                    <Navbar />
                    <div className="max-w-360 w-full px-4 flex items-center flex-col">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            {/* Sign Up Page */}
                            <Route
                                path="/signup"
                                element={
                                    isSigned === true ? (
                                        <Navigate to="/" />
                                    ) : (
                                        isSigned === false && <SignUpPage />
                                    )
                                }
                            />
                            {/* Sign In Page */}
                            <Route
                                path="/login"
                                element={
                                    isSigned === true ? (
                                        <Navigate to="/" />
                                    ) : (
                                        isSigned === false && <SignInPage />
                                    )
                                }
                            />
                            {/* Search Page */}
                            <Route path="/search?" element={<SearchPage />} />
                            {/* Artist Page */}
                            <Route path="/artist?" element={<Artist />} />
                            {/* Album Page */}
                            <Route path="/album?" element={<AlbumPage />} />
                            {/* Track Page */}
                            <Route path="/track?" element={<TrackPage />} />

                            {/* User Profile Page */}
                            <Route
                                path="/profile"
                                element={
                                    isSigned === true ? (
                                        <Profile />
                                    ) : (
                                        isSigned === false && (
                                            <Navigate to="/" />
                                        )
                                    )
                                }
                            />

                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </div>
                    <Footer />
                </Router>
            )}
        </div>
    );
};

export default App;
