const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-xl border-b border-purple-200/30">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <img 
                        src="/images/socialconnect-high-resolution-logo-transparent.png" 
                        alt="SocialConnect" 
                        className="h-6 sm:h-8 w-auto"
                    />
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg relative">
                        <svg className="w-4 sm:w-6 h-4 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full border border-white sm:border-2"></span>
                    </button>
                    <button className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg relative">
                        <svg className="w-4 sm:w-6 h-4 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full border border-white sm:border-2"></span>
                    </button>
                    <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                        <img
                            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face"
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover bg-white"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
