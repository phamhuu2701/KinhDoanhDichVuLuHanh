// const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs"); //hash password
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const Accounts = require("../models/account.model");
const mailer = require("../mics/mailer.mics");

exports.register = (req, res, next) => {
  // const err = validationResult(req);
  const verifyToken = randomstring.generate();
  let newAccount = new Accounts(req.body);
  Accounts.getByEmailAndRole(newAccount.email, "user")
    .then(account => {
      if (account && account.email === newAccount.email) {
        const error = new Error();
        error.statusCode = 200;
        error.message = "The email already exists";
        res.status(200).json(error);
        throw error;
      }

      newAccount = { ...newAccount, verifyToken: verifyToken };
      //Quét xem email đã tồn tại không
      //Nếu có thì thông báo email này đã được đăng ký
      //Nếu không có thì tiến hành đăng ký
      // Tiếp theo là quét xem đơn hàng có phone or email nào trùng không,
      //nếu có thì cập nhật idAccount này cho Order đó
      bcrypt
        .hash(newAccount.password, saltRounds)
        .then(async passwordHash => {
          newAccount.password = passwordHash;
          //Ta tiến hành gửi mail ở đây cho người dùng vừa nhập
          // Compose email
          const html = `Hi there,
                        <br/>
                        Thank you for registering!
                        <br/><br/>
                        We are Trùm Tour:
                        <br/><br/>
                        Please verify your email by typing the following token:
                        On the following page:
                        <a href="http://localhost:8000/verify?ddSWuQzP8x2cHckmKxiK=${jwt.sign(
                          verifyToken,
                          "ithoangtansecurity"
                        )}&QZmWYU22y2zb2qZg8clJ=${jwt.sign(
            newAccount.email,
            "ithoangtansecurity"
          )}">http://localhost:8000/verify?${jwt.sign(
            "verifyToken",
            "ithoangtansecurity"
          )}=${jwt.sign(verifyToken, "ithoangtansecurity")}</a>
                        <br/><br/>
                        Have a pleasant day.`;
          //micro service
          await mailer.sendEmail(
            "app156076672@heroku.com",
            newAccount.email,
            "Vui lòng xác thực email của bạn!",
            html
          );
          return Accounts.create(newAccount);
        })
        .then(result => {
          res.status(201).json({
            statusCode: 200,
            result: result,
            idAccount: result.insertId,
            name: newAccount.name,
            email: newAccount.email
          });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          res.status(500).json(err);
          next(err);
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res.status(500).json(err);
      next(err);
    });
};

/**
 * Nhận 2 tham số
 * ddSWuQzP8x2cHckmKxiK verifyToken đã jwt.sign
 * QZmWYU22y2zb2qZg8clJ emailVerify đã jwt.sign
 * Xác minh với CSDL trước đó khi đăng ký
 * Nếu đúng thì
 */
exports.verify = async (req, res, next) => {
  //Ta tiến hành xác minh email và redirect tới trang xác thực thành công ở client
  const verifyToken = await jwt.verify(
    req.query.ddSWuQzP8x2cHckmKxiK,
    "ithoangtansecurity"
  );
  const emailVerify = await jwt.verify(
    req.query.QZmWYU22y2zb2qZg8clJ,
    "ithoangtansecurity"
  );
  Accounts.getByEmailAndRole(emailVerify, "user")
    .then(account => {
      if (!account) {
        const error = new Error();
        error.statusCode = 200;
        error.message = "Some thing Wrong!!!";
        res.status(200).json(error);
        throw error;
      }
      if (account.verifyToken === verifyToken) {
        res.status(200).json({
          statusCode: 200,
          userId: account.idAccount,
          name: account.name,
          email: account.email
        });
      } else {
        const error = new Error();
        error.statusCode = 200;
        error.message = "Something Wrong!";
        res.status(200).json(error);
        throw error;
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res.status(500).json(err);
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  let loadAccount;

  Accounts.getByEmailAndRole(email, role)
    .then(account => {
      if (!account) {
        const error = new Error();
        error.statusCode = 200;
        error.message = "User of this email could not found!!!";
        res.status(200).json(error);
        throw error;
      }
      loadAccount = account;
      return bcrypt.compare(password, account.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error();
        error.statusCode = 200;
        error.message = "Wrong password!";
        res.status(200).json(error);
        throw error;
      }
      const token = jwt.sign(
        {
          idAccount: loadAccount.idAccount,
          email: loadAccount.email,
          role: loadAccount.role
        },
        "ithoangtansecurity"
      );

      let options = {
        maxAge: 60 * 60 * 24, // would expire after 24h
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
      };

      // no: set a new cookie
      res
        .cookie("token", token, options) // options is optional
        .json({
          token: token,
          name: loadAccount.name,
          role: loadAccount.role,
          avatar: loadAccount.avatar
        })
        .status(200);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res.status(500).json(err);
      next(err);
    });
};

exports.loginByFacebook = async (req, res, next) => {
  try {
    const idFacebook = req.body.idFacebook;
    const name = req.body.name;
    const email = req.body.email;

    let account = await Accounts.getByIdFacebook(idFacebook);
    if (!account) {
      account = new Account({
        idFacebook: idFacebook,
        name: name,
        email: email
      });
      await Accounts.create(account);
      const loadAccount = await Accounts.getByIdFaceboook(idFacebook);
      const token = jwt.sign(
        {
          idAccount: loadAccount.idAccount,
          idFacebook: loadAccount.idFacebook.toString(),
          role: loadAccount.role,
          email: loadAccount.email
        },
        "ithoangtansecurity"
      );
      res.status(200).json({
        token: token,
        idAccount: loadAccount.idAccount,
        name: loadAccount.name
      });
    } else {
      const token = jwt.sign(
        {
          idAccount: account.idAccount,
          idFacebook: account.idFacebook.toString(),
          role: account.role,
          email: account.email
        },
        "ithoangtansecurity"
      );

      res.status(200).json({
        token: token,
        name: account.name,
        role: account.role,
        avartar: account.avartar
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(500).json(error);
    next(error);
  }
};

exports.loginByGoogle = async (req, res, next) => {
  try {
    const idGoogle = req.body.idGoogle;
    const name = req.body.name;
    const email = req.body.email;

    let account = await Accounts.getByIdGoogle(idGoogle);
    if (!account) {
      account = new Account({
        idGoogle: idGoogle,
        name: name,
        email: email
      });
      await Accounts.create(account);
      const loadAccount = await Accounts.getByIdGoogle(idGoogle);
      console.log(loadAccount);

      const token = jwt.sign(
        {
          idAccount: loadAccount.idAccount,
          idGoogle: loadAccount.idGoogle.toString(),
          role: loadAccount.role,
          email: loadAccount.email
        },
        "ithoangtansecurity"
      );
      res.status(200).json({
        token: token,
        name: account.name,
        role: account.role,
        avartar: account.avartar
      });
    } else {
      const token = jwt.sign(
        {
          idAccount: account.idAccount,
          idGoogle: account.idGoogle.toString(),
          role: account.role,
          email: account.email
        },
        "ithoangtansecurity"
      );

      res.status(200).json({
        token: token,
        name: account.name
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(500).json(error);
    next(error);
  }
};
