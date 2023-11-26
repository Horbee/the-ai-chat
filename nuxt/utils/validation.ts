const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const Validations = {
  required: function (message: string) {
    return (value: string) => (value ? true : message);
  },
  validEmail: function (message: string) {
    return (value: string) => (value.match(emailRegex) ? true : message);
  },
};
