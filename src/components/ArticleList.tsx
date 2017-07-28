import * as React from 'react';
import Article from './Article';
import { article as articleType } from '../constants/StoreState';

interface Props {
    articles: articleType[];
    syncArticles: any;
    onArticleClick: any;
}

class ArticleList extends React.Component<Props, {}> {
    componentDidMount() {
        const { syncArticles } = this.props;
        syncArticles();
    }
    render() {
        
        const { articles, onArticleClick } = this.props;
        return (
            <div className="Col-lg-3 Col-md-3">
                <ul>
                    {articles.map(article => (
                        <Article
                            key={article.id}
                            {...article}
                            onClick={() => onArticleClick(article.id)}
                        />
                    ))}
                </ul>
            </div>
        );
    }
}
export default ArticleList;
