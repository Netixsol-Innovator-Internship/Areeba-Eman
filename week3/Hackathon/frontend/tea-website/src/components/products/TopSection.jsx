import TopImage from "../../assets/collections/topimage.jpg";

const TopSection = () => {
    return (
        <div className="w-full h-[180px] md:h-[308px]" >
            <img src={TopImage} alt="Top section" className="w-full h-full object-cover" />
        </div>
    );
};

export default TopSection;
