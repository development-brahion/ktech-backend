import {
  Admission,
  Batch,
  CoursePlans,
  Installment,
  ReferralAmount,
  User,
} from "../../models/index.js";
import {
  apiHTTPResponse,
  hashAndEncryptPassword,
  logMessage,
} from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import {
  generateRollNo,
  generateUniqueReferralCode,
} from "../../services/helperService.js";
import mongoose from "mongoose";

export const getAllStudents = async (req, res) => {
  try {
    const baseQuery = req.body?.query
      ? typeof req.body.query === "string"
        ? JSON.parse(req.body.query)
        : req.body.query
      : {};

    Object.assign(req.body, {
      select: req.body.select || "name email",
      query: {
        ...baseQuery,
        role: "Student",
      },
      sortBy: req.body.sortBy || "name",
      sortOrder: req.body.sortOrder || "asc",
    });

    return crudService.getALLDocuments(User, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error getting all students", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getStudentEnrolledCoursesWithInstallments = async (req, res) => {
  try {
    const { id } = req.body;

    req.body = {
      query: { user: id },
      select: "name email course installments",
      populate:
        "course:courseName|installments:name,status,amount,date,paymentStatus,receiptNumber,paymentmode,transctionId",
      sortBy: "course.courseName",
      sortOrder: "asc",
    };

    return crudService.getALLDocuments(Admission, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get student enrolled courses", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getAdmissionsList = async (req, res) => {
  try {
    Object.assign(req.body, {
      searchFields: "name email phoneNo",
      sortBy: req.body.sortBy || "createdAt",
      sortOrder: req.body.sortOrder || "desc",
      select:
        "name email phoneNo referralCode type rollNo course admissionDate createdAt",
      populate: "course:courseName",
    });
    return crudService.getList(Admission, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in get admission list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getAdmissionDetails = async (req, res) => {
  try {
    return crudService.getById(Admission)(req, res);
  } catch (error) {
    logMessage("Error in get admission details", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getAllAdmissions = async (req, res) => {
  try {
    Object.assign(req.body, {
      searchFields: "name email phoneNo",
      sortBy: req.body.sortBy || "createdAt",
      sortOrder: req.body.sortOrder || "desc",
      select:
        "name email phoneNo referralCode type rollNo course admissionDate createdAt",
      populate: "course:courseName",
    });
    return crudService.getALLDocuments(Admission, CONSTANTS.BOOLEAN_FALSE)(
      req,
      res,
    );
  } catch (error) {
    logMessage("Error in get all admissions", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const createAdmission = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const inputData = { ...req.body, type: "New-Admission" };

    const installmentsData = inputData.installments || [];
    delete inputData.installments;

    if (inputData.batch) {
      const batch = await Batch.findById(inputData.batch);

      if (!batch) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_NOT_FOUND,
          "Batch not found",
          CONSTANTS.DATA_NULL,
          CONSTANTS.NOT_FOUND,
        );
      }

      if (batch.availableSeat <= 0) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_CONFLICT,
          "Selected batch is full",
          CONSTANTS.DATA_NULL,
          CONSTANTS.CONFLICT,
        );
      }

      batch.availableSeat -= 1;
      await batch.save({ session });
    }

    if (inputData.plan) {
      const plan = await CoursePlans.findById(inputData.plan);

      if (!plan) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_NOT_FOUND,
          "Course plan not found",
          CONSTANTS.DATA_NULL,
          CONSTANTS.NOT_FOUND,
        );
      }

      const courseFee = plan.amount || 0;
      inputData.fee = courseFee;

      let totalFees = courseFee;

      if (inputData.discountRate && inputData.discountAmount) {
        if (inputData.discountRate === "Amount") {
          totalFees -= inputData.discountAmount;
        } else if (inputData.discountRate === "Percent") {
          totalFees -= (courseFee * inputData.discountAmount) / 100;
        }
      }

      inputData.totalFees = totalFees;

      let feesReceived = 0;

      if (installmentsData.length > 0) {
        feesReceived = installmentsData.reduce(
          (sum, inst) =>
            inst.paymentStatus === "Paid" ? sum + (inst.amount || 0) : sum,
          0,
        );
      }

      inputData.feesReceived = feesReceived;
      inputData.balance = totalFees - feesReceived;
    }

    let walletAmount = 0;

    if (inputData.referredBy) {
      const referredUser = await User.findOne({
        referralCode: inputData.referredBy,
      });

      if (!referredUser) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_NOT_FOUND,
          "Referral user not found",
          CONSTANTS.DATA_NULL,
          CONSTANTS.NOT_FOUND,
        );
      }

      const referralAmount = await ReferralAmount.findOne();

      if (!referralAmount) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_NOT_FOUND,
          "Referral amount not set",
          CONSTANTS.DATA_NULL,
          CONSTANTS.NOT_FOUND,
        );
      }

      walletAmount = referralAmount.amount;
      referredUser.amount += walletAmount;
      await referredUser.save({ session });
    }

    inputData.rollNo = await generateRollNo();

    const admission = await Admission.create([inputData], { session });
    const createdAdmission = admission[0];

    const existingUser = await User.findOne({
      email: createdAdmission.loginEmail,
    });

    if (existingUser) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        "Email already exists",
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    const { hashedPassword, encryptedPassword } = await hashAndEncryptPassword(
      createdAdmission.loginPassword,
    );

    const referralCode = await generateUniqueReferralCode();

    const userData = {
      name: createdAdmission.name,
      email: createdAdmission.loginEmail,
      phoneNo: createdAdmission.phoneNo,
      address: createdAdmission.address,
      password: hashedPassword,
      originalPassword: encryptedPassword,
      referralCode,
      role: "Student",
      amount: walletAmount,
    };

    const createdUser = await User.create([userData], { session });

    createdAdmission.user = createdUser[0]._id;
    await createdAdmission.save({ session });

    if (installmentsData.length > 0) {
      const pendingTotal = installmentsData
        .filter((i) => i.paymentStatus === "Pending")
        .reduce((sum, i) => sum + (i.amount || 0), 0);

      if (pendingTotal !== createdAdmission.balance) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          "Installment total must match balance",
          CONSTANTS.DATA_NULL,
          CONSTANTS.BAD_REQUEST,
        );
      }

      const installmentDocs = installmentsData.map((i) => ({
        name: i.name,
        amount: i.amount,
        date: i.date,
        paymentStatus: i.paymentStatus,
        receiptNumber: i.receiptNumber,
        paymentmode: i.paymentmode,
        transctionId: i.transctionId,
        course: createdAdmission.course,
        batch: createdAdmission.batch,
        student: createdAdmission.user,
      }));

      const createdInstallments = await Installment.insertMany(
        installmentDocs,
        { session },
      );

      createdAdmission.installments = createdInstallments.map((i) => i._id);

      await createdAdmission.save({ session });
    }

    await session.commitTransaction();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "New admission created successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    await session.abortTransaction();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      error.message || CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  } finally {
    session.endSession();
  }
};
