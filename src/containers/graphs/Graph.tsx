import * as React from 'react';
import { connect } from 'react-redux';
import { Polar, HorizontalBar, Doughnut } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as articleType } from '../../constants/StoreState';
import { Grid, Col, Row } from 'react-bootstrap';
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
  projects: List<String>;
}

interface ProjectMeta {
  count: number;
  completed: number;
  color: string;
}

class Graph extends React.Component<Props> {
  getProjectData(): Map<string, object> {
    const { articles } = this.props;
    let thisColors = fromJS(Colors);
    let projectData = Map<string, ProjectMeta>();
    articles.forEach((article: articleType) => {
      const keys = article.projects
        ? fromJS(article.projects).valueSeq()
        : fromJS(['NONE']);
      keys.forEach(
        (key: string) =>
          (projectData = projectData.update(
            key,
            (
              meta: ProjectMeta = {
                count: 0,
                completed: 0,
                color: dynamicColors(thisColors)
              }
            ) => {
              return {
                ...meta,
                count: meta.count + 1,
                completed: meta.completed + Number(article.completed)
              };
            }
          ))
      );
    });

    return projectData;
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
    const projectData = this.getProjectData();
    const projectCount = projectData.map((t: ProjectMeta) => t.count);
    const projectCompletedPercentage = projectData.map(
      (t: ProjectMeta) => Math.round(t.completed / t.count * 100) / 100
    );
    const borderColors = projectCount
      .valueSeq()
      .map(() => '#f2b632')
      .toJS();
    const data = {
      labels: projectCount.keySeq().toJS(),

      datasets: [
        {
          data: projectCount.valueSeq().toJS(),
          backgroundColor: projectData
            .map((t: ProjectMeta) => t.color)
            .valueSeq()
            .toJS(),
          borderColor: borderColors,
          borderWidth: 1.5,
          hoverBorderWidth: 3
        }
      ]
    };

    const data2 = {
      labels: domainCounts.keySeq().toJS(),

      datasets: [
        {
          data: domainCounts.valueSeq().toJS(),
          backgroundColor: domainCounts
            .map(() => dynamicColors(fromJS(Colors)))
            .valueSeq()
            .toJS(),
          borderColor: borderColors,
          borderWidth: 1,
          hoverBorderWidth: 3
        }
      ]
    };

    const data3 = {
      labels: projectCompletedPercentage.keySeq().toJS(),
      datasets: [
        {
          data: projectCompletedPercentage.valueSeq().toJS(),
          backgroundColor: projectData
            .map((t: ProjectMeta) => t.color)
            .valueSeq()
            .toJS(),
          borderColor: borderColors,
          borderWidth: 1.5,
          hoverBorderWidth: 3
        }
      ]
    };
    const options = {
      title: {
        display: true,
        text: 'Project Count Distribution'
      },
      legend: {
        display: true,
        position: 'right'
      }
    } as any;
    const options2 = {
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
    const options3 = {
      title: {
        display: true,
        text: 'Project Completed Percentage'
      },
      legend: {
        display: false
      }
    };

    return (
      <Grid>
        <Col md={6}>
          <HorizontalBar data={data2} options={options2} />
        </Col>
        <Col md={6}>
          <Row>
            <Doughnut data={data} options={options} />
          </Row>
          <Row>
            <Polar data={data3} options={options3} />
          </Row>
        </Col>
      </Grid>
    );
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articles: state.get('articles'),
    projects: state.get('projects')
  };
};

export default connect(mapStateToProps)(Graph);
