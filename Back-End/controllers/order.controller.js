const MD5 = require("md5");

const Order = require("../models/order.model");

exports.listAll = function(req, res) {
  //Nên dùng express-validator để validator dữ liệu trước
  //Nhưng vì không có thời gian nên khoan làm
  //https://express-validator.github.io/docs/
  const idAccount = req.query.idAccount;
  if (idAccount !== null && idAccount !== undefined && idAccount !== "") {
    //Cú pháp cũ với callback - các controller khác sẽ dùng với Promise
    Order.getAllOrderForUser(req.query.idAccount, function(err, order) {
      if (err) res.send(err);
      res.json(order);
    });
  } else {
    //Cú pháp cũ với callback - các controller khác sẽ dùng với Promise
    Order.getAllOrder(function(err, order) {
      if (err) res.send(err);
      res.json(order);
    });
  }
};
exports.create = function(req, res) {
  //Nên dùng express-validator để validator dữ liệu trước
  //Nhưng vì không có thời gian nên khoan làm
  //https://express-validator.github.io/docs/

  //Cú pháp cũ với callback - các controller khác sẽ dùng với Promise
  let newOrder = new Order(req.body);

  //60% giá vé đối với trẻ em
  newOrder.totalPrice =
    newOrder.numberPeople * newOrder.totalPrice +
    newOrder.numberChildren * newOrder.totalPrice * 0.6;
  Order.createOrder(newOrder, function(err, order) {
    if (err) res.send(err);
    res.json(order);
  });
};

exports.read = function(req, res) {
  //Nên dùng express-validator để validator dữ liệu trước
  //Nhưng vì không có thời gian nên khoan làm
  //https://express-validator.github.io/docs/

  const idAccount = req.query.idAccount;
  if (idAccount !== null && idAccount !== undefined && idAccount !== "") {
    //Cú pháp cũ với callback - các controller khác sẽ dùng với Promisez
    Order.getOrderByIdWithIdAccount(
      req.query.idOrder,
      req.query.idAccount,
      function(err, order) {
        if (err) res.send(err);
        res.json(order[0]); //Đã là API thì trả về phải chuẩn
        //Chỉ có một phần tử thì không lý do gì phải res về một mảng
      }
    );
  } else {
    //Cú pháp cũ với callback - các controller khác sẽ dùng với Promisez
    Order.getOrderById(req.query.idOrder, function(err, order) {
      if (err) res.send(err);
      res.json(order[0]); //Đã là API thì trả về phải chuẩn
      //Chỉ có một phần tử thì không lý do gì phải res về một mảng
    });
  }
};
exports.readByEmail = function(req, res) {
  //Nên dùng express-validator để validator dữ liệu trước
  //Nhưng vì không có thời gian nên khoan làm
  //https://express-validator.github.io/docs/
  Order.getOrderByEmail(req.query.email, function(err, order) {
    if (err) res.send(err);
    res.json(order); //Đã là API thì trả về phải chuẩn
    //Chỉ có một phần tử thì không lý do gì phải res về một mảng
  });
};

exports.update = function(req, res) {
  //Nên dùng express-validator để validator dữ liệu trước
  //Nhưng vì không có thời gian nên khoan làm
  //https://express-validator.github.io/docs/

  //Cú pháp cũ với callback - các controller khác sẽ dùng với Promise
  // Phải truyền vào như v kh thì dăn lỗi ...
  updateOrder = new Order(req.body);
  Order.updateById(updateOrder, function(err, updateOrder) {
    if (err) res.send(err);
    res.send(updateOrder);
  });
};

exports.delete = function(req, res) {
  //Nên dùng express-validator để validator dữ liệu trước
  //Nhưng vì không có thời gian nên khoan làm
  //https://express-validator.github.io/docs/

  //Cú pháp cũ với callback - các controller khác sẽ dùng với Promise
  Order.remove(req.query.idOrder, function(err, idOrder) {
    if (err) res.send(err);
    res.send(idOrder);
  });
};

/**
 * Tính toán và trả về link dẫn đến trang thanh toán của ngânlượng.vn
 */
exports.getLinkPayment = function(req, res) {
  // Nhận các tham số:
  // Thông tin tour req.body.tour
  // Thông tin khách hàng: req.body.order
  // Tạo order
  let newOrder = new Order(req.body.order);
  let tour = req.body.tour;
  newOrder.totalPrice =
    newOrder.numberPeople * newOrder.totalPrice +
    newOrder.numberChildren * newOrder.totalPrice * 0.6;
  console.log(newOrder);

  Order.createOrder(newOrder, function(err, order) {
    if (err) res.send(err);
    // Tính tổng price dựa trên số người lớn và trẻ nhỏ (giá bằng 60% người lớn)

    const arrayAddress = JSON.parse(newOrder.address);
    const address = `${arrayAddress[0]}, ${arrayAddress[1]}, ${arrayAddress[2]}`;
    let secureCode = MD5(
      `${process.env.MERCHANT_SITE_CODE} ${process.env.RETURN_URL} ${
        process.env.RECEIVER
      } ${process.env.TRANSACTION_INFO} ${newOrder.PIN} ${
        newOrder.totalPrice
      } vnd 1 0 0 0 0 Tour:${tour.titleTour.trim().replace(/\s/g, "")}People-${
        newOrder.numberPeople
      }Children-${newOrder.numberChildren} ${newOrder.buyer
        .trim()
        .replace(/\s/g, "")}*|*${newOrder.email
        .trim()
        .replace(/\s/g, "")}*|*${newOrder.phone
        .trim()
        .replace(/\s/g, "")}*|*${address.trim().replace(/\s/g, "")}  ${
        process.env.SECURE_PASS_SANDBOX
      }`
    );
    //Tính toán link: để trả về cho trên kia
    const link = `${process.env.ENVIROMENT_NGANLUONG}?merchant_site_code=${
      process.env.MERCHANT_SITE_CODE
    }&return_url=${process.env.RETURN_URL}&receiver=${
      process.env.RECEIVER
    }&transaction_info=${process.env.TRANSACTION_INFO}&order_code=${
      newOrder.PIN
    }&price=${
      newOrder.totalPrice
    }&currency=vnd&quantity=1&tax=0&discount=0&fee_cal=0&fee_shipping=0&order_description=Tour:${tour.titleTour
      .trim()
      .replace(/\s/g, "")}People-${newOrder.numberPeople}Children-${
      newOrder.numberChildren
    }&buyer_info=${newOrder.buyer
      .trim()
      .replace(/\s/g, "")}*|*${newOrder.email
      .trim()
      .replace(/\s/g, "")}*|*${newOrder.phone
      .trim()
      .replace(/\s/g, "")}*|*${address
      .trim()
      .replace(
        /\s/g,
        ""
      )}&affiliate_code=&lang=vi&secure_code=${secureCode}&cancel_url=${
      process.env.CANCEL_URL
    }/${tour.idTour}`;

    // Trả về: tour, order(gồm mã PIN và tổng tiền, người mua tour), link(theo format đã cho trước),
    //  message đã sẵn sàng thanh toán!!!!
    const message = "Hóa đơn đã sẵn sàng để thanh toán!";
    const infoPayment = {
      order: { ...newOrder },
      tour: { ...tour },
      link: link,
      message: message
    };
    res.json(infoPayment);
  });
};

exports.resultPayment = function(req, res) {
  //Thanh toán thành công thì phải cho status thanh toán từ verify thành paid
  //updateByPIN
  updateOrder = { PIN: req.body.PIN, status: "paid" };

  Order.updateByPIN(updateOrder, function(err, updateOrder) {
    if (err) res.send(err);
    res.send(updateOrder);
  });
};

exports.cancelPayment = function(req, res) {
  //Cancel thì status: verify , đơn hàng ở trạng thái chờ thanh toán paying
  //updateByPIN
  updateOrder = { PIN: req.body.PIN, status: "paying" };
  Order.updateByPIN(updateOrder, function(err, updateOrder) {
    if (err) res.send(err);
    res.send(updateOrder);
  });
};

exports.notifyPayment = function(req, res) {
  // thông báo cho admin, gửi mail cho admin,.....
};
