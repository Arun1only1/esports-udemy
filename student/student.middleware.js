import { addStudentValidationSchema } from "./student.validation.js";

export const validateStudentDataFromReqBody = async (req, res, next) => {
  // extract new values from req.body
  const newValues = req.body;

  // validate new values
  try {
    const validatedData = await addStudentValidationSchema.validate(newValues);
    req.body = validatedData;
    next();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
