import MainSection from "../components/cart/MainSection"
import TopBar from "../components/cart/TopBar"
import Container from "../components/shared/common/Container"
import RelatedProducts from "../components/shared/common/RelatedProducts"

const BagPage = () => {
    const local = localStorage.getItem('')
    return (
        <div className="flex items-center justify-center">
            <Container>
                <TopBar/>
                <MainSection/>
                <RelatedProducts title="You May Also Like" />
            </Container>
        </div>
    )
}

export default BagPage