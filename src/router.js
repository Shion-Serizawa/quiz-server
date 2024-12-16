import { Router } from "@oak/oak";
import * as Errors from "/utils/errors.js";
import { Permissions } from "/config/roles.js";
import { auth } from "/middlewares/auth_middlewares.js";
import SampleController from "/controllers/sample_controller.js";
import AuthController from "/controllers/auth_controller.js";
import UserController from "/controllers/user_controller.js";
import QuestionController from "/controllers/question_controller.js";
import AnswerController from "./controllers/answer_controller.js";
import RankingController from "/controllers/ranking_controller.js";
import ImageController from "/controllers/image_controller.js";
import StatusController from "/controllers/status_controller.js";

const router = new Router();

// sample
router.get("/hello", async (ctx) => {
  await ctx.cookies.set("hello", "world", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    ignoreInsecure: true, // これがないとなぜか動かない
  });
  ctx.response.body = { hello: "world" };
});
// sample
router.get("/error/400", (ctx) => {
  ctx.response.body = Errors.BAD_REQUEST;
});
// sample
router.get("/me", auth([Permissions.GET_ME]), SampleController.getMe);

router.post("/signup", UserController.create);
router.post("/signin", AuthController.signin);
router.post("/signout", AuthController.signout);

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
  //auth([Permissions.POST_ANSWERS]),
  AnswerController.answer,
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
  auth([Permissions.POST_STATUS]),
  StatusController.post,
);

export { router };
