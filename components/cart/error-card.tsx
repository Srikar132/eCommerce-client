import { Button } from "../ui/button";



export default function ErrorCard() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
                <p className="text-gray-600 mb-6">
                    We couldn't fetch the search results. Please try again.
                </p>
                <Button className="btn!" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        </div>
    )
}