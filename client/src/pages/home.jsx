import BestSeller from "../components/bestSeller"
import BottomBanner from "../components/bottomBanner"
import Categories from "../components/categories"
import Contact from "../components/contact"
import MainBanner from "../components/mainBanner"

const Home = () => {
  return (
    <div className="mt-10">
        <MainBanner/>
        <Categories/>
        <BestSeller/>
        <BottomBanner/>
        <Contact/>
    </div>
  )
}

export default Home