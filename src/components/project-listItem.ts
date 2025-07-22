import { Draggable } from "../model/dragInterfaces.js";
import { Project } from "../model/projectModel.js";
import { autoBind } from "../utils/autobind.js";
import { Component } from "./base-component.js";

export class ProjectListItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person assigned";
    }
    return `${this.project.people} persons assigned`;
  }
  constructor(
    public templateId: string,
    public hostElementId: string,
    htmlElementName: string,
    project: Project
  ) {
    super(templateId, hostElementId, htmlElementName);
    this.project = project;
    this.configure();
    this.renderContent();
    this.attach();
  }
  @autoBind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent): void {
    console.log("drag end>>");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }
  renderContent() {
    this.element.textContent = `${this.project.title} - ${this.project.description} - ${this.persons}`;
  }
}
