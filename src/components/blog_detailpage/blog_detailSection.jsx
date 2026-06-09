import HeaderData from "../../components/blog_detailpage/header/header_data";
import BlogDetailBody from "./blog_detail_body";
import Header from "../blogs/header/header"
import WhatNext from "../what_next";
import AllEvents from "../blogs/all_events";

function BlogDetailPage() {
    return (
        <>
            <Header />
            <HeaderData />
            <BlogDetailBody />
            <AllEvents  showButton/>
            <WhatNext />
        </>
    );
}

export default BlogDetailPage;