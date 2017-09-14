import * as React from 'react';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as ArticleType } from '../constants/StoreState';
interface Props {
  articles: List<any>;
  projects: List<String>;
}

interface ProjectMeta {
  count: number;
  completed: number;
}

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

class Graph extends React.Component<Props> {
  getProjectData(): Map<string, object> {
    const { articles } = this.props;
    let projectData = Map<string, ProjectMeta>();
    articles.forEach((article: ArticleType) => {
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
      article => (article.metadata ? article.metadata.ogSiteName : '')
    );
    let domainCounts = Map<string, number>();
    domains.forEach(
      (x: string) =>
        (domainCounts = domainCounts.update(x, (t: number = 0) => t + 1))
    );
    return domainCounts;
  }

  render() {
    const projectData = this.getProjectData();
    const domainCounts = this.getDomainData();
    const projectCount = projectData.map((t: ProjectMeta) => t.count);
    // const projectCompleted = projectData.map((t: ProjectMeta) => t.completed);

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
    const data = () => {
      return {
        labels: projectCount.keySeq().toJS(),
        datasets: [
          {
            data: projectCount.valueSeq().toJS(),
            backgroundColor: dataColors,
            borderWidth: 1,
            hoverBorderWidth: 3
          }
        ]
      };
    };

    const data2 = {
      labels: domainCounts.keySeq().toJS(),
      datasets: [
        {
          data: domainCounts.valueSeq().toJS(),
          backgroundColor: dataColors2,
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
        display: false
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
    return (
      <div style={{ height: '200em' }}>
        <Doughnut data={data} options={options} />
        <Doughnut data={data2} options={options2} />
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
