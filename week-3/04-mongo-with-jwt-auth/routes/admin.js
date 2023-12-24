const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db/index.js");

const zod = require("zod");
const jwt = require("jsonwebtoken");
const { useRouter } = require("next/router.js");
const jwtPassword = "sachin";

const adminSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

const courseSchema = zod.object({
  title: zod.string(),
  description: zod.string(),
  price: zod.number(),
  imageLink: zod.string().url(),
});

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const admin = req.body;

  const validate = adminSchema.safeParse(admin);

  if (!validate.success) {
    return res
      .status(411)
      .send("Please send username and password in valid format");
  }

  try {
    const newAdmin = await Admin.create(admin);
    res.json({
      message: "Admin created successfully!",
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const admin = req.body;
  const username = admin.username;

  const validate = adminSchema.safeParse(admin);

  if (!validate.success) {
    return res
      .status(411)
      .send("Please send username and password in valid format");
  }

  try {
    const existingAdmin = await Admin.findOne({
      username,
    });

    if (!existingAdmin) {
      return res.json({
        message: "User with the given username doesn't exists",
      });
    }

    const token = jwt.sign({ username: username }, jwtPassword);
    res.json({
      token,
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const username = req.headers.username;

  const course = req.body;
  const validate = courseSchema.safeParse(course);

  if (!validate.success) {
    return res
      .status(411)
      .send("Please enter course structure in valid format!");
  }

  try {
    const newCourse = await Course.create({
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
      published: true,
    });

    const updatedAdmin = await Admin.findOneAndUpdate(
      {
        username,
      },
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    res.json({
      message: "Course created successfully!",
      courseId: newCourse._id,
    });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  try {
    const allCourses = await Course.find();
    res.json({
      courses: allCourses,
    });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
