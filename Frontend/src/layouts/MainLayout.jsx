import Header from '../components/Header'
import BottomNavigation from '../components/BottomNavigation'

const MainLayout = ({ children }) => {
    return (
    <div className="min-h-screen bg-purple-100">
            <Header />
            
            <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-20 sm:pb-24">
                {children}
            </main>
            
            <BottomNavigation />
        </div>
    )
}

export default MainLayout
