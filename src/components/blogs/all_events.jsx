'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../web_button';
import { client, urlFor } from '../../../sanity-client';

const QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  category,
  about,
  mainImage,
  publishedAt,
  "author": author->name
}`;

function AllEvents({ showButton = false }) {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch(QUERY)
            .then((data) => setBlogPosts(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!blogPosts.length) return null;

    return (
        <div className="py-[15px] lg:py-[80px] px-[30px] lg:px-[120px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">All Events & News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                {blogPosts.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug.current}`} className="hover:opacity-90 transition-opacity">
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
                ))}
            </div>

            {showButton && (
                <div className="mt-8 flex flex-row justify-center">
                    <Link href="/blogs">
                        <Button text="View All" />
                    </Link>
                </div>
            )}
        </div>
    );
}

export default AllEvents;