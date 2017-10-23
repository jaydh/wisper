import * as React from 'react';
import { connect } from 'react-redux';
import { Polar, HorizontalBar, Doughnut } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as articleType } from '../../constants/StoreState';
import { Grid, Col, Row } from 'react-bootstrap';

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

interface Props {
  articles: List<articleType>;
  projects: List<String>;
}

interface ProjectMeta {
  count: number;
  completed: number;
}

class Graph extends React.Component<Props> {
  getProjectData(): Map<string, object> {
    const { articles } = this.props;
    let projectData = Map<string, ProjectMeta>();
    articles.forEach((article: articleType) => {
      const keys = article.projects
        ? fromJS(article.projects).valueSeq()
        : fromJS(['NONE']);
      keys.forEach(
        (key: string) =>
          (projectData = projectData.update(
            key,
            (meta: ProjectMeta = { count: 0, completed: 0 }) => {
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
        article.metadata ? article.metadata.ogSiteName : ''
    );
    let domainCounts = Map<string, number>();
    domains.map(
      (x: string) =>
        (domainCounts = domainCounts.update(x, (t: number = 0) => t + 1))
    );
    return domainCounts;
  }

  render() {
    const projectData = this.getProjectData();
    const domainCounts = this.getDomainData().sort(
      (a: number, b: number) => (b > a ? 1 : -1)
    );
    const projectCount = projectData.map((t: ProjectMeta) => t.count);
    const projectCompletedPercentage = projectData.map(
      (t: ProjectMeta) => t.completed / t.count
    );

    const dynamicColors = function() {
      return Colors[Math.floor(Math.random() * Colors.length)];
    };

    const data = {
      labels: projectCount.keySeq().toJS(),

      datasets: [
        {
          data: projectCount.valueSeq().toJS(),
          backgroundColor: projectData
            .map(() => dynamicColors())
            .valueSeq()
            .toJS(),
          borderColor: projectCount
            .valueSeq()
            .map(() => '#f2b632')
            .toJS(),
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
            .map(() => dynamicColors())
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

    const data3 = {
      labels: projectCompletedPercentage.keySeq().toJS(),
      datasets: [
        {
          data: projectCompletedPercentage.valueSeq().toJS(),
          backgroundColor: projectCompletedPercentage
            .map(() => dynamicColors())
            .valueSeq()
            .toJS(),
          borderColor: projectCompletedPercentage
            .valueSeq()
            .map(() => '#f2b632')
            .toJS(),
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
      }
    };
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
