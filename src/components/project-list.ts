import { DragTarget } from "../model/dragInterfaces.js";
import { Project, ProjectStatus } from "../model/projectModel.js";
import { projectState } from "../state/project-state.js";
import { autoBind } from "../utils/autobind.js";
import { Component } from "./base-component.js";
import { ProjectListItem } from "./project-listItem.js";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  header: HTMLHeadElement;
  projects: Project[] = [];
  ulEl: HTMLUListElement;

  constructor(private type: "active" | "finished") {
    super("project-list", "app", ".projects");
    this.element.id = `${this.type}-projects`;
    this.header = this.elementDocFragment.querySelector(
      "h2"
    ) as HTMLHeadElement;
    this.ulEl = this.element.querySelector("ul") as HTMLUListElement;

    this.configure();
    this.attach();

    this.renderContent();
  }

  renderContent() {
    this.header.textContent = `${this.type.toUpperCase()} PROJECTS`;
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
  }

  private processAddedProjects() {
    this.ulEl.innerHTML = "";
    this.projects.forEach((project) => {
      new ProjectListItem("single-project", this.ulEl.id, "li", project);
    });
  }

  @autoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      // you have to prevent default in JS for drop event to happen
      // the default is to prevent the drop but if preventDefault is called it allows the drop and the drop handler gets called
      event.preventDefault();
      this.ulEl.classList.add("droppable");
    }
  }
  @autoBind
  dragLeaveHandler(_: DragEvent): void {
    this.ulEl.classList.remove("droppable");
  }

  @autoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer?.getData("text/plain") as string;
    projectState.switchProjectStatus(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  configure(): void {
    projectState.addListener((pr: Project[]) => {
      console.log("received project passed from state class", pr);
      const relevantProjects = pr.filter((item) => {
        if (this.type === "active") {
          return item.status === ProjectStatus.Active;
        }
        return item.status === ProjectStatus.Finished;
      });
      this.projects = relevantProjects;
      this.processAddedProjects();
    });
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
  }
}
