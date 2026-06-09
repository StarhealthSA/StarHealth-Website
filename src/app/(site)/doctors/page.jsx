import DoctorsListSection from '@/components/doctors/doctors_list_section';
import Priority from '@/components/doctors/priorities';
import StoriesOfHope from '@/components/doctors/stories_of_hope';
import Whatnext from '@/components/what_next';

export default function DoctorsPage() {
  const content =
    "Here's how you can proceed: schedule your consultation, explore our specialities in detail, or find the information you need to make informed decisions about your care.";

  return (
    <div>
      <DoctorsListSection />
      <Priority />
      <StoriesOfHope />
      <Whatnext text={content} />
    </div>
  );
}
