import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
    return (
        <div className="w-full h-screen overflow-hidden flex flex-col items-center xl:bg-bgMain">
            <Router>
                <div className="max-w-300 w-full">
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
