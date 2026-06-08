import Footer from "../footer";
import Header from "./header/header";
import Topnav from "../top_nav";
import WhatNext from "../what_next";
import AllEvents from "./all_events";
import ExpertAdvice from "./expert_advice";

function BlogsSection() {
    return (
        <div>
            <Topnav/>
            <Header/>
            <ExpertAdvice/>
            <AllEvents/>
            <WhatNext/>
            <Footer/>
        </div>
    );
}
export default BlogsSection;