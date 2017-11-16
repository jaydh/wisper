import * as React from 'react';
import { connect } from 'react-redux';
import { HorizontalBar } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as articleType } from '../../constants/StoreState';
import parseUri from '../../helpers/parseURI';

const Colors = [
  '#7F7EFF',
  '#706677',
  '#ED254E',
  '#7D4E57',
  '#EF798A',
  '#CCFBFE',
  '#8D6A9F',
  '#00A9A5',
  '#C4F1BE',
  '#F1DEDE',
  '#E36397',
  '#577399',
  '#1B998B'
];

const dynamicColors = function(thisColors: any) {
  const index = Math.floor(Math.random() * thisColors.size);
  const val = thisColors.get(index);
  thisColors = thisColors.delete(index);
  return val;
};

interface Props {
  articles: List<articleType>;
}

export class SourcesGraph extends React.Component<Props> {
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
          data: domainCounts.valueSeq().toJS(),
          backgroundColor: domainCounts
            .map(() => dynamicColors(fromJS(Colors)))
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

    return <HorizontalBar data={data} options={options} />;
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articles: state.get('articles')
  };
};

export default connect(mapStateToProps)(SourcesGraph);
