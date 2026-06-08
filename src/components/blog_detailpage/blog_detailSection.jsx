import HeaderData from "../../components/blog_detailpage/header/header_data";
import BlogDetailBody from "./blog_detail_body";
import Topnav from "../top_nav";
import Header from "../blogs/header/header"
import WhatNext from "../what_next";
import Footer from "../footer";
import AllEvents from "../blogs/all_events";

function BlogDetailPage() {
    return (
        <>
            <Topnav />
            <Header />
            <HeaderData />
            <BlogDetailBody />
            <AllEvents  showButton/>
            <WhatNext />
            <Footer />
        </>
    );
}

export default BlogDetailPage;