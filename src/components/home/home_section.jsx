import Topnav from '../top_nav'
import Header from '../home/header/header'
import WelcomePart from '../home/welcome_part'
import Safety from '../home/safety'
import SpecializedServices from '../home/specialized_services'
import Whyus from '../home/whyus'
import MedTeam from '../home/med_team'
import Footer from '../footer'
import Whatnext from '../what_next'
import Mobviewform from '../mob_view_form'
import Testimonials from './testomonials'
import AllEvents from '../blogs/all_events'

function homesection(){

    const content = "Start by scheduling your consultation, explore our specialties for insights, or access resources to make confident and informed decisions you need."

    return(
        <div>
            <Topnav/>
            <Header/>
            <div className='sm:hidden'>
                <Mobviewform/>
            </div>
            <div id='about'>
                <WelcomePart/>
            </div>
            <Safety/>
            <div id='services'>
                <SpecializedServices/>
            </div>
            <MedTeam/>
            {/* <Whyus/> */}
            <Testimonials/>
            {/* <AllEvents showButton/> */}
            <Whatnext text={content}/>
            <Footer/>
        </div>
    )
}

export default homesection;