import express from "express";
import Course from "./course.model.js";
import {
  courseValidationSchema,
  paginationDataValidationSchema,
} from "./course.validation.js";
import mongoose from "mongoose";

const router = express.Router();

// add course
router.post("/course/add", async (req, res) => {
  // extract new course from req.body
  const newCourse = req.body;

  try {
    await courseValidationSchema.validate(newCourse);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  // save course
  await Course.create(newCourse);

  // send res
  return res.status(201).send({ message: "Course is added successfully." });
});

// edit course by id
router.put("/course/edit/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // check for valid mongo id
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course by id
  const course = await Course.findOne({ _id: courseId });

  // if not course, throw error
  if (!course) {
    return res.status(404).send({ message: "Course does not exist." });
  }

  // extract new values from req.body
  const newValues = req.body;

  try {
    // validate new values
    await courseValidationSchema.validate(newValues);
  } catch (error) {
    // if validation fails, throw error
    return res.status(400).send({ message: error.message });
  }

  // edit course
  await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        ...newValues,
      },
    }
  );

  // send response

  return res.status(200).send({ message: "Course is updated successfully." });
});

// delete course by id
router.delete("/course/delete/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // check if course id is valid mongo id
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course by id
  const course = await Course.findOne({ _id: courseId });

  // if not course, throw error
  if (!course) {
    return res.status(404).send({ message: "Course does not exist." });
  }

  // delete course by id
  await Course.deleteOne({ _id: courseId });

  // send response
  return res.status(200).send({ message: "Course is deleted successfully." });
});

// get course list
router.get("/course/list", async (req, res) => {
  // extract pagination data from req.body
  const paginationData = req.body;

  // validate pagination data
  let validatedData;
  try {
    validatedData = await paginationDataValidationSchema.validate(
      paginationData
    );
  } catch (error) {
    // if validation fails,throw error
    return res.status(400).send({ message: error.message });
  }

  // calculate skip
  const skip = (validatedData.page - 1) * validatedData.limit;

  // find courses
  const courses = await Course.aggregate([
    { $match: {} },
    {
      $skip: skip,
    },
    { $limit: validatedData.limit },
    {
      $project: {
        name: 1,
        price: 1,
        duration: 1,
        tutorName: 1,
      },
    },
  ]);

  // send response
  return res.status(200).send({ message: "success", courseList: courses });
});
export default router;
