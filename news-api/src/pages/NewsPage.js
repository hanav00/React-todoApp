import { useParams } from "react-router-dom";
import Categories from "../components/Categories";
import NewsList from "../components/NewsList";

const NewsPage = () => {
    const params = useParams();
    // 카테고리가 선택되어있지 않다면 기본값은 'all'로 설정
    const category = params.category || 'all';

    return(
        <>
            <Categories />
            <NewsList category={category} />
        </>
    )
}

export default NewsPage;