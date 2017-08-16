import * as React from 'react';
import { connect } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Map, List } from 'immutable';
interface Props {
  articles: List<any>;
  projects: List<String>;
}

interface ProjectMeta {
  count: number;
  completed?: number;
}

class Graph extends React.Component<Props> {
  getProjectData() {
    const { articles, projects } = this.props;

    let projectData = Map<string, ProjectMeta>();
    projects.valueSeq().forEach((project: string) => {
      projectData = projectData.set(project, {
        count: 0
      });
    });

    articles.forEach(article => {
      const articleProjects = Object.keys(article.projects).map(
        key => article.projects[key]
      );
      articleProjects.forEach(project => {
          projectData = projectData.update(project, (meta: ProjectMeta) => {
            return {
              ...meta,
              count: meta.count + 1
            };
          });
      });
    });
    return projectData;
  }

  render() {
    const projectData = this.getProjectData();
    const projectCount = projectData.map((t: ProjectMeta) => t.count);
    

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
          borderWidth: 1
        }
      ]
    };

    return (
      <div>
        <Doughnut data={data} />
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
