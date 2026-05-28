import React from "react";
import Hero from "../components/Home/Hero";
import SubHero from "../components/Home/SubHero";

const Home = () => {
    return (
        <div className="w-full flex flex-col items-center ">
            <div className="w-full flex mt-20 flex-col">
                <Hero />
                <SubHero />
            </div>
        </div>
    );
};

export default Home;
