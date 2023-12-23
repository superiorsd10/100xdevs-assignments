const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index.js");
const router = Router();

const zod = require("zod");

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
  const username = req.headers.username;
  const password = req.headers.password;

  const validate = adminSchema.safeParse({
    username,
    password,
  });

  if (!validate.success) {
    return res
      .status(411)
      .send("Please send username and password in valid format");
  }

  try {
    const newAdmin = await Admin.create({
      username,
      password,
    });
    res.json({
      message: "Admin created successfully!",
    });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const username = req.headers.username;
  const password = req.headers.password;

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
