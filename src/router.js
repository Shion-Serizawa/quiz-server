import { Router } from "@oak/oak";
import * as Errors from "/utils/errors.js";
import { Permissions } from "/config/roles.js";
import { auth } from "/middlewares/auth_middlewares.js";
import AuthController from "/controllers/auth_controller.js";
import UserController from "/controllers/user_controller.js";
import QuestionController from "/controllers/question_controller.js";
import AnswerController from "./controllers/answer_controller.js";
import RankingController from "/controllers/ranking_controller.js";
import ImageController from "/controllers/image_controller.js";
import StatusController from "/controllers/status_controller.js";

const router = new Router();

// sample
router.get("/hello", (ctx) => {
  ctx.response.body = { hello: "world" };
});
// sample
router.get("/error/400", (ctx) => {
  ctx.response.body = Errors.BAD_REQUEST;
});

router.post("/signup", UserController.create);
router.post("/signin", AuthController.signin);
router.post("/signout", AuthController.signout);

router.get("/me", auth([Permissions.GET_ME]), UserController.getMe);

router.post(
  "/questions",
  //auth([Permissions.POST_QUESTIONS]),
  QuestionController.postQuestion,
);
router.get(
  "/questions/admin/:questionId",
  //auth([Permissions.ALWAYS_SEE_ANSWER]),
  QuestionController.getQuestionByAdmin,
);
router.get(
  "/questions/:questionId",
  //auth([Permissions.GET_QUESTIONS]),
  QuestionController.getQuestion,
);
router.delete(
  "/questions/:questionId",
  //auth([Permissions.DELETE_QUESTIONS]),
  QuestionController.deleteQuestion,
);

router.post(
  "/questions/:questionId/answer",
  auth([Permissions.POST_ANSWERS]),
  AnswerController.post,
);

router.get(
  "/questions/:questionId/answer",
  auth([Permissions.GET_ANSWERS]),
  AnswerController.get,
);

router.get(
  "/ranking",
  //auth([Permissions.GET_RANKING]),
  RankingController.get,
);

router.get(
  "/images/:filename",
  //auth([Permissions.GET_QUESTIONS]),
  ImageController.get,
);

router.post(
  "/status",
  //auth([Permissions.POST_STATUS]),
  StatusController.post,
);

router.get(
  "/status",
  //auth([Permissions.GET_STATUS]),
  StatusController.get,
);

export { router };
