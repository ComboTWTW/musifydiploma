import React from "react";
import Hero from "../components/Home/Hero";

const Home = () => {
    return (
        <div className="w-full flex flex-col items-center ">
            <div className="w-full flex mt-20 flex-col">
                <Hero />
            </div>
        </div>
    );
};

export default Home;
