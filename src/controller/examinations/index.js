import {
  Admission,
  Answer,
  Examination,
  Goal,
  HallTicket,
  Role,
  User,
} from "../../models/index.js";
import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import { findOneByQueryLean } from "../../services/serviceGlobal.js";
import mongoose from "mongoose";

export const getExaminationList = async (req, res) => {
  try {
    const baseQuery = req.body?.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    if (!baseQuery.type) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Please provide type of examination.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    let select = "";
    let populate = "";
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "desc";

    switch (baseQuery.type) {
      case "Role":
        select =
          "role examtitle examduration passingPercentage type createAt isDraft";
        populate = "role:name,course|role.course:courseName";
        break;
      case "Goal":
        select =
          "goal examtitle examduration passingPercentage type createAt isDraft";
        populate = "goal:name,designation|role.designation:name";
        break;
      default:
        select =
          "course batch examtitle examduration passingPercentage type createAt isDraft";
        populate = "course:courseName|batch:startTime,endTime";
    }

    Object.assign(req.body, {
      select,
      populate,
      sortBy,
      sortOrder,
      query: baseQuery,
    });

    return crudService.getList(Examination, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in get examination list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getExaminationDetails = async (req, res) => {
  try {
    return crudService.getById(Examination)(req, res);
  } catch (error) {
    logMessage("Error in get examination details", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const createExamination = async (req, res) => {
  try {
    return crudService.create(
      Examination,
      "Examination created successfully",
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in create examination", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updateExamination = async (req, res) => {
  try {
    const { _id } = req.body;

    const { statusCode, data } = await findOneByQueryLean(Examination, {
      _id,
      isDeleted: CONSTANTS.BOOLEAN_FALSE,
    });

    if (statusCode !== CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Examination not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    if (!data.isDraft) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Update is not allowed on this examination.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
    return crudService.update(
      Examination,
      "Examination updated successfully",
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in update examination", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getExaminationResultList = async (req, res) => {
  try {
    const baseQuery = req.body.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    if (["Teacher", "Student"].includes(req.user.role)) {
      baseQuery.userId = req.user.id;
    }
    Object.assign(req.body, {
      select: "userId examination result marks type createdAt",
      populate: "userId:name,email,role|examination:examtitle",
      query: baseQuery,
    });

    return crudService.getList(Answer, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in get examination result list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getExaminationResultDetails = async (req, res) => {
  try {
    Object.assign(req.body, {
      select: "userId examination result marks type createdAt studentanswer",
      populate:
        "userId:name,email,role|examination:examtitle,passingPercentage,questions",
    });

    return crudService.getById(Answer)(req, res);
  } catch (error) {
    logMessage("Error in get examination result details", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getHallTicketList = async (req, res) => {
  try {
    Object.assign(req.body, {
      select: "_id user_id examination_id admission_id createdAt",
      populate:
        "user_id:name,email,rollNo|examination_id:examtitle,examduration|admission_id:fatherName,motherName,course,batch|admission_id.course:courseName|admission_id.batch:startTime,endTime",
    });
    return crudService.getList(HallTicket, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in get hall ticket list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const addHallTicket = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user_id, examination_id, admission_id } = req.body;

    const hallTicket = await HallTicket.create(
      [
        {
          user_id,
          examination_id,
          admission_id,
        },
      ],
      { session },
    );

    const updatedAdmission = await Admission.findByIdAndUpdate(
      admission_id,
      {
        hallTicket: hallTicket[0]._id,
      },
      { new: true, session },
    );

    if (!updatedAdmission) {
      await session.abortTransaction();
      session.endSession();

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Admission not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    await session.commitTransaction();
    session.endSession();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Hall ticket generated successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logMessage("Error in add hall ticket", error, "error");

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getAllExaminations = async (req, res) => {
  try {
    return crudService.getALLDocuments(Examination, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all examinations", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getRoleExaminationsForTeacher = async (req, res) => {
  try {
    const { id } = req.user;
    const { roleId } = req.params;

    const roleData = await Role.findOne({
      _id: roleId,
      isDeleted: false,
      assignTo: {
        $elemMatch: {
          user: id,
          status: "Approved",
        },
      },
    }).select("_id");

    if (!roleData) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Role examination not approved for this teacher",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    const examination = await Examination.aggregate([
      {
        $match: {
          role: new mongoose.Types.ObjectId(roleId),
          type: "Role",
          isDeleted: false,
          isDraft: false,
        },
      },
      {
        $project: {
          examtitle: 1,
          examduration: 1,
          passingPercentage: 1,
          questions: {
            $map: {
              input: "$questions",
              as: "q",
              in: {
                question: "$$q.question",
                option_1: "$$q.option_1",
                option_2: "$$q.option_2",
                option_3: "$$q.option_3",
                option_4: "$$q.option_4",
              },
            },
          },
        },
      },
      { $limit: 1 },
    ]);

    if (!examination.length) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Role examination not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Role examination fetched",
      examination[0],
      CONSTANTS.SUCCESS,
    );
  } catch (error) {
    logMessage("Error in get role examinations for teacher", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getGoalExaminationsForTeacher = async (req, res) => {
  try {
    const { id } = req.user;
    const { goalId } = req.params;

    const goalData = await Goal.findOne({
      _id: goalId,
      isDeleted: false,
      assignTo: {
        $elemMatch: {
          user: id,
          status: "Approved",
        },
      },
    }).select("_id");

    if (!goalData) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Goal examination not approved for this teacher",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    const examination = await Examination.aggregate([
      {
        $match: {
          goal: new mongoose.Types.ObjectId(goalId),
          type: "Goal",
          isDeleted: false,
          isDraft: false,
        },
      },
      {
        $project: {
          examtitle: 1,
          examduration: 1,
          passingPercentage: 1,
          questions: {
            $map: {
              input: "$questions",
              as: "q",
              in: {
                question: "$$q.question",
                option_1: "$$q.option_1",
                option_2: "$$q.option_2",
                option_3: "$$q.option_3",
                option_4: "$$q.option_4",
              },
            },
          },
        },
      },
      { $limit: 1 },
    ]);

    if (!examination.length) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Goal examination not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Goal examination fetched",
      examination[0],
      CONSTANTS.SUCCESS,
    );
  } catch (error) {
    logMessage("Error in get goal examinations for teacher", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const attemptExam = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { userId, examId, answers } = req.body;

    let responseData;

    await session.withTransaction(async () => {
      const existingAttempt = await ExamAttempt.findOne({
        user: userId,
        exam: examId,
        isDeleted: false,
      }).session(session);

      // 🚫 Already passed
      if (existingAttempt && existingAttempt.isPassed) {
        throw new Error("You have already passed this exam");
      }

      // 🔄 Update if failed / not passed
      if (existingAttempt) {
        existingAttempt.answers = answers;
        existingAttempt.attemptCount += 1;
        existingAttempt.submittedAt = new Date();

        await existingAttempt.save({ session });

        responseData = {
          message: "Exam re-attempt updated",
          data: existingAttempt,
        };
        return;
      }

      // ✅ First attempt create
      const newAttempt = await ExamAttempt.create(
        [
          {
            user: userId,
            exam: examId,
            answers,
            attemptCount: 1,
            submittedAt: new Date(),
          },
        ],
        { session },
      );

      responseData = {
        message: "Exam attempt created",
        data: newAttempt[0],
      };
    });

    session.endSession();

    return res.json({
      success: true,
      ...responseData,
    });
  } catch (error) {
    session.endSession();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitExam = async (req, res) => {
  const mongoSession = await mongoose.startSession();

  try {
    const { examId, studentanswer, type, roleId, goalId } = req.body;

    const userId = req.user.id;

    await mongoSession.withTransaction(async () => {
      if (type === "Role" && !roleId) {
        throw new Error("roleId is required when type is Role");
      }

      if (type === "Goal" && !goalId) {
        throw new Error("goalId is required when type is Goal");
      }

      const exam = await Examination.findById(examId).session(mongoSession);
      if (!exam) throw new Error("Exam not found");

      const existing = await Answer.findOne({
        examination: examId,
        userId,
        isDeleted: false,
      }).session(mongoSession);

      if (existing && existing.result === "PASS") {
        throw new Error("You already passed this exam");
      }

      let score = 0;
      const total = exam.questions.length;

      const resultArray = exam.questions.map((q, i) => {
        const correct = q.answer;
        const selected = studentanswer[i] || "";
        const iscorrect = correct === selected;
        if (iscorrect) score++;

        return {
          correctanswer: correct,
          selectanswerbystudent: selected,
          iscorrect,
        };
      });

      const percentage = (score / total) * 100;
      const resultStatus =
        percentage >= exam.passingPercentage ? "PASS" : "FAIL";

      if (type === "Role") {
        await User.findByIdAndUpdate(
          userId,
          {
            $addToSet: resultStatus === "PASS" ? { Roleid: roleId } : {},
          },
          { session: mongoSession },
        );
      }

      if (type === "Goal") {
        await User.findByIdAndUpdate(
          userId,
          {
            $addToSet: resultStatus === "PASS" ? { Goalid: goalId } : {},
          },
          { session: mongoSession },
        );
      }

      let finalAnswer;

      if (existing) {
        existing.studentanswer = studentanswer;
        existing.marks = score;
        existing.result = resultStatus;
        existing.attemptCount = (existing.attemptCount || 1) + 1;

        await existing.save({ session: mongoSession });
        finalAnswer = existing;
      } else {
        const created = await Answer.create(
          [
            {
              examination: examId,
              userId,
              studentanswer,
              marks: score,
              result: resultStatus,
              type,
              attemptCount: 1,
            },
          ],
          { session: mongoSession },
        );

        finalAnswer = created[0];
      }

      const admission = await Admission.findOne({ user: userId }).session(
        mongoSession,
      );

      if (admission) {
        admission.result = finalAnswer._id;
        admission.attemptedexam = true;
        admission.ispassed = resultStatus === "PASS";
        await admission.save({ session: mongoSession });
      }

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        "Exam submitted",
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    });

    mongoSession.endSession();
  } catch (error) {
    mongoSession.endSession();
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      error.message || CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  }
};

export const getStudentExamsList = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = 1, size = 10 } = req.body;

    const limit = Number(size);
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: { isDeleted: false, isDraft: false, type: "Student" },
      },

      {
        $lookup: {
          from: "admissions",
          let: { course: "$course", batch: "$batch" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$course", "$$course"] },
                    { $eq: ["$batch", "$$batch"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(id)] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "admission",
        },
      },

      {
        $unwind: "$admission",
      },

      {
        $lookup: {
          from: "halltickets",
          let: { examId: "$_id", admissionId: "$admission._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$examination_id", "$$examId"] },
                    { $eq: ["$admission_id", "$$admissionId"] },
                    { $eq: ["$user_id", new mongoose.Types.ObjectId(id)] },
                  ],
                },
              },
            },
          ],
          as: "hallticket",
        },
      },

      {
        $addFields: {
          hallticketdata: { $gt: [{ $size: "$hallticket" }, 0] },
          attemptedexam: "$admission.attemptedexam",
          ispassed: "$admission.ispassed",
        },
      },

      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },

      {
        $lookup: {
          from: "batches",
          localField: "batch",
          foreignField: "_id",
          as: "batch",
        },
      },
      { $unwind: "$batch" },

      {
        $addFields: {
          hallticketId: { $arrayElemAt: ["$hallticket._id", 0] },
        },
      },

      {
        $project: {
          _id: 1,
          examtitle: 1,
          time: 1,
          examduration: 1,
          passingPercentage: 1,

          course: {
            _id: "$course._id",
            courseName: "$course.courseName",
          },

          batch: {
            _id: "$batch._id",
            startTime: "$batch.startTime",
            endTime: "$batch.endTime",
          },

          hallticketId: 1,
          ispassed: 1,
          hallticketdata: 1,
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }],
          list: [{ $skip: skip }, { $limit: limit }],
        },
      },
      { $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          total: { $ifNull: ["$metadata.total", 0] },
          page: { $literal: Number(page) },
          size: { $literal: limit },
          list: 1,
        },
      },
    ];

    return crudService.executeAggregation(Examination, pipeline)(req, res);
  } catch (error) {
    logMessage("Error in get student exams list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getStudentExamById = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: examinationId } = req.params;

    const exam = await Examination.findOne({
      _id: examinationId,
      type: "Student",
      isDeleted: false,
      isDraft: false,
    })
      .select(
        "_id course batch examtitle examduration passingPercentage questions",
      )
      .lean();

    if (!exam) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Examination not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const admission = await Admission.findOne({
      user: userId,
      course: exam.course,
      batch: exam.batch,
      isDeleted: false,
    }).select("_id attemptedexam ispassed");

    if (!admission) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Student not enrolled for this exam",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    const questions = exam.questions.map((q) => ({
      question: q.question,
      option_1: q.option_1,
      option_2: q.option_2,
      option_3: q.option_3,
      option_4: q.option_4,
    }));

    const hall = await HallTicket.findOne({
      user_id: userId,
      examination_id: examinationId,
      admission_id: admission._id,
      isDeleted: false,
    }).select("_id");

    const response = {
      _id: exam._id,
      examtitle: exam.examtitle,
      examduration: exam.examduration,
      passingPercentage: exam.passingPercentage,
      questions,
      hallticketId: hall?._id || null,
      attemptedexam: admission.attemptedexam,
      ispassed: admission.ispassed,
    };

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Student exam fetched",
      response,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in get student exam by id", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};
