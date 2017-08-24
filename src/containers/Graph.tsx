import * as React from 'react';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Map, List } from 'immutable';
import { Article as ArticleType } from '../constants/StoreState';
interface Props {
  articles: List<any>;
  projects: List<String>;
}

interface ProjectMeta {
  count: number;
  completed: number;
}

class Graph extends React.Component<Props> {
  // this is probably way too verbose and can be reimplemented by mapping through the article
  getProjectData(): Map<string, object> {
    const { articles, projects } = this.props;
    let projectData = Map<string, ProjectMeta>();
    projects.valueSeq().forEach((project: string) => {
      projectData = projectData.set(project, {
        count: 0,
        completed: 0
      });
    });
    projectData = projectData.set('NONE', { count: 0, completed: 0 });
    articles.forEach((article: ArticleType) => {
      if (article.projects) {
        const articleProjects = Object.keys(article.projects).map(key => {
          return article.projects ? article.projects[key] : 'NONE';
        });
        articleProjects.forEach(project => {
          projectData = projectData.update(project, (meta: ProjectMeta) => {
            return {
              ...meta,
              count: meta.count + 1,
              completed: meta.completed + Number(article.completed)
            };
          });
        });
      } else {
        projectData = projectData.update('NONE', (meta: ProjectMeta) => {
          return {
            ...meta,
            count: meta.count + 1,
            completed: meta.completed + Number(article.completed)
          };
        });
      }
    });

    return projectData;
  }

  getDomainData() {
    const { articles } = this.props;
    const domains = articles.map(
      article => (article.metadata ? article.metadata.ogSiteName : '')
    );
    let domainCounts = Map<string, number>();
    domains.map(
      (x: string) => (domainCounts = domainCounts.update(x, (t: number = 0) => t + 1))
    );
    return domainCounts;
  }

  render() {
    const projectData = this.getProjectData();
    const domainCounts = this.getDomainData();
    const projectCount = projectData.map((t: ProjectMeta) => t.count);
    // const projectCompleted = projectData.map((t: ProjectMeta) => t.completed);

    const data = {
      labels: projectCount.keySeq().toJS(),
      datasets: [
        {
          label: '# of Votes',
          data: projectCount.valueSeq().toJS(),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
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
          label: '# of Votes',
          data: domainCounts.valueSeq().toJS(),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
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

    return (
      <div>
        <Doughnut data={data} />
        <Doughnut data={data2} />
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
