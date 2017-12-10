import * as React from 'react';
import { connect } from 'react-redux';
import { HorizontalBar } from 'react-chartjs-2';
import { Map, List } from 'immutable';
import { Article as articleType } from '../../constants/StoreState';
import parseUri from '../../helpers/parseURI';

interface Props {
  articles: List<articleType>;
}

interface State {
  colors: List<string>;
  colorMap: Map<string, string>;
}

export class SourcesGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let colors = List([
      '#7F7EFF',
      '#ED254E',
      '#7D4E57',
      '#EF798A',
      '#8D6A9F',
      '#00A9A5',
      '#E36397',
      '#577399',
      '#1B998B'
    ])
      .sortBy(Math.random)
      .toList();

    let colorMap: Map<string, string> = Map();
    props.articles
      .map(
        (article: articleType) =>
          article.metadata
            ? article.metadata.ogSiteName ||
              article.metadata.siteName ||
              parseUri(article.link).authority
            : parseUri(article.link).authority
      )
      .forEach((t: string) => {
        const index = Math.floor(Math.random() * colors.size);
        const color = colors.get(index);
        colorMap = colorMap.set(t, color);
      });

    this.state = {
      colors: colors,
      colorMap: colorMap
    };
  }
  dynamicColors() {
    const index = Math.floor(Math.random() * this.state.colors.size);
    const color = this.state.colors.get(index);
    return color;
  }

  componentWillReceiveProps(nextProps: Props) {
    const domains = this.props.articles.map(
      (article: articleType) =>
        article.metadata
          ? article.metadata.ogSiteName ||
            article.metadata.siteName ||
            parseUri(article.link).authority
          : parseUri(article.link).authority
    );
    const nextDomains = nextProps.articles.map(
      (article: articleType) =>
        article.metadata
          ? article.metadata.ogSiteName ||
            article.metadata.siteName ||
            parseUri(article.link).authority
          : parseUri(article.link).authority
    );
    if (!nextDomains.equals(domains)) {
      let newColorMap: Map<string, string> = Map();
      nextDomains.forEach((t: string) => {
        newColorMap = newColorMap.set(t, this.dynamicColors());
      });
      this.setState({ colorMap: newColorMap });
    }
  }

  getDomainData() {
    const { articles } = this.props;
    const domains = articles.map(
      (article: articleType) =>
        article.metadata
          ? article.metadata.ogSiteName ||
            article.metadata.siteName ||
            parseUri(article.link).authority
          : parseUri(article.link).authority
    );
    let domainCounts = Map<string, number>();
    domains.map(
      (x: string) =>
        (domainCounts = domainCounts.update(x, (t: number = 0) => t + 1))
    );
    return domainCounts.filter((t: number) => t > 1);
  }

  render() {
    const domainCounts = this.getDomainData().sort(
      (a: number, b: number) => (b > a ? 1 : -1)
    );

    const data = {
      labels: domainCounts.keySeq().toJS(),

      datasets: [
        {
          label: 'sources',
          data: domainCounts.valueSeq().toJS(),
          backgroundColor: domainCounts
            .map((value: number, key: string) => this.state.colorMap.get(key))
            .valueSeq()
            .toJS(),
          borderColor: domainCounts
            .valueSeq()
            .map(() => '#f2b632')
            .toJS(),
          borderWidth: 1,
          hoverBorderWidth: 3
        }
      ]
    };
    const options = {
      title: {
        display: true,
        text: 'Sources'
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            id: 'x-axis-0',
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    } as any;

    return (
      <div>
        {!domainCounts.isEmpty() && (
          <HorizontalBar data={data} options={options} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articles: state.get('articles')
  };
};

export default connect(mapStateToProps)(SourcesGraph);
