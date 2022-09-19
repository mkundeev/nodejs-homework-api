require("dotenv").config();
const { User } = require("../db/usersSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { app } = require("../services/fierbaseConfig");
const storage = getStorage(app);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const {
  Conflict,
  Unauthorized,
  InternalServerError,
  NotFound,
} = require("http-errors");

const addUser = async (body) => {
  if (await User.findOne({ email: body.email })) {
    throw new Conflict("Email in use");
  }

  const avatarURL = gravatar.url(body.email);
  const verificationToken = uuidv4();
  const user = new User({ ...body, avatarURL, verificationToken });

  const msg = {
    to: body.email,
    from: "mkundeev@gmail.com",
    subject: "Contactsbook email verification",
    text: `Please confirm your email POST https://contacts-book-mk.herokuapp.com/api/users/verify/${verificationToken}`,
    html: `Please confirm your email POST https://contacts-book-mk.herokuapp.com/api/users/verify/${verificationToken}`,
  };
  await sgMail.send(msg);

  await user.save();
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("Email or password is wrong");
  }
  if (!user?.verify) {
    throw new Unauthorized("Please verify your email");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotFound("Email or password is wrong");
  }
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.SECRET
  );
  const logedInUser = await User.findOneAndUpdate(
    { email },
    { token },
    {
      new: true,
    }
  );
  return logedInUser;
};

const logOut = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { token: null },
      {
        new: true,
      }
    );
    return user;
  } catch (err) {
    throw new InternalServerError("Server error");
  }
};

const getUser = async (userId) => {
  try {
    return User.findById(userId);
  } catch (err) {
    throw new InternalServerError("Server error");
  }
};

const updateSubscription = async (body, userId) => {
  try {
    return User.findByIdAndUpdate(userId, body, {
      new: true,
    });
  } catch (err) {
    throw new InternalServerError("Server error");
  }
};

const changeAvatar = async (req, userId) => {
  if (!req.file) {
    throw new Conflict("Please add image for avatar");
  }
  try {
    const file = req.file;
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file.buffer, {
      contentType: "image/png",
    });
    const downloadURL = await getDownloadURL(ref(storage, `avatars/${userId}`));
    return User.findByIdAndUpdate(
      userId,
      { avatarURL: downloadURL },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const findUserByVerificationToken = async (verificationToken) => {
  try {
    const user = User.findOneAndUpdate(
      { verificationToken },
      { verificationToken: null, verify: true },
      {
        new: true,
      }
    );
    return user;
  } catch (err) {
    throw new InternalServerError("Server error");
  }
};

const resendEmail = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("Wrong email");
  }

  if (user?.verify) {
    throw new Conflict("Verification has already been passed");
  }
  const msg = {
    to: email,
    from: "mkundeev@gmail.com",
    subject: "Contactsbook email verification",
    text: `Please confirm your email POST https://contacts-book-mk.herokuapp.com/api/users/verify/${user.verificationToken}`,
    html: `Please confirm your email POST https://contacts-book-mk.herokuapp.com/api/users/verify/${user.verificationToken}`,
  };
  await sgMail.send(msg);
};

module.exports = {
  addUser,
  loginUser,
  logOut,
  getUser,
  updateSubscription,
  changeAvatar,
  findUserByVerificationToken,
  resendEmail,
};
