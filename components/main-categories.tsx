import CategoryCard from "./cards/category-card";
import {categories} from "@/constants";

const MCategories = () => {

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