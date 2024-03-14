import express from "express";
import { addStudentValidationSchema } from "./student.validation.js";
import Student from "./student.model.js";
import { validateMongoIdFromReqParams } from "../middlewares/validate.id.from.req.params.js";
import { validateStudentDataFromReqBody } from "./student.middleware.js";

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

router.delete(
  "/student/delete/:id",
  validateMongoIdFromReqParams,
  async (req, res) => {
    // extract student id from req.params
    const studentId = req.params.id;

    // find student by id
    const student = await Student.findOne({ _id: studentId });

    // if not student, throw error
    if (!student) {
      return res.status(404).send({ message: "Student does not exist." });
    }

    // delete student
    await Student.deleteOne({ _id: studentId });

    // send response
    return res
      .status(200)
      .send({ message: "Student is deleted successfully." });
  }
);

router.get(
  "/student/details/:id",
  validateMongoIdFromReqParams,
  async (req, res) => {
    // extract student id from req.params
    const studentId = req.params.id;

    // find student by id
    const student = await Student.findOne({ _id: studentId });

    // if not student, throw error
    if (!student) {
      return res.status(404).send({ message: "Student does not exist." });
    }

    // send student as response
    return res
      .status(200)
      .send({ message: "success", studentDetails: student });
  }
);

router.put(
  "/student/edit/:id",
  validateMongoIdFromReqParams,
  validateStudentDataFromReqBody,
  async (req, res) => {
    // extract id from req.params
    const studentId = req.params.id;

    // extract new values from req.body
    const newValues = req.body;

    // find student by id
    const student = await Student.findOne({ _id: studentId });

    // if not student, throw error
    if (!student) {
      return res.status(404).send({ message: "Student does not exist." });
    }

    // edit student
    await Student.updateOne(
      { _id: studentId },
      {
        $set: { ...newValues },
      }
    );

    // send response
    return res
      .status(200)
      .send({ message: "Student is updated successfully." });
  }
);
export default router;
