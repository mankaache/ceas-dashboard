interface ErrorData {
  data: {
    errors: {
      [category: string]: string[] | { [field: string]: string[] };
    };
  };
}

function extractErrors(errorData: ErrorData): string[] {
  const extractedErrors: string[] = [];

  for (const category in errorData.data.errors) {
    const errorDetails = errorData.data.errors[category];
    if (Array.isArray(errorDetails)) {
      for (const errorMsg of errorDetails) {
        extractedErrors.push(`${category}: ${errorMsg}`);
      }
    } else {
      for (const field in errorDetails) {
        for (const errorMsg of errorDetails[field]) {
          extractedErrors.push(`${category}: ${field}: ${errorMsg}`);
        }
      }
    }
  }

  return extractedErrors;
}

export const getError = (
  output: "text" | "html",
  error: Error | any,
  fallbackMsg?: string
) => {
  if (error) {
    if (error.data) {
      // return Object.entries(error.data).reduce(
      //   (acc: string, [key, value]: [string, any]) => {
      //     if (Array.isArray(value)) {
      //       for (let msg of value) {
      //         output === 'html'
      //           ? (acc += `<p>${msg}</p><br />`)
      //           : (acc += `${msg}\n\n`);
      //       }
      //     } else {
      //       output === 'html'
      //         ? (acc += `<p>${value}</p><br />`)
      //         : (acc += `${value}\n\n`);
      //     }

      //     return acc;
      //   },
      //   ''
      // );

      if (error.data.errors)
        return extractErrors(error).join(output == "html" ? "<br />" : "\n");

      if (error.data.message) {
        return error.data.message;
      }

      if (error.data.detail) {
        return error.data.detail;
      }
    }

    if (error.message) {
      return error.message;
    }

    if (error.error && typeof error.error === "string") {
      return error.error;
    }

    if (typeof error === "string") {
      return error;
    }
  } else {
    return (
      fallbackMsg ??
      "An Error occured.\nPlease make sure you have an active internet connection and try again!"
    );
  }
};
