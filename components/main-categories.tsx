import CategoryCard from "./cards/category-card";


const MCategories = () => {
    const categories = [
        {
            id: 1,
            title: "MEN",
            image: "/home/section2/sec1-col-1.webp"
        },
        {
            id: 2,
            title: "WOMEN",
            image: "/home/section2/sec1-col-2.webp"
        },
        {
            id: 3,
            title: "KIDS BOYS",
            image: "/home/section2/sec1-col-3.webp"
        },
        {
            id: 4,
            title: "KIDS GIRLS",
            image: "/home/section2/sec1-col-4.webp"
        }
    ];

    return (
        <section className="w-full py-12 px-4 md:px-8 lg:px-16 ">
            <h2 className="text-xl uppercase tracking-wider mb-6 text-center">OUR CATEGORIES</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">  
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        image={category.image}
                        title={category.title}
                    />
                ))}
            </div>
        </section>
    );
};

export default MCategories;