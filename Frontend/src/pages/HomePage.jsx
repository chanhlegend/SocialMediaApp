import { useState } from "react"

const HomePage = () => {
    const [likedPosts, setLikedPosts] = useState(new Set())

    const toggleLike = (postId) => {
        const newLikedPosts = new Set(likedPosts)
        if (newLikedPosts.has(postId)) {
            newLikedPosts.delete(postId)
        } else {
            newLikedPosts.add(postId)
        }
        setLikedPosts(newLikedPosts)
    }

    const posts = [
        {
            id: 1,
            username: "alice_wonder",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
            timeAgo: "2h",
            content: "Just finished my latest digital art piece! What do you think? 🎨",
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
            likes: 234,
            comments: 18,
            shares: 5,
        },
        {
            id: 2,
            username: "bob_creative",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            timeAgo: "4h",
            content: "Beautiful sunset from my balcony today. Nature never fails to amaze me! 🌅",
            image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=400&fit=crop",
            likes: 156,
            comments: 12,
            shares: 8,
        },
        {
            id: 3,
            username: "carol_artist",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            timeAgo: "6h",
            content: "Working on a new sculpture series. Here's a sneak peek of the process! ✨",
            image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=400&fit=crop",
            likes: 89,
            comments: 7,
            shares: 3,
        },
    ]

    return (
        <>
            {/* Posts Feed */}
            <div className="space-y-4 sm:space-y-6">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-200/30 overflow-hidden"
                    >
                        {/* Post Header */}
                        <div className="p-3 sm:p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <img
                                    src={post.avatar}
                                    alt={post.username}
                                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-purple-900 text-sm sm:text-base">{post.username}</h3>
                                    <p className="text-xs sm:text-sm text-purple-600">{post.timeAgo}</p>
                                </div>
                            </div>
                            <button className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Post Content */}
                        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
                            <p className="text-purple-900 text-sm sm:text-base">{post.content}</p>
                        </div>

                        {/* Post Image */}
                        <div className="relative">
                            <img src={post.image} alt="Post content" className="w-full h-60 sm:h-80 object-cover" />
                        </div>

                        {/* Post Actions */}
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 shadow-lg ${likedPosts.has(post.id)
                                            ? "bg-gradient-to-r from-pink-500 to-pink-600"
                                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                            }`}
                                    >
                                        <svg
                                            className="w-4 sm:w-5 h-4 sm:h-5 text-white transition-all duration-300"
                                            fill={likedPosts.has(post.id) ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </button>
                                    <button className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </button>
                                    <button className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs sm:text-sm text-purple-900 mb-1 sm:mb-2">
                                <span className="font-semibold">{post.likes + (likedPosts.has(post.id) ? 1 : 0)} likes</span>
                            </div>

                            <div className="text-xs sm:text-sm text-purple-600">View all {post.comments} comments</div>
                        </div>
                    </article>
                ))}
            </div>
        </>
    )
}

export default HomePage;