import Header from "./header/header";
import WhatNext from "../what_next";
import AllEvents from "./all_events";
import ExpertAdvice from "./expert_advice";

function BlogsSection() {
    return (
        <div>
            <Header/>
            <ExpertAdvice/>
            <AllEvents/>
            <WhatNext/>
        </div>
    );
}
export default BlogsSection;