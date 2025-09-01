import { Link, useNavigate } from 'react-router-dom'

const BottomNavigation = () => {
    const navigate = useNavigate()

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-purple-200/30 z-[9999] shadow-lg">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-around">
                    {/* Home Button */}
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                    </button>
                    
                    {/* Search Button */}
                    <button 
                        onClick={() => navigate('/search')}
                        className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:scale-105"
                    >
                        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                    
                    {/* Add Post Button */}
                    <button 
                        onClick={() => navigate('/uploadpost')}
                        className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:scale-105"
                    >
                        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    
                    {/* Notifications Button */}
                    <button 
                        onClick={() => navigate('/notifications')}
                        className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:scale-105"
                    >
                        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                            />
                        </svg>
                    </button>
                    
                    {/* Profile Button */}
                    <button 
                        onClick={() => navigate('/profile')}
                        className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:scale-105"
                    >
                        <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                            <img
                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=24&h=24&fit=crop&crop=face"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover bg-white"
                            />
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default BottomNavigation
