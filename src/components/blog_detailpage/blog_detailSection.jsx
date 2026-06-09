import IntroSection from "./intro_section";
import BlogDetailBody from "./blog_detail_body";
import WhatNext from "../what_next";
import AllEvents from "../blogs/all_events";

function BlogDetailPage({ post, relatedPosts = [], posts = [] }) {
    return (
        <>
            <IntroSection post={post} />
            <BlogDetailBody post={post} relatedPosts={relatedPosts} />
            <AllEvents posts={posts} showButton />
            <WhatNext />
        </>
    );
}

export default BlogDetailPage;
