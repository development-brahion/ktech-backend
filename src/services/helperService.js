import { Admission, User } from "../models/index.js";
import { generateUniqueId } from "../utils/globalFunction.js";

export const generateUniqueReferralCode = async () => {
  let referralCode;
  let exists = true;

  while (exists) {
    referralCode = generateUniqueId("REF").toUpperCase();

    const existingUser = await User.findOne({
      referralCode,
    });

    exists = !!existingUser;
  }

  return referralCode;
};

export const generateRollNo = async () => {
  const year = new Date().getFullYear();

  const lastAdmission = await Admission.findOne({
    rollNo: { $regex: `^STU${year}` },
  })
    .sort({ rollNo: -1 })
    .lean();

  let nextNumber = 1;

  if (lastAdmission?.rollNo) {
    const lastNumber = parseInt(lastAdmission.rollNo.slice(-5));
    nextNumber = lastNumber + 1;
  }

  const rollNo = `STU${year}${String(nextNumber).padStart(5, "0")}`;

  return rollNo;
};
