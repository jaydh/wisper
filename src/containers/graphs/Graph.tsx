import * as React from 'react';
import { connect } from 'react-redux';
import { Polar, HorizontalBar, Doughnut } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as articleType } from '../../constants/StoreState';

const Colors = [
  '#F9ED69',
  '#F08A5D',
  '#B83B5E',
  '#6A2C70',
  '#08D9D6',
  '#252A34',
  '#FF2E63',
  '#7AC7C4',
  '#F73859',
  '#FFCFDF',
  '#FEFDCA',
  '#E0F9B5',
  '#A5DEE5'
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
    const domainCounts = this.getDomainData();
    const projectCount = projectData.map((t: ProjectMeta) => t.count);
    const projectCompletedPercentage = projectData.map(
      (t: ProjectMeta) => t.completed / t.count
    );

    const dynamicColors = function() {
      return Colors[Math.floor(Math.random() * Colors.length)];
    };
    const dataColors = projectData
      .map(() => dynamicColors())
      .valueSeq()
      .toJS();
    const dataColors2 = domainCounts
      .map(() => dynamicColors())
      .valueSeq()
      .toJS();

    const dataColors3 = projectCompletedPercentage
      .map(() => dynamicColors())
      .valueSeq()
      .toJS();

    const data = {
      labels: projectCount.keySeq().toJS(),

      datasets: [
        {
          data: projectCount.valueSeq().toJS(),
          backgroundColor: dataColors,
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          hoverBorderWidth: 3
        }
      ]
    };

    const data2 = {
      labels: domainCounts.keySeq().toJS(),

      datasets: [
        {
          data: domainCounts
            .valueSeq()
            .sort()
            .toJS(),
          backgroundColor: dataColors2,
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
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
          backgroundColor: dataColors3,
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
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
        display: true
      }
    };
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
      <div>
        <Doughnut data={data} options={options} />
        <HorizontalBar data={data2} options={options2} />
        <Polar data={data3} options={options3} />
      </div>
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
