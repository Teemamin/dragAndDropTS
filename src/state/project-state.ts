import { Project, ProjectStatus } from "../model/projectModel.js";
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  // protected: it is only accessable by the extending class

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    // private constructor:It prevents others from calling new ProjectState() outside the class
    super();
  }

  static getInstance() {
    // all parts of the app will use the same instance of the class
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.projects]);
    }
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  switchProjectStatus(projectId: string, updatedStatus: ProjectStatus) {
    const proj = this.projects.find((project) => project.id === projectId);
    if (proj && proj.status !== updatedStatus) {
      proj.status = updatedStatus;
      this.updateListeners();
    }
  }
}

export const projectState = ProjectState.getInstance();
