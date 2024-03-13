import mongoose from "mongoose";

// set rule/schema
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 65,
    lowercase: true,
    unique: true, //index
  },
  contactNumber: {
    type: String,
    required: false,
    trim: true,
    maxlength: 15,
    minlength: 7,
  },
  isGraduated: {
    type: Boolean,
    required: false,
  },
});

// create table/model/collection
const Student = mongoose.model("Student", studentSchema);
export default Student;
