import Contactform from './contact_form_section';
import Faqsection from './faq_section';
import IntroSection from './intro_section';
import Mobileviewform from './mobile_form_section';
import WhatNext from '../what_next';

function ContactUs() {

    return (
        <div>
            <IntroSection />
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
