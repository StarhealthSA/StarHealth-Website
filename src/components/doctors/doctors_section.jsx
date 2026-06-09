import DoctorsListSection from './doctors_list_section'
import Priority from './priorities'
import StoriesOfHope from './stories_of_hope'
import Whatnext from '../what_next'

function doctorsSection(){

const content = "Here's how you can proceed: schedule your consultation, explore our specialities in detail, or find the information you need to make informed decisions about your care."
    return(
        <div>
            <DoctorsListSection/>
            <Priority/>
            <StoriesOfHope/>
            <Whatnext text={content} />
        </div>
    )
}
export default doctorsSection;
