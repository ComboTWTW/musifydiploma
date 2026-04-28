import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Navbar from "./components/Navbar";

const App = () => {
    return (
        <div className="w-full h-screen overflow-hidden flex flex-col items-center bg-bgMain">
            <Router>
                <Navbar />
                <div className="max-w-360 w-full px-4">
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;
