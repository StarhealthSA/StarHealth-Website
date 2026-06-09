import Contactform from './header/contact_form';
import Faqsection from './faq_section';
import Header from './header/header';
import Headerdata from './header/header_data';
import Mobileviewform from './header/mobile_view_form';
import WhatNext from '../what_next';

function ContactUs() {

    return (
        <div>
            <Header />
            <Headerdata />
            <div className='hidden md:block'>
                <Contactform />
            </div>
            <div className='block sm:hidden'>
                <Mobileviewform />
            </div>
            <Faqsection />
            <WhatNext />
        </div>
    )
}

export default ContactUs; 