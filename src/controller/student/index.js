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
        "name email phoneNo type rollNo course admissionDate createdAt user",
      populate: "course:courseName|user:referralCode",
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

export const updateAdmission = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { _id: admissionId, installments = [], ...rest } = req.body;

    if (!admissionId) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Admission id is required",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    const admission = await Admission.findById(admissionId)
      .session(session)
      .select(
        "installments totalFees course admissionSource loginEmail loginPassword batch plan teacherid",
      );

    if (!admission) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Admission not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const protectedFields = [
      "course",
      "admissionSource",
      "loginEmail",
      "loginPassword",
      "batch",
      "plan",
      "teacherid",
    ];

    for (const field of protectedFields) {
      if (rest[field] !== undefined) {
        const existingValue = String(admission[field]) || null;
        const incomingValue = String(rest[field]) || null;

        if (existingValue !== incomingValue) {
          await session.abortTransaction();
          return apiHTTPResponse(
            req,
            res,
            CONSTANTS.HTTP_CONFLICT,
            `${field} cannot be changed after admission creation`,
            CONSTANTS.DATA_NULL,
            CONSTANTS.CONFLICT,
          );
        }
      }
    }

    const admissionInstallmentIds = admission.installments.map((i) =>
      String(i),
    );

    for (const inst of installments) {
      if (!inst._id) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          "Installment id is required",
          CONSTANTS.DATA_NULL,
          CONSTANTS.BAD_REQUEST,
        );
      }

      if (!admissionInstallmentIds.includes(inst._id)) {
        await session.abortTransaction();
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_CONFLICT,
          "Invalid installment reference",
          CONSTANTS.DATA_NULL,
          CONSTANTS.CONFLICT,
        );
      }

      const updateData = {};

      if (inst.paymentStatus !== undefined)
        updateData.paymentStatus = inst.paymentStatus;

      if (inst.receiptNumber !== undefined)
        updateData.receiptNumber = inst.receiptNumber;

      if (inst.paymentmode !== undefined)
        updateData.paymentmode = inst.paymentmode;

      if (inst.transctionId !== undefined)
        updateData.transctionId = inst.transctionId;

      if (inst.date !== undefined) updateData.date = inst.date;

      if (Object.keys(updateData).length > 0) {
        await Installment.findByIdAndUpdate(
          inst._id,
          { $set: updateData },
          { session },
        );
      }
    }

    const updatedInstallments = await Installment.find({
      _id: { $in: admission.installments },
    }).session(session);

    const feesReceived = updatedInstallments.reduce(
      (sum, inst) =>
        inst.paymentStatus === "Paid" ? sum + (inst.amount || 0) : sum,
      0,
    );

    const balance = admission.totalFees - feesReceived;

    await Admission.findByIdAndUpdate(
      admissionId,
      {
        $set: {
          feesReceived,
          balance,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Admission updated successfully",
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

export const reAdmitStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, ...inputData } = req.body;

    if (!userId) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "User id is required",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    if (!inputData.course || !inputData.batch || !inputData.plan) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Course, batch and plan are required",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "User not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const lastAdmission = await Admission.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .session(session);

    if (!lastAdmission) {
      await session.abortTransaction();
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "Previous admission not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const installmentsData = inputData.installments || [];
    delete inputData.installments;

    const batch = await Batch.findById(inputData.batch).session(session);

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

    const plan = await CoursePlans.findById(inputData.plan).session(session);

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

    const admissionData = {
      ...inputData,
      type: "Re-Admission",
      user: user._id,

      name: lastAdmission.name,
      surname: lastAdmission.surname,
      email: lastAdmission.email,
      phoneNo: lastAdmission.phoneNo,
      aadharNo: lastAdmission.aadharNo,
      dateOfBirth: lastAdmission.dateOfBirth,
      gender: lastAdmission.gender,
      admissionSource: lastAdmission.admissionSource,
      category: lastAdmission.category,
      religion: lastAdmission.religion,
      qualification: lastAdmission.qualification,
      bloodGroup: lastAdmission.bloodGroup,
      photo: lastAdmission.photo,
      idProof: lastAdmission.idProof,
      addressProof: lastAdmission.addressProof,
      address: lastAdmission.address,
      fatherName: lastAdmission.fatherName,
      motherName: lastAdmission.motherName,
      fatherOccupation: lastAdmission.fatherOccupation,
      fatherPhoneNo: lastAdmission.fatherPhoneNo,
      motherPhoneNo: lastAdmission.motherPhoneNo,
      loginEmail: lastAdmission.loginEmail,
      loginPassword: lastAdmission.loginPassword,
      userImage: lastAdmission.userImage,
      rollNo: await generateRollNo(),
    };

    const admission = await Admission.create([admissionData], { session });
    const createdAdmission = admission[0];

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
      "Student re-admitted successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    await session.abortTransaction();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      error.message,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  } finally {
    session.endSession();
  }
};

export const viewOverview = async (req, res) => {
  try {
    const { id } = req.user;

    const pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          isDeleted: false,
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
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          course: {
            _id: "$course._id",
            courseName: "$course.courseName",
          },
          admissionDate: 1,
          rollNo: 1,
          type: 1,
        },
      },
    ];

    return crudService.executeAggregation(Admission, pipeline)(req, res);
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

export const myCourses = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = 1, size = 10 } = req.body;

    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;

    const pipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          isDeleted: false,
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
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          course: {
            _id: "$course._id",
            courseName: "$course.courseName",
            actualPrice: "$course.actualPrice",
            sellingPrice: "$course.sellingPrice",
            duration: "$course.duration",
            totalLectures: "$course.totalLectures",
            description: "$course.description",
          },
          admissionDate: 1,
          rollNo: 1,
          type: 1,
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }],
          list: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $unwind: {
          path: "$metadata",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          total: { $ifNull: ["$metadata.total", 0] },
          page: { $literal: Number(page) },
          size: { $literal: limit },
          list: 1,
        },
      },
    ];

    return crudService.executeAggregation(
      Admission,
      pipeline,
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in myCourses", error, "error");
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
