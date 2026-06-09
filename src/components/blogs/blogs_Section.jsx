import WhatNext from "../what_next";
import AllEvents from "./all_events";
import ExpertAdvice from "./expert_advice";

function BlogsSection({ posts = [] }) {
    return (
        <div>
            <ExpertAdvice posts={posts} />
            <AllEvents posts={posts} />
            <WhatNext/>
        </div>
    );
}

export default BlogsSection;
