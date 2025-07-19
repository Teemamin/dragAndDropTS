// Code goes here!
const projectLists: any[] = [];
// const projectTemplate = document.getElementById(
//   "project-input"
// ) as HTMLTemplateElement;

// const app = document.getElementById("app");
// const elementDocFragment = projectTemplate.content.cloneNode(true);

// app?.appendChild(elementDocFragment);
// const element = document.querySelector("element") as HTMLFormElement;

// element.addEventListener("submit", (e) => {
//   e.preventDefault();
//   console.log("submitted!", e.target);
//   const submitedForm = e.target as HTMLFormElement;
//   const title = submitedForm.querySelector("#title") as HTMLInputElement;
//   const desc = submitedForm.querySelector(
//     "#description"
//   ) as HTMLTextAreaElement;
//   const people = submitedForm.querySelector("#people") as HTMLInputElement;

//   if (
//     title.value.trim() === "" ||
//     desc.value.trim() === "" ||
//     +people.value <= 0 ||
//     people.value === ""
//   ) {
//     console.log("all feild are required!");
//     alert("you need to provide all values");
//     return;
//   }

//   const projectObj = {
//     id: title.value + people.value,
//     title: title.value,
//     people: people.value,
//     desc: desc.value,
//   };
//   console.log("obj", projectObj);
//   projectLists.push(projectObj);
//   if (projectLists.length > 0) {
//     const ulTemplate = document.getElementById(
//       "project-list"
//     ) as HTMLTemplateElement;
//     const ulSecClone = ulTemplate.content.cloneNode(true) as DocumentFragment;

//     const projectSec = ulSecClone.querySelector(".projects");

//     const ulEl = projectSec?.querySelector("ul");
//     const isEmptyUl = document.querySelector(".projects ul") === null;
//     if (isEmptyUl) {
//       const header = projectSec?.querySelector("h2") as HTMLHeadingElement;
//       header.innerHTML = "Project Section";
//       projectLists.forEach((project) => {
//         const liTemplate = document.getElementById(
//           "single-project"
//         ) as HTMLTemplateElement;
//         const liClone = liTemplate.content.cloneNode(true) as DocumentFragment;
//         const liEl = liClone.querySelector("li") as HTMLElement;

//         liEl.innerHTML = `${project.title} - ${project.desc} - ${project.people}`;
//         projectSec?.querySelector("ul")?.appendChild(liEl);
//       });
//       app?.appendChild(ulSecClone);
//     } else {
//       const liTemplate = document.getElementById(
//         "single-project"
//       ) as HTMLTemplateElement;
//       const liClone = liTemplate.content.cloneNode(true) as DocumentFragment;
//       const liEl = liClone.querySelector("li") as HTMLElement;

//       liEl.innerHTML = `${projectObj.title} - ${projectObj.desc} - ${projectObj.people}`;
//       ulEl?.appendChild(liEl);
//     }
//     app?.appendChild(ulSecClone);
//   }
// });

function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedMethod: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedMethod;
}

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

interface validatorObj {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

enum ProjectStatus {
  Active,
  Finished,
}

type Listener<T> = (items: T[]) => void;

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

const validator = (inputValidator: validatorObj): boolean => {
  let isValid = true;

  if (inputValidator.required) {
    isValid = isValid && inputValidator.value.toString().trim() !== "";
  }
  if (typeof inputValidator.value === "string" && inputValidator.minLength) {
    isValid =
      isValid && inputValidator.value.length >= inputValidator.minLength;
  }

  if (typeof inputValidator.value === "string" && inputValidator.maxLength) {
    isValid =
      isValid && inputValidator.value.length <= inputValidator.maxLength;
  }

  if (
    typeof inputValidator.value === "number" &&
    inputValidator.min &&
    inputValidator.min != null
  ) {
    isValid = isValid && inputValidator.value >= inputValidator.min;
  }
  if (
    typeof inputValidator.value === "number" &&
    inputValidator.max &&
    inputValidator.max != null
  ) {
    isValid = isValid && inputValidator.value <= inputValidator.max;
  }

  return isValid;
};

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

const projectState = ProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  // adding abstract in front of a class ensure we can only use the class to extend and now the class cannot be extentiated on its own
  // eg const myComp = new Component() will not work
  templateElement: HTMLTemplateElement;

  hostElement: T;
  elementDocFragment: DocumentFragment;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    htmlElementName: string,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    ) as HTMLTemplateElement;

    this.hostElement = document.getElementById(hostElementId) as T;
    this.elementDocFragment = this.templateElement.content.cloneNode(
      true
    ) as DocumentFragment;
    this.element = this.elementDocFragment.querySelector(htmlElementName) as U;
    this.element.id = newElementId ? newElementId : "";
  }

  attach() {
    this.hostElement.appendChild(this.elementDocFragment);
  }

  // here adding abstract methods without defining the actual functionality allow to force the classes extending
  // to have to define these functions that way each instance can build the functionality to its use case.
  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  inputTitle: HTMLInputElement;
  inputDesc: HTMLInputElement;
  inputPeople: HTMLInputElement;

  constructor() {
    super("project-input", "app", "form", "user-input");

    this.inputTitle = this.elementDocFragment.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.inputDesc = this.elementDocFragment.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.inputPeople = this.elementDocFragment.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
    this.attach();
  }

  configure() {
    this.element.addEventListener("submit", this.handleSubmit);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number] | void {
    const titleValue = this.inputTitle.value;
    const descValue = this.inputDesc.value;
    const peopleValue = Number(this.inputPeople.value);
    if (
      !validator({ value: titleValue, required: true }) ||
      !validator({ value: descValue, required: true, minLength: 5 }) ||
      !validator({ value: peopleValue, required: true, min: 1, max: 10 })
    ) {
      alert("please ensure you provide values for all fields and try again");
      return;
    } else {
      return [titleValue, descValue, peopleValue];
    }
  }

  clearInputs(): void {
    this.inputTitle.value = "";
    this.inputDesc.value = "";
    this.inputPeople.value = "";
  }

  @autoBind
  handleSubmit(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

class ProjectList
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
    if (this.projects.length > 0) {
      this.ulEl.innerHTML = "";
      this.projects.forEach((project) => {
        // const li = document.createElement("li");
        // li.textContent = `${project.title} - ${project.description} - ${project.people}`;
        // this.ulEl.appendChild(li);
        new ProjectListItem("single-project", this.ulEl.id, "li", project);
      });
    }
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
    console.log("d", projectId);
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

class ProjectListItem
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
    console.log("drag event", event);
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

const inputForm = new ProjectInput();

const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");

console.log("projectState>>", projectState);
