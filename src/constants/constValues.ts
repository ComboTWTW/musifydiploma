export const navLinks: { id: string; path: string; title: string }[] = [
    {
        id: "Home",
        path: "/",
        title: "Home",
    },
    {
        id: "Popular",
        path: "/popular",
        title: "Popular",
    },
    {
        id: "AboutUs",
        path: "/about",
        title: "About Us",
    },
];

export const navbarButtons: { id: string; title: string; path: string }[] = [
    {
        id: "signup",
        title: "Sign Up",
        path: "/signup",
    },
    {
        id: "login",
        title: "Log In",
        path: "/login",
    },
];

export const heroText: {
    subHeader: string;
    buttonText: string;
    buttonPath: string;
} = {
    subHeader:
        "Discover artists, albums and lyrics, track your listening history, and get personalized recommendations — all in one place, without relying on streaming services.",
    buttonText: "Get Started!",
    buttonPath: "/signup",
};

export const profileSideBarLinks: { title: string; linkTo: string }[] = [
    {
        title: "overview",
        linkTo: "overview",
    },
    {
        title: "My Lists",
        linkTo: "myLists",
    },
    {
        title: "History",
        linkTo: "history",
    },
    {
        title: "followers",
        linkTo: "followers",
    },
    {
        title: "following",
        linkTo: "following",
    },
    {
        title: "settings",
        linkTo: "settings",
    },
];
