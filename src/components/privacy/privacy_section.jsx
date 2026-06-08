import Header from "./header/header"
import Footer from "../footer";
import Topnav from "../top_nav";
import PrivacyContent from "./privacy_content";

function PrivacySection() {
    return (
        <div>
            <Topnav />
            <Header />
            <PrivacyContent />
            <Footer />
        </div>
    )
}

export default PrivacySection;