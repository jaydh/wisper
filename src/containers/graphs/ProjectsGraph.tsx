import * as React from 'react';
import { connect } from 'react-redux';
import { Polar, Doughnut } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as articleType, Project } from '../../constants/StoreState';
import { Row, Col } from 'reactstrap';

interface Props {
  articles: List<articleType>;
  projects: List<Project>;
}

interface State {
  colors: List<string>;
  colorMap: Map<string, string>;
}

interface ProjectMeta {
  count: number;
  completed: number;
}

export class ProjectsGraph extends React.Component<Props, State> {
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
    props.projects.forEach((t: Project) => {
      const index = Math.floor(Math.random() * colors.size);
      const color = colors.get(index);
      colorMap = colorMap.set(t.id, color);
    });
    this.state = {
      colors,
      colorMap
    };
  }

  dynamicColors() {
    const index = Math.floor(Math.random() * this.state.colors.size);
    const color = this.state.colors.get(index);
    return color;
  }

  componentWillReceiveProps(nextProps: Props) {
    const projects = this.props.projects;
    const nextProjects = nextProps.projects;
    if (
      !nextProjects.equals(projects) ||
      !nextProps.articles.equals(this.props.articles)
    ) {
      let newColorMap: Map<string, string> = Map({ NONE: '' });
      nextProjects.forEach((t: Project) => {
        newColorMap = newColorMap.set(t.id, this.dynamicColors());
      });
    }
  }

  getProjectData(): Map<string, ProjectMeta> {
    let projectData = Map<string, ProjectMeta>();
    this.props.articles.forEach((article: articleType) => {
      const keys = !article.projects.isEmpty()
        ? fromJS(article.projects).valueSeq()
        : fromJS(['NONE']);
      keys.forEach(
        (key: string) =>
          (projectData = projectData.update(
            key,
            (
              meta: ProjectMeta = {
                count: 0,
                completed: 0
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

  getProjectCountData() {
    const projectCount = this.getProjectData().map((t: ProjectMeta) => t.count);
    const borderColors = projectCount
      .valueSeq()
      .map(() => '#f2b632')
      .toJS();
    return {
      labels: projectCount.keySeq().toJS(),

      datasets: [
        {
          label: 'project count',
          data: projectCount.valueSeq().toJS(),
          backgroundColor: this.getProjectData()
            .map((t: ProjectMeta, key: string) => this.state.colorMap.get(key))
            .valueSeq()
            .toJS(),
          borderColor: borderColors,
          borderWidth: 1.5,
          hoverBorderWidth: 3
        }
      ]
    };
  }

  getProjectCompletionData() {
    const projectCompletedPercentage = this.getProjectData().map(
      (t: ProjectMeta) => Math.round(t.completed / t.count * 100)
    );
    const borderColors = this.getProjectData()
      .valueSeq()
      .map(() => '#f2b632')
      .toJS();

    return {
      labels: projectCompletedPercentage.keySeq().toJS(),
      datasets: [
        {
          label: 'project completion',
          data: projectCompletedPercentage.valueSeq().toJS(),
          backgroundColor: this.getProjectData()
            .map((t: ProjectMeta, key: string) => this.state.colorMap.get(key))
            .valueSeq()
            .toJS(),
          borderColor: borderColors,
          borderWidth: 1.5,
          hoverBorderWidth: 3
        }
      ]
    };
  }

  render() {
    const projectCountOptions = {
      title: {
        display: true,
        text: 'Project Count Distribution'
      },
      legend: {
        display: true,
        position: window.innerWidth > 992 ? 'right' : 'bottom'
      }
    } as any;
    const projectCompletionOptions = {
      title: {
        display: true,
        text: 'Project Completed Percentage'
      },
      legend: {
        display: false
      },
      scale: {
        ticks: {
          callback: (tick: any, index: any, array: any) => {
            return tick + '%';
          }
        }
      },
      tooltips: {
        callbacks: {
          label: function(t: any, d: any) {
            const label = d.labels[t.index];
            const datapoint = d.datasets[t.datasetIndex].data[t.index];
            return `${label}: ${datapoint} %`;
          }
        }
      }
    };
    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Doughnut
              data={this.getProjectCountData()}
              options={projectCountOptions}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Polar
              data={this.getProjectCompletionData()}
              options={projectCompletionOptions}
            />
          </Col>
        </Row>
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

export default connect(mapStateToProps)(ProjectsGraph);
