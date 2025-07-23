import { projectState } from "../state/project-state";
import { autoBind } from "../utils/autobind";
import { validator } from "../utils/validator";
import { Component } from "./base-component";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
