import Yup from "yup";

export const addStudentValidationSchema = Yup.object({
  firstName: Yup.string()
    .required()
    .trim()
    .max(30, "First name must be at max 30 characters."),
  lastName: Yup.string()
    .required()
    .trim()
    .max(30, "Last name must be at max 30 characters."),
  email: Yup.string()
    .email("Must be valid email")
    .required()
    .max(65, "Email must be at max 65 characters.")
    .trim()
    .lowercase(),
  contactNumber: Yup.string()
    .trim()
    .min(7, "Contact number must be at least 7 characters.")
    .max(15, "Contact number must be at most 15 characters."),
  isGraduated: Yup.boolean(),
});
