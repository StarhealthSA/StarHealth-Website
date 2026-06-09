'use client';

import { urlFor } from '@/lib/sanity';

function IntroSection({ post }) {
    if (!post) return null;

    return (
        <section className="bg-[#F6F4F3] flex flex-col md:flex-row items-start md:items-center px-[30px] lg:px-[120px] py-10">
            <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-5 lg:gap-12">
                <img
                    src={urlFor(post.mainImage).width(1000).url()}
                    alt={post.title}
                    className='h-auto md:h-[350px] w-full md:w-1/2 mb-[8px] lg:mb-[12px] rounded-[8px] object-cover'
                />
                <div className="flex flex-col items-start">
                    <div className='bg-[#027B76] rounded-[100px] py-1 px-5 mb-[8px] lg:mb-[12px]'>
                        <p className='text-[14px] lg:text-[16px] text-[#FFFFFF] font-inter font-medium'>
                            {post.category}
                        </p>
                    </div>
                    <h1 className='text-[#002333] font-semibold font-inter text-[18px] lg:text-[32px] mb-[8px] lg:mb-[12px]'>
                        {post.title}
                    </h1>
                    <p className='text-[14px] lg:text-[16px] text-[#687276] font-inter mb-[8px] lg:mb-[12px]'>
                        {post.about}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default IntroSection;
