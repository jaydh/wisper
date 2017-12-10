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
    const projects = this.props.projects.keySeq();
    const nextProjects = nextProps.projects.keySeq();
    if (!nextProjects.equals(projects)) {
      let newColorMap: Map<string, string> = Map();
      nextProjects.forEach((t: string) => {
        newColorMap = newColorMap.set(t, this.dynamicColors());
      });
      this.setState({ colorMap: newColorMap });
    }
  }

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

  render() {
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
            .map((t: ProjectMeta, key: string) => this.state.colorMap.get(key))
            .valueSeq()
            .toJS(),
          borderColor: borderColors,
          borderWidth: 1.5,
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
            .map((t: ProjectMeta, key: string) => this.state.colorMap.get(key))
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
        position: window.innerWidth > 992 ? 'right' : 'bottom'
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
      <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Doughnut data={data} options={options} />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Polar data={data3} options={options3} />
        </Col>
      </Row>
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
