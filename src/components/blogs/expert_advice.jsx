import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

function ExpertAdvice() {
    const { t } = useTranslation();
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch(QUERY)
            .then((data) => setBlogPosts(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!blogPosts.length) return null;

    const featuredPost = blogPosts[0];
    const sidePosts = blogPosts.slice(1, 5);

    return (
        <div className="bg-[#FFFFFF] flex flex-col justify-start items-center px-[30px] lg:px-[120px]">
            <div className="flex flex-col items-center">
                <h1 className="text-[24px] lg:text-[44px] text-[#002333] font-medium font-inter leading-[32px] lg:leading-[54px]">
                    {t('blogs.title')}
                </h1>
                <p className="text-[14px] lg:text-[16px] text-[#687276] font-normal text-center w-full lg:w-3/5 leading-[22px] lg:leading-[24px] font-inter mt-4 sm:mt-[10px] mb-0 md:mb-0">
                    {t('blogs.description')}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row md:justify-between items-start gap-8 lg:gap-12 mt-6 lg:mt-10">

                <div className="w-full lg:w-1/2 flex flex-col items-start">
                    <Link to={`/blog/${featuredPost.slug.current}`} className="w-full">
                        <img
                            src={urlFor(featuredPost.mainImage).width(800).url()}
                            alt='featured blog'
                            className='h-auto w-full mb-[8px] lg:mb-[12px] rounded-[8px] object-cover cursor-pointer hover:opacity-90 transition-opacity'
                        />
                    </Link>
                    <div className='bg-[#027B76] rounded-[100px] py-1 px-5 mb-[8px] lg:mb-[12px]'>
                        <p className='text-[14px] lg:text-[16px] text-[#FFFFFF] font-inter font-medium'>
                            {featuredPost.category}
                        </p>
                    </div>
                    <Link to={`/blog/${featuredPost.slug.current}`}>
                        <h1 className='text-[#002333] font-semibold font-inter text-[18px] lg:text-[24px] mb-[8px] lg:mb-[12px] hover:text-[#027B76] transition-colors'>
                            {featuredPost.title}
                        </h1>
                    </Link>
                    <p className='text-[14px] lg:text-[16px] text-[#687276] font-inter mb-[8px] lg:mb-[12px]'>
                        {featuredPost.about}
                    </p>
                    <Link to={`/blog/${featuredPost.slug.current}`}>
                        <p className='text-[14px] lg:text-[16px] text-[#687276] font-inter decoration-solid underline cursor-pointer hover:text-[#027B76]'>
                            Read more
                        </p>
                    </Link>
                </div>

                <div className='w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4'>
                    {sidePosts.map((post) => (
                        <Link key={post._id} to={`/blog/${post.slug.current}`} className="flex flex-col lg:flex-row items-start gap-3 hover:opacity-90 transition-opacity">
                            <div className='relative flex-shrink-0'>
                                <img
                                    src={urlFor(post.mainImage).width(400).url()}
                                    alt={post.title}
                                    className='w-full lg:w-[230px] object-cover rounded-[8px]'
                                />
                                <div className='absolute bottom-4 right-4 md:bottom-2 md:right-2 bg-[#027B76] rounded-[100px] py-1 px-4'>
                                    <p className='text-[12px] lg:text-[14px] text-[#FFFFFF] font-inter font-medium'>
                                        {post.category}
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col items-start'>
                                <h2 className='text-[#002333] font-semibold font-inter text-[16px] lg:text-[20px] mb-1 hover:text-[#027B76] transition-colors'>
                                    {post.title}
                                </h2>
                                <p className='text-[14px] lg:text-[16px] text-[#687276] font-inter leading-[20px] line-clamp-2'>
                                    {post.about}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExpertAdvice;