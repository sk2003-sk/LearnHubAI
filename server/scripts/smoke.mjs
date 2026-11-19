const BASE = process.env.API_URL || "http://localhost:5050";

let cookie = "";
let token = "";
let failures = 0;

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`  PASS  ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${name}${detail ? ` -> ${detail}` : ""}`);
  }
}

async function request(method, path, body, { auth = true, raw = false } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  if (cookie) headers.Cookie = cookie;

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookies = response.headers.getSetCookie?.() || [];
  for (const value of setCookies) {
    cookie = value.split(";")[0];
  }

  if (raw) return { response, data: await response.arrayBuffer() };

  let data = null;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { response, data };
}

const email = `smoke_${Date.now()}@learnhub.dev`;
const password = "Smoke@12345";

console.log(`\nSmoke testing ${BASE}\n`);

const health = await request("GET", "/api/v1/test", undefined, { auth: false });
check("health endpoint", health.response.ok, health.data?.message);

const catalog = await request("GET", "/api/v1/lms/courses?limit=100", undefined, { auth: false });
check("course catalog returns courses", Array.isArray(catalog.data?.courses) && catalog.data.courses.length >= 10, `count=${catalog.data?.courses?.length}`);

const freeCourse = catalog.data.courses.find((course) => course.name === "React for Beginners");
const seededCourse = catalog.data.courses.find((course) => course.name === "Complete Web Development Bootcamp");
check("seeded courses present", Boolean(freeCourse && seededCourse));

const detail = await request("GET", `/api/v1/lms/courses/${freeCourse._id}`, undefined, { auth: false });
check("course detail has _id and thumbnail", Boolean(detail.data?.course?._id && detail.data?.course?.thumbnail));
check("course detail exposes rating/purchased", typeof detail.data?.course?.rating === "number" && typeof detail.data?.course?.purchased === "number");

const registration = await request("POST", "/api/v1/auth/register", {
  name: "Smoke Tester",
  email,
  password,
}, { auth: false });
check("register returns activation details", registration.response.status === 201 && Boolean(registration.data?.activationToken && registration.data?.activationCode), JSON.stringify(registration.data));

const earlyLogin = await request("POST", "/api/v1/auth/login", { email, password }, { auth: false });
check("unverified login blocked", earlyLogin.response.status === 403);

const activation = await request("POST", "/api/v1/auth/activate-user", {
  activation_token: registration.data.activationToken,
  activation_code: registration.data.activationCode,
}, { auth: false });
check("activation succeeds", activation.response.ok, activation.data?.message);

const login = await request("POST", "/api/v1/auth/login", { email, password }, { auth: false });
token = login.data?.accessToken || login.data?.token || "";
check("login returns access token and user", Boolean(token) && login.data?.user?.role === "user");
check("login sets refresh cookie", cookie.includes("learnhub_refresh"));

const me = await request("GET", "/api/v1/auth/me");
check("/me returns current user", me.data?.user?.email === email);

const refresh = await request("GET", "/api/v1/auth/refreshtoken", undefined, { auth: false });
check("refresh issues a new token", Boolean(refresh.data?.accessToken));
token = refresh.data.accessToken;

const wishlist = await request("POST", "/api/v1/lms/wishlist", { courseId: freeCourse._id });
check("wishlist toggle saves course", Array.isArray(wishlist.data?.wishlist) && wishlist.data.wishlist.length === 1);

const coupon = await request("POST", "/api/v1/lms/coupons/validate", {
  courseId: freeCourse._id,
  code: "WEB20",
});
check("coupon validate returns payable", typeof coupon.data?.payable === "number" && coupon.data.payable < freeCourse.price, JSON.stringify(coupon.data));

const payment = await request("POST", "/api/v1/lms/payments/create", {
  courseId: freeCourse._id,
  couponCode: "WEB20",
});
check("payment create returns mock client secret", /mock/i.test(payment.data?.clientSecret || ""), payment.data?.clientSecret);
check("payment amount uses coupon", payment.data?.amount === coupon.data?.payable);

const order = await request("POST", "/api/v1/order/create-order", {
  courseId: freeCourse._id,
  payment_info: { id: payment.data.paymentIntentId, status: "succeeded" },
});
check("order creates enrollment", order.response.ok && Boolean(order.data?.enrollment?._id), JSON.stringify(order.data).slice(0, 200));

const learning = await request("GET", "/api/v1/lms/my-learning");
const allLearning = [
  ...(learning.data?.continueLearning || []),
  ...(learning.data?.inProgress || []),
  ...(learning.data?.completed || []),
];
check("my-learning lists the enrollment", allLearning.length === 1, JSON.stringify(learning.data).slice(0, 200));
check("my-learning record embeds course", Boolean(allLearning[0]?.course?.name));

const curriculum = await request("GET", `/api/v1/lms/courses/${freeCourse._id}/curriculum`);
const sections = curriculum.data?.curriculum || [];
const lectures = sections.flatMap((section) => section.lectures || []);
check("curriculum returns sections and lectures", sections.length >= 1 && lectures.length >= 1, `sections=${sections.length}, lectures=${lectures.length}`);

let lastProgress = null;
for (const lecture of lectures) {
  await request("POST", `/api/v1/lms/lectures/${lecture._id}/progress`, { watchedSeconds: 30 });
  lastProgress = await request("POST", `/api/v1/lms/lectures/${lecture._id}/complete`);
}
check("completing all lectures reaches 100%", lastProgress.data?.progress === 100 && lastProgress.data?.completed === true, JSON.stringify(lastProgress.data));

const certificates = await request("GET", "/api/v1/lms/certificates");
check("certificate issued on completion", certificates.data?.certificates?.length === 1);
const certificate = certificates.data?.certificates?.[0];

const download = await request("GET", `/api/v1/lms/certificates/${certificate.certificateId}/download`, undefined, { raw: true });
const pdfHeader = Buffer.from(download.data).subarray(0, 4).toString();
check("certificate PDF downloads", download.response.ok && pdfHeader === "%PDF", pdfHeader);

const review = await request("POST", `/api/v1/lms/reviews/${freeCourse._id}`, {
  rating: 5,
  comment: "Smoke test review",
});
check("review can be submitted", review.response.ok && review.data?.review?.rating === 5);

const reviews = await request("GET", `/api/v1/lms/reviews/${freeCourse._id}`);
check("reviews are listed", reviews.data?.reviews?.some((item) => item.comment === "Smoke test review"));

const progress = await request("GET", "/api/v1/lms/progress-analytics");
check("progress analytics returns rows", progress.data?.courses?.length === 1 && progress.data.courses[0].progress === 100);

const orders = await request("GET", "/api/v1/lms/orders");
check("orders list includes paid order", orders.data?.orders?.[0]?.status === "paid");

async function loginAs(accountEmail, accountPassword) {
  const response = await request("POST", "/api/v1/auth/login", {
    email: accountEmail,
    password: accountPassword,
  }, { auth: false });
  token = response.data?.accessToken || "";
  return token;
}

await loginAs("admin@admin.com", "admin@123");
check("admin login works", Boolean(token));

const adminCourses = await request("GET", "/api/v1/lms/admin/courses?limit=100");
check("admin courses endpoint", Array.isArray(adminCourses.data?.courses) && adminCourses.data.courses.length >= 10);

const adminInstructors = await request("GET", "/api/v1/lms/admin/instructors");
check("admin instructors endpoint", adminInstructors.data?.instructors?.length >= 1);

const adminOrders = await request("GET", "/api/v1/lms/admin/orders?limit=100");
check("admin orders endpoint", Array.isArray(adminOrders.data?.orders) && Boolean(adminOrders.data.orders[0]?.payment_info));

const adminEnrollments = await request("GET", "/api/v1/lms/admin/enrollments?limit=100");
check("admin enrollments endpoint", Array.isArray(adminEnrollments.data?.enrollments) && Boolean(adminEnrollments.data.enrollments[0]?.user?.name));

const adminAnalytics = await request("GET", "/api/v1/lms/admin/analytics");
check("admin analytics endpoint", typeof adminAnalytics.data?.users === "number" && typeof adminAnalytics.data?.courses === "number");

const exportCsv = await request("GET", "/api/v1/lms/admin/enrollments/export", undefined, { raw: true });
check("admin enrollment export returns CSV", exportCsv.response.ok && Buffer.from(exportCsv.data).toString().startsWith('"Enrollment ID"'));

for (const [segment, key] of [["users", "users"], ["course", "courses"], ["order", "orders"]]) {
  const series = await request("GET", `/api/v1/analytics/get-${segment}-analytics`);
  const rows = series.data?.[key];
  check(`${key} analytics returns 12 months`, Array.isArray(rows) && rows.length === 12 && typeof rows[0]?.count === "number");
}

const banner = await request("GET", "/api/v1/layout/get-layout?type=banner", undefined, { auth: false });
check("homepage banner layout loads", Boolean(banner.data?.layout?.title));

const faq = await request("GET", "/api/v1/layout/get-layout?type=faq", undefined, { auth: false });
check("homepage faq layout loads", Array.isArray(faq.data?.layout?.faq) && faq.data.layout.faq.length >= 1);

const notifications = await request("GET", "/api/v1/notifications/get-all-notification");
check("notifications list loads", notifications.data?.notifications?.length >= 1);
const unread = notifications.data.notifications.find((item) => item.status === "unread");
if (unread) {
  const marked = await request("PUT", `/api/v1/notifications/update-notification-status/${unread._id}`);
  check("notification can be marked read", marked.data?.notification?.status === "read");
}

const tempCategory = await request("POST", "/api/v1/lms/categories", {
  name: `Smoke Category ${Date.now()}`,
  description: "temporary",
});
check("category can be created", Boolean(tempCategory.data?.category?._id));
const updatedCategory = await request("PUT", `/api/v1/lms/categories/${tempCategory.data.category._id}`, {
  name: `Smoke Category Renamed ${Date.now()}`,
});
check("category can be updated", updatedCategory.response.ok);
const deletedCategory = await request("DELETE", `/api/v1/lms/categories/${tempCategory.data.category._id}`);
check("category can be deleted", deletedCategory.response.ok);

const allCategories = await request("GET", "/api/v1/lms/categories/all");
check("categories include course counts", typeof allCategories.data?.categories?.[0]?.courseCount === "number");

const legacyCourse = await request("POST", "/api/v1/course/create-course", {
  name: `Smoke Legacy Course ${Date.now()}`,
  description: "legacy route",
  price: 199,
  estimatedPrice: 499,
  tags: "smoke,legacy",
  level: "Beginner",
  benefits: [{ title: "Benefit" }],
  prerequisites: [{ title: "Prerequisite" }],
  thumbnail: "https://example.com/smoke.jpg",
});
check("legacy course create works", Boolean(legacyCourse.data?.course?._id));
const legacyId = legacyCourse.data.course._id;

const legacyContent = await request("GET", `/api/v1/course/get-course-content/${legacyId}`, undefined, { auth: false });
check("legacy course content works", Array.isArray(legacyContent.data?.sections));

const legacyEdit = await request("PUT", `/api/v1/course/edit-course/${legacyId}`, { price: 249 });
check("legacy course edit works", legacyEdit.data?.course?.price === 249);

const legacyDashboard = await request("GET", "/api/v1/course/get-all-course-dashboard");
check("legacy course dashboard works", legacyDashboard.data?.courses?.some((course) => course._id === legacyId));

const legacyDelete = await request("DELETE", `/api/v1/course/delete-course/${legacyId}`);
check("legacy course delete works", legacyDelete.response.ok);

await loginAs("instructor@learnhub.dev", "Instructor@123");
const instructorCourses = await request("GET", "/api/v1/lms/instructor/courses");
check("instructor courses endpoint", Array.isArray(instructorCourses.data?.courses) && instructorCourses.data.courses.length >= 1);

const instructorCourse = await request("POST", "/api/v1/lms/instructor/courses", {
  name: `Smoke Instructor Course ${Date.now()}`,
  description: "instructor route",
  price: 299,
  estimatedPrice: 599,
  tags: "smoke, instructor",
  level: "Beginner",
  benefits: [{ title: "Benefit" }],
  prerequisites: [{ title: "Prerequisite" }],
  thumbnail: "https://example.com/instructor.jpg",
});
check("instructor course create works", Boolean(instructorCourse.data?.course?._id));
const instructorCourseId = instructorCourse.data.course._id;

const instructorLecture = await request("POST", `/api/v1/lms/instructor/courses/${instructorCourseId}/lectures`, {
  title: "Smoke lecture",
  description: "lecture",
  videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
  videoSection: "Getting started",
  videoLength: 5,
  isPreview: true,
});
check("instructor lecture create works", Boolean(instructorLecture.data?.lecture?._id && instructorLecture.data?.section?._id));

const submitted = await request("POST", `/api/v1/lms/instructor/courses/${instructorCourseId}/submit`);
check("instructor course submit works", submitted.data?.course?.status === "SUBMITTED");

const instructorStudents = await request("GET", "/api/v1/lms/instructor/students");
check("instructor students endpoint", Array.isArray(instructorStudents.data?.students));

const instructorAnalytics = await request("GET", "/api/v1/lms/instructor/analytics");
check("instructor analytics endpoint", typeof instructorAnalytics.data?.totalCourses === "number" && Array.isArray(instructorAnalytics.data?.courses));

const instructorRevenue = await request("GET", "/api/v1/lms/instructor/revenue");
check("instructor revenue endpoint", typeof instructorRevenue.data?.totalRevenue === "number" && Array.isArray(instructorRevenue.data?.byCourse));

const instructorDelete = await request("DELETE", `/api/v1/course/delete-course/${instructorCourseId}`);
check("instructor can delete own course", instructorDelete.response.ok);

await loginAs(email, password);
check("student session restored", Boolean(token));

const profile = await request("PUT", "/api/v1/auth/update-user-info", {
  name: "Smoke Tester Updated",
  email,
});
check("profile update works", profile.data?.user?.name === "Smoke Tester Updated");

const twoFactor = await request("POST", "/api/v1/auth/2fa/setup");
check("2FA setup returns QR and secret", Boolean(twoFactor.data?.qrCode && twoFactor.data?.secret));

const unauthorized = await request("GET", "/api/v1/lms/my-learning", undefined, { auth: false });
token = "";
check("unauthenticated learning request is rejected", unauthorized.response.status === 401);

await request("GET", "/api/v1/auth/logout");

console.log(`\n${failures === 0 ? "All smoke checks passed." : `${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
