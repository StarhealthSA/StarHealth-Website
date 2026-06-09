import Doctorsheader from '../doctors/header/header'
import Priority from '../doctors/priorities'
import StoriesOfHope from '../doctors/stories_of_hope'
import Whatnext from '../what_next'
function doctorsSection(){

const content = "Here's how you can proceed: schedule your consultation, explore our specialities in detail, or find the information you need to make informed decisions about your care."
    return(
        <div>
            <Doctorsheader/>
            <Priority/>
            <StoriesOfHope/>
            <Whatnext text={content} />
        </div>
    )
}
export default doctorsSection;