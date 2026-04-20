import { getActiveSliderImages } from "@/lib/actions/content-actions";
import SmoothSliderClient from "./smooth-slider";

export default async function SmoothSlider() {

    try {

        const images = await getActiveSliderImages();

        return <SmoothSliderClient images={images} />;
    } catch (error) {
        return null;
    }

}
