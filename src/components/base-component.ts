namespace App {
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
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
      this.element = this.elementDocFragment.querySelector(
        htmlElementName
      ) as U;
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
}
