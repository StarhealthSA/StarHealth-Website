import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { client, urlFor } from '../../../sanity-client';
import { PortableText } from '@portabletext/react';

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  category,
  about,
  mainImage,
  publishedAt,
  body,
  "author": author->name
}`;

const RELATED_QUERY = `*[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...4] {
  _id,
  title,
  slug,
  category,
  mainImage
}`;

const portableTextComponents = {
    block: {
        h1: ({ children }) => <h1 className="text-[#002333] text-[28px] lg:text-[40px] font-semibold font-inter mb-3">{children}</h1>,
        h2: ({ children }) => <h2 className="text-[#002333] text-[22px] lg:text-[32px] font-semibold font-inter mb-4">{children}</h2>,
        h4: ({ children }) => <h4 className="text-[#002333] text-[18px] lg:text-[24px] font-semibold font-inter mb-1 mt-6">{children}</h4>,
        normal: ({ children }) => <p className="text-[14px] lg:text-[18px] text-[#687276] font-inter">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc ml-5 text-[16px] lg:text-[18px] text-[#687276] ">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal ml-5 text-[16px] lg:text-[18px] text-[#687276]">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li className="font-inter">{children}</li>,
        number: ({ children }) => <li className="font-inter">{children}</li>,
    },
};

function BlogDetailBody() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        Promise.all([
            client.fetch(POST_QUERY, { slug }),
            client.fetch(RELATED_QUERY, { slug })
        ])
            .then(([postData, relatedData]) => {
                setPost(postData);
                setRelatedPosts(relatedData);
            })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (!post) return null;

    return (
        <div className="bg-[#FFFFFF] flex flex-col lg:flex-row items-start px-[30px] lg:px-[120px] lg:gap-12">
            <div className="flex flex-col w-full lg:w-[80%]">
                {post.body && (
                    <PortableText value={post.body} components={portableTextComponents} />
                )}
            </div>

            <div className="hidden lg:flex flex-col items-start w-[20%]">
                <h1 className="text-[24px] text-[#002333] font-semibold font-inter mb-6 mt-6">You May Also Like</h1>
                {relatedPosts.map((related) => (
                    <Link key={related._id} to={`/blog/${related.slug.current}`} className="flex flex-col items-start gap-3 mb-4 hover:opacity-90 transition-opacity">
                        <div className='relative flex-shrink-0 w-full'>
                            <img
                                src={urlFor(related.mainImage).width(400).url()}
                                alt={related.title}
                                className='w-full object-cover rounded-[8px]'
                            />
                            <div className='absolute bottom-2 right-2 bg-[#027B76] rounded-[100px] py-1 px-4'>
                                <p className='text-[12px] lg:text-[14px] text-[#FFFFFF] font-inter font-medium'>
                                    {related.category}
                                </p>
                            </div>
                        </div>
                        <h2 className='text-[#002333] font-semibold font-inter text-[16px] mb-2 hover:text-[#027B76] transition-colors'>
                            {related.title}
                        </h2>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default BlogDetailBody;