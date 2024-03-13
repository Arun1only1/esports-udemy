import express from "express";
import { addStudentValidationSchema } from "./student.validation.js";
import Student from "./student.model.js";

const router = express.Router();

// add student route
// router.post("/student/add", async (req, res) => {
//   // extract new student from req.body
//   const newStudent = req.body;

//   // validate new student using yup
//   let validatedData;
//   try {
//     validatedData = await addStudentValidationSchema.validate(newStudent);
//   } catch (error) {
//     // if validation fails, throw error
//     return res.status(400).send({ message: error.message });
//   }

//   // check if user with provided email already exists
//   const student = await Student.findOne({ email: newStudent.email });

//   // if user exists, throw error
//   if (student) {
//     return res.status(409).send({ message: "Email already exists." });
//   }

//   // create user
//   await Student.create(validatedData);

//   // send response
//   return res.status(201).send({ message: "Student is added successfully." });
// });

router.post(
  "/student/add",
  async (req, res, next) => {
    // extract new student from req.body
    const newStudent = req.body;

    try {
      // validate new student
      const validatedData = await addStudentValidationSchema.validate(
        newStudent
      );

      req.body = validatedData;
      // call next function
      next();
    } catch (error) {
      // if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new student from req.body
    const newStudent = req.body;

    // check if email already used
    const student = await Student.findOne({ email: newStudent.email });

    // if email already occupied, throw error
    if (student) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // create user
    await Student.create(newStudent);

    // send response
    return res.status(201).send({ message: "Student is added successfully." });
  }
);

export default router;
