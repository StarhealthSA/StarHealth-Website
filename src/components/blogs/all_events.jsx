'use client';

import Link from 'next/link';
import Button from '../web_button';
import { urlFor } from '@/lib/sanity';
import Reveal, { staggerDelay } from '../reveal';

function AllEvents({ posts = [], showButton = false }) {
    if (!posts.length) return null;

    return (
        <div className="py-[15px] lg:py-[80px] px-[30px] lg:px-[120px]">
            <Reveal>
              <h2 className="mb-6 text-lg font-semibold text-gray-800">All Events & News</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
                {posts.map((post, index) => (
                    <Reveal key={post._id} delay={staggerDelay(index, 70)}>
                    <Link href={`/blog/${post.slug.current}`} className="block hover:opacity-90 transition-opacity">
                        <div className='relative flex-shrink-0'>
                            <img
                                src={urlFor(post.mainImage).width(400).url()}
                                alt={post.title}
                                className='w-full object-cover rounded-[8px]'
                            />
                            <div className='absolute bottom-4 right-4 md:bottom-2 md:right-2 bg-[#027B76] rounded-[100px] py-1 px-4'>
                                <p className='text-[12px] lg:text-[14px] text-[#FFFFFF] font-inter font-medium'>
                                    {post.category}
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col items-start mt-2 lg:mt-6'>
                            <h2 className='text-[#002333] font-semibold font-inter text-[16px] lg:text-[20px] hover:text-[#027B76] transition-colors'>
                                {post.title}
                            </h2>
                        </div>
                    </Link>
                    </Reveal>
                ))}
            </div>

            {showButton && (
                <Reveal className="mt-8 flex flex-row justify-center">
                    <Link href="/blogs">
                        <Button text="View All" />
                    </Link>
                </Reveal>
            )}
        </div>
    );
}

export default AllEvents;
