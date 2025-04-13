import React from 'react'

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center py-20 flex-col min-h-screen bg-[#001E80]">
            <h1>Loading...</h1>
            <div className="mt-10 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
    )
}

export default LoadingSpinner