import HeroSection from './hero_section'
import WelcomePart from './welcome_part'
import Safety from './safety'
import SpecializedServices from './specialized_services'
import MedTeam from './med_team'
import Whatnext from '../what_next'
import Mobviewform from '../mob_view_form'
import Testimonials from './testomonials'

function homesection(){

    const content = "Start by scheduling your consultation, explore our specialties for insights, or access resources to make confident and informed decisions you need."

    return(
        <div>
            <HeroSection/>
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
            <Testimonials/>
            <Whatnext text={content}/>
        </div>
    )
}

export default homesection;
