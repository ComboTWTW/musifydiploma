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

const App = () => {
    const [isSigned, setIsSigned] = useState<boolean | null>(null);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsSigned(() => true);
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            // ...
        } else {
            // User is signed out
            // ...
            setIsSigned(() => false);
        }
    });
    return (
        <div className="w-full h-screen overflow-hidden flex flex-col items-center bg-bgMain">
            {isSigned !== null && (
                <Router>
                    <Navbar />
                    <div className="max-w-360 w-full px-4 flex items-center">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/search?" element={<SearchPage />} />

                            <Route path="/artist?" element={<Artist />} />

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
                </Router>
            )}
        </div>
    );
};

export default App;
