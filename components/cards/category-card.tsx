import Image from "next/image";

const CategoryCard = ({ image, title } : { image: string; title: string; }) => {
    return (
        <div className="group cursor-pointer">
            <div className="relative overflow-hidden  shadow-md bg-gray-100  aspect-[2.6/4] mb-3 max-lg:flex max-lg:items-center max-lg:justify-center max-lg:flex-col-reverse">
                <Image
                    src={image} 
                    alt={`${title} Fashion`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    layout="fill"
                />
            </div>
            <h3 className="text-center text-lg font-medium tracking-wide">{title}</h3>
        </div>
    );
};

export default CategoryCard;