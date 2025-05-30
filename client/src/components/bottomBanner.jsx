import { assets, features } from "../assets/assets"

const BottomBanner = () => {
  return (
    <div className="relative mt-24 ">
        <img src={assets.bottom_banner_image} alt="banner image" className="w-full hidden  md:block" />
        <img src={assets.bottom_banner_image_sm} alt="banner image" className="w-full  md:hidden" />

        <div className="absolute inset-0  flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
            <div>
                <h1 className=" text-2xl md:text-3xl font-semibold text-primary">Why We Are The Best?</h1>
                {features.map((feat,idx)=>(
                    <div key={idx} className="flex items-center gap-4 mt-2">
                        <img src={feat.icon} alt={feat.title} className="w-9" />
                        <div className="mb-2">
                            <h3 className="text-lg md:text-xl font-semibold ">{feat.title}</h3>
                            <p className="text-gray-500/70 text-xs md:text-sm font-semibold">{feat.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default BottomBanner