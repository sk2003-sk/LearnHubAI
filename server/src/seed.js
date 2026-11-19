import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import { connectDatabase } from "./db.js";
import { Category, Course, Lecture, Section } from "./models/Course.js";
import { Enrollment, LectureProgress } from "./models/Learning.js";
import { Coupon, Review } from "./models/Commerce.js";
import { Layout, Notification } from "./models/System.js";
import User from "./models/User.js";
import { categories, courses } from "./seedData.js";

const force = process.argv.includes("--force");

const PLAYLIST = [
  "G3e-cpL7ofc",
  "1Rs2ND1ryYc",
  "W6NZfCO5SIk",
  "PkZNo7MFNFg",
  "SqcY0GlETPk",
  "Tn6-PIqc4UM",
  "fgTGADljAeg",
  "rfscVS0vtbw",
  "vmEHCJofslg",
  "i_LwzRVP7bg",
  "Oe421EPjeBE",
  "mbsmsm6ppjg",
  "Ul3y1LXxzdU",
  "novnyCaa7To",
  "V7z7BAZdt2M",
  "nU-IIXBWlS4",
  "FTFaQWZBqQ8",
  "Vl0H-qTclOg",
  "qz0aGYrrlhU",
  "c9Wg6Cb_YlU",
];

const KNOWN_VIDEO_IDS = new Set(PLAYLIST);
let playlistCursor = 0;

function resolvableVideo(url) {
  const match = String(url || "").match(/[?&]v=([\w-]{11})/);
  if (match && KNOWN_VIDEO_IDS.has(match[1])) return url;
  const id = PLAYLIST[playlistCursor % PLAYLIST.length];
  playlistCursor += 1;
  return `https://www.youtube.com/watch?v=${id}`;
}

async function upsertUser({ name, email, password, role }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, role, isVerified: true });
    await user.setPassword(password);
    await user.save();
    console.log(`[seed] created ${role} ${email}`);
  }
  return user;
}

async function seed({ connect = true, disconnect = true } = {}) {
  if (connect) await connectDatabase();

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Section.deleteMany({}),
      Lecture.deleteMany({}),
      Enrollment.deleteMany({}),
      LectureProgress.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      Layout.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("[seed] cleared all collections");
  }

  await upsertUser({
    name: "LearnHub Admin",
    email: "admin@admin.com",
    password: "admin@123",
    role: "admin",
  });

  const instructor = await upsertUser({
    name: "Aarav Mehta",
    email: "instructor@learnhub.dev",
    password: "Instructor@123",
    role: "instructor",
  });

  const student = await upsertUser({
    name: "Sashank Kumar",
    email: "student@learnhub.dev",
    password: "Student@123",
    role: "user",
  });

  const reviewers = [
    await upsertUser({
      name: "Priya Sharma",
      email: "priya@learnhub.dev",
      password: "Priya@123",
      role: "user",
    }),
    await upsertUser({
      name: "Arjun Rao",
      email: "arjun@learnhub.dev",
      password: "Arjun@123",
      role: "user",
    }),
  ];

  for (const category of categories) {
    await Category.updateOne(
      { name: category.name },
      {
        $setOnInsert: {
          name: category.name,
          slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: category.description,
        },
      },
      { upsert: true },
    );
  }
  console.log(`[seed] categories ready: ${categories.length}`);

  let createdCourses = 0;
  let createdLectures = 0;

  for (const entry of courses) {
    let course = await Course.findOne({ name: entry.course.name });
    if (!course) {
      course = await Course.create({
        ...entry.course,
        instructor: instructor._id,
        instructorName: instructor.name,
      });
      createdCourses += 1;

      for (const [sectionIndex, sectionData] of entry.sections.entries()) {
        const section = await Section.create({
          courseId: course._id,
          title: sectionData.title,
          order: sectionIndex,
        });

        for (const [lectureIndex, lectureData] of sectionData.lectures.entries()) {
          const [title, description, videoUrl, videoLength, isPreview] = lectureData;
          await Lecture.create({
            courseId: course._id,
            sectionId: section._id,
            title,
            description,
            videoUrl: resolvableVideo(videoUrl),
            videoLength,
            isPreview: Boolean(isPreview),
            order: lectureIndex,
          });
          createdLectures += 1;
        }
      }
    }
  }

  console.log(
    `[seed] courses ready (${createdCourses} new, ${courses.length} total), ${createdLectures} lectures created`,
  );

  await Course.updateMany({ instructor: { $exists: false } }, { instructor: instructor._id });

  const coupons = [
    {
      code: "WEB20",
      discountType: "percentage",
      discountValue: 20,
      minAmount: 0,
      maxUses: 500,
      active: true,
    },
    {
      code: "NEW500",
      discountType: "fixed",
      discountValue: 500,
      minAmount: 1000,
      maxUses: 200,
      active: true,
    },
    {
      code: "LEARN10",
      discountType: "percentage",
      discountValue: 10,
      minAmount: 0,
      maxUses: 0,
      active: true,
    },
  ];

  for (const coupon of coupons) {
    await Coupon.updateOne(
      { code: coupon.code },
      { $setOnInsert: coupon },
      { upsert: true },
    );
  }
  console.log("[seed] coupons ready: WEB20, NEW500, LEARN10");

  const layouts = [
    {
      type: "banner",
      title: "Learn. Build. Grow.",
      subTitle:
        "Build practical skills with structured courses, expert-led lessons and a learning experience designed around your goals.",
      image: "",
    },
    {
      type: "faq",
      faq: [
        {
          question: "How long do I have access to a course?",
          answer: "Once enrolled, you keep lifetime access to every lesson.",
        },
        {
          question: "Do I get a certificate?",
          answer:
            "Yes. Complete all lessons in a course and a certificate is issued automatically.",
        },
      ],
    },
    {
      type: "categories",
      categories: [
        { title: "Web Development" },
        { title: "Data Science" },
        { title: "Design" },
        { title: "Marketing" },
      ],
    },
  ];

  for (const layout of layouts) {
    await Layout.updateOne(
      { type: layout.type },
      { $setOnInsert: layout },
      { upsert: true },
    );
  }
  console.log("[seed] homepage layouts ready: banner, faq, categories");

  if ((await Notification.countDocuments()) === 0) {
    await Notification.insertMany([
      {
        title: "Welcome to LearnHub",
        message:
          "Your learning space is ready. Browse the catalogue and start your first course today.",
        status: "unread",
      },
      {
        title: "New courses published",
        message:
          "Fresh courses have been added to the catalogue, including MERN and data science tracks.",
        status: "unread",
      },
      {
        title: "Certificates are live",
        message:
          "Complete every lesson in a course to receive a downloadable certificate.",
        status: "read",
      },
    ]);
    console.log("[seed] seeded 3 notifications");
  }

  const demoCourse = await Course.findOne({
    name: "Complete Web Development Bootcamp",
  });

  if (demoCourse) {
    const existing = await Enrollment.findOne({
      user: student._id,
      course: demoCourse._id,
    });

    if (!existing) {
      const firstLecture = await Lecture.findOne({ courseId: demoCourse._id }).sort({
        order: 1,
        createdAt: 1,
      });

      await Enrollment.create({
        user: student._id,
        course: demoCourse._id,
        progress: firstLecture ? 11 : 0,
        isCompleted: false,
        completedLectures: firstLecture ? [firstLecture._id] : [],
        lastLectureId: firstLecture?._id,
      });

      if (firstLecture) {
        await LectureProgress.create({
          user: student._id,
          lecture: firstLecture._id,
          course: demoCourse._id,
          watchedSeconds: 0,
          completed: true,
        });
      }
      console.log(`[seed] enrolled ${student.email} in "${demoCourse.name}"`);
    }

    const seededReviews = [
      [reviewers[0], 5, "Clear explanations and the projects were genuinely useful."],
      [reviewers[1], 4, "Great pace for beginners. The React section helped a lot."],
      [student, 5, "One of the best structured courses I have taken."],
    ];

    for (const [user, rating, comment] of seededReviews) {
      const exists = await Review.findOne({ user: user._id, course: demoCourse._id });
      if (!exists) {
        await Review.create({ user: user._id, course: demoCourse._id, rating, comment });
      }
    }

    const stats = await Review.aggregate([
      { $match: { course: demoCourse._id } },
      { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    if (stats[0]) {
      demoCourse.rating = Number(stats[0].average.toFixed(1));
      demoCourse.reviewCount = stats[0].count;
      await demoCourse.save();
    }
  }

  console.log("\n[seed] done. Sign in with:");
  console.log("  admin      admin@admin.com / admin@123");
  console.log("  instructor instructor@learnhub.dev / Instructor@123");
  console.log("  student    student@learnhub.dev / Student@123");

  if (disconnect) await mongoose.disconnect();
}

export { seed };

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  seed().catch(async (error) => {
    console.error("[seed] failed", error);
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    process.exit(1);
  });
}
