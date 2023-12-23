const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index.js");
const zod = require("zod");

const userSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.headers.username;
  const password = req.headers.password;

  const validate = userSchema.safeParse({
    username,
    password,
  });

  if (!validate.success) {
    return res
      .status(411)
      .send("Please send username and password in valid format!");
  }

  try {
    const newUser = await User.create({
      username,
      password,
    });

    res.json({
      message: "User created successfully!",
    });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  try {
    const allCourses = await Course.find();

    res.json({
      courses: allCourses,
    });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;

  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        username,
      },
      {
        $push: { purchasedCourses: courseId },
      },
      { new: true }
    );

    res.json({
      message: "Course purchased successfully!",
    });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const username = req.headers.username;

  try {
    const user = await User.findOne({
      username,
    });

    const userPurchasedCoursesId = user.purchasedCourses;

    let userPurchasedCourses = [];

    for (const courseId of userPurchasedCoursesId) {
      const course = await Course.findById(courseId);
      userPurchasedCourses.push(course);
    }

    res.json({
      purchasedCourses: userPurchasedCourses,
    });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
