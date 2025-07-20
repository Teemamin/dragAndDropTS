namespace App {
  interface validatorObj {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export const validator = (inputValidator: validatorObj): boolean => {
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
}
