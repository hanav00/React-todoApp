import styled from "styled-components";
import NewsItem from "./NewsItem";
import axios from "axios";
import usePromise from "../lib/usePromise";

const NewsListBlock = styled.div`
    box-sizing: border-box;
    padding-bottom: 3rem;
    width: 768px;
    margin: 0 auto;
    margin-top: 2rem;
    @media screen and (max-width: 768px) {
        width: 100%;
        padding-left: 1rem;
        padding-right: 1rem;
    }
`; 

const NewsList = ({ category }) => {
    const [loading, resolved, error] = usePromise(() => {
        const query = category === 'all' ? '' : `&category=${category}`;
        return axios.get(`https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=460a690efc5748c7979f8762eea705fe`);
    }, [category]);

    // 대기 중일 때
    if(loading) {
        return <NewsListBlock>대기 중...</NewsListBlock>
    }

    // 아직 resolved 값이 설정되지 않았을 때
    if(!resolved) {
        return null;
    }

    // 에러 발생 시
    if(error) {
       return <NewsListBlock>에러 발생!</NewsListBlock>
    }

    // resolved값이 유효하고 데이터를 가져온 후 (loading = false)
    const { articles } = resolved.data;
    return (
        <NewsListBlock>
            {articles.map(article => (
                <NewsItem key={article.url} article={article} />
            ))}
        </NewsListBlock>
    )

}

export default NewsList;