import * as React from 'react';
import { connect } from 'react-redux';
import { Polar, Doughnut } from 'react-chartjs-2';
import { Map, List, fromJS } from 'immutable';
import { Article as articleType } from '../../constants/StoreState';
import { Row, Col } from 'react-bootstrap';

interface Props {
  articles: List<articleType>;
  projects: Map<string, List<string>>;
}

interface State {
  colors: List<string>;
  colorMap: Map<string, string>;
  projectData: Map<string, ProjectMeta>;
  projectCountData: any;
  projectCountOptions: any;
  projectCompletionData: any;
  projectCompletionOptions: any;
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
    props.projects.keySeq().forEach((t: string) => {
      const index = Math.floor(Math.random() * colors.size);
      const color = colors.get(index);
      colorMap = colorMap.set(t, color);
    });

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
      }
    };
    this.state = {
      colors: colors,
      colorMap: colorMap,
      projectData: this.getProjectData(props.articles),
      projectCountData: {},
      projectCountOptions,
      projectCompletionData: {},
      projectCompletionOptions
    };
    this.state = {
      colors: colors,
      colorMap: colorMap,
      projectData: this.getProjectData(props.articles),
      projectCountData: this.getProjectCountData(),
      projectCountOptions,
      projectCompletionData: this.getProjectCompletionData(),
      projectCompletionOptions
    };
  }

  dynamicColors() {
    const index = Math.floor(Math.random() * this.state.colors.size);
    const color = this.state.colors.get(index);
    return color;
  }

  componentWillReceiveProps(nextProps: Props) {
    const projects = this.props.projects.keySeq();
    const nextProjects = nextProps.projects.keySeq();
    if (
      !nextProjects.equals(projects) ||
      !nextProps.articles.equals(this.props.articles)
    ) {
      let newColorMap: Map<string, string> = Map({ NONE: '' });
      nextProjects.forEach((t: string) => {
        newColorMap = newColorMap.set(t, this.dynamicColors());
      });
      this.setState(
        {
          projectData: this.getProjectData(nextProps.articles),
          colorMap: newColorMap
        },
        () =>
          this.setState({
            projectCompletionData: this.getProjectCompletionData(),
            projectCountData: this.getProjectCountData()
          })
      );
    }
  }

  getProjectData(articles: List<articleType>): Map<string, ProjectMeta> {
    let projectData = Map<string, ProjectMeta>();
    articles.forEach((article: articleType) => {
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
    const projectCount = this.state.projectData.map(
      (t: ProjectMeta) => t.count
    );
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
          backgroundColor: this.state.projectData
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
    const projectCompletedPercentage = this.state.projectData.map(
      (t: ProjectMeta) => Math.round(t.completed / t.count * 100) / 100
    );
    const borderColors = this.state.projectData
      .valueSeq()
      .map(() => '#f2b632')
      .toJS();

    return {
      labels: projectCompletedPercentage.keySeq().toJS(),
      datasets: [
        {
          label: 'project completion',
          data: projectCompletedPercentage.valueSeq().toJS(),
          backgroundColor: this.state.projectData
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
    return (
      <div>
        {!this.state.projectData.isEmpty() && (
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Doughnut
                data={this.state.projectCountData}
                options={this.state.projectCountOptions}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Polar
                data={this.state.projectCompletionData}
                options={this.state.projectCompletionOptions}
              />
            </Col>
          </Row>
        )}
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
