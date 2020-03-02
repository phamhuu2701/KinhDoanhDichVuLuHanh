const database = require("../dbconnectMySql");

//Task object constructor
const Notification = function(notification) {
  this.idNotification = notification.idNotification | 0;
  this.title = notification.title;
  this.contentNotification = notification.contentNotification;
  this.status = notification.status;
  this.type = notification.type;
  this.dateTime = notification.dateTime
    ? notification.dateTime.slice(0, 10).replace(/-/g, "/")
    : undefined;
  // this.dateCreated = notification.dateCreated.slice(0, 10).replace(/-/g, "/");
  this.idAccount = notification.idAccount;
};

const databaseLocal = "azmszdk4w6h5j1o6";
const databaseProduction =
  process.env.NODE_ENV === "production"
    ? process.env.JAWSDB_DATABASE
    : databaseLocal;

Notification.getAllNotification = function() {
  return new Promise(function(resolve, reject) {
    database
      .query(
        "SELECT * FROM " +
          databaseProduction +
          ".notifications WHERE statusAction <> 'deleted';"
      )
      .then(rows => resolve(rows))
      .catch(err => reject(err));
  });
};

// Cần viết thêm Proceduce search cho bảng notifications
Notification.getAllNotificationSearch = function(searchs, funcResult) {
  if (searchs.conditional === "title") {
    database.query(
      "call " +
        databaseProduction +
        `.spsearchEngineNotificationByTitle( '${searchs.keySearch}', '${
          searchs.dayStart
        }', '${searchs.dayEnd}', ${10000000000} ); `,
      function(err, res) {
        if (err) {
          funcResult(err, null);
        } else {
          funcResult(null, res[0]);
        }
      }
    );
  } else if (
    searchs.conditional === "landmark" ||
    searchs.conditional === "address"
  ) {
    database.query(
      "call " +
        databaseProduction +
        `.spsearchEngineTourByAddress( '${searchs.keySearch}', '${
          searchs.dayStart
        }', '${searchs.dayEnd}', ${10000000000} ); `,
      function(err, res) {
        if (err) {
          funcResult(err, null);
        } else {
          funcResult(null, res[0]);
        }
      }
    );
  } else {
    database.query(
      "call " +
        databaseProduction +
        `.spsearchEngineTour( '${searchs.keySearch}', '${searchs.dayStart}', '${
          searchs.dayEnd
        }', ${10000000000} ); `,
      function(err, res) {
        if (err) {
          funcResult(err, null);
        } else {
          funcResult(null, res[0]);
        }
      }
    );
  }
};

Notification.createNotification = function(newNotification) {
  return new Promise(function(resolve, reject) {
    database
      .query(
        "INSERT INTO " +
          databaseProduction +
          ".notifications (`title`, `contentNotification`, `status`, `type`, `dateTime`, `idAccount`) VALUES ('" +
          newNotification.title +
          "', '" +
          newNotification.contentNotification +
          "', '" +
          newNotification.status +
          "', '" +
          newNotification.type +
          "', '" +
          newNotification.dateTime +
          "', '" +
          newNotification.idAccount +
          "') "
      )
      .then(rows => resolve(rows))
      .catch(err => reject(err));
  });
};

Notification.getNotificationById = function(idNotification) {
  return new Promise(function(resolve, reject) {
    database
      .query(
        "SELECT * FROM " +
          databaseProduction +
          ".notifications  WHERE idNotification = ? AND statusAction <> 'deleted';",
        [idNotification]
      )
      .then(rows => resolve(rows))
      .catch(err => reject(err));
  });
};

Notification.updateById = function(updateNotification) {
  updateNotification = { ...updateNotification, statusAction: "edited" };
  return new Promise(function(resolve, reject) {
    database
      .query(
        "UPDATE " +
          databaseProduction +
          ".notifications SET ? WHERE (idNotification = ?);",
        [updateNotification, updateNotification.idNotification]
      )
      .then(rows => resolve(rows))
      .catch(err => reject(err));
  });
};

Notification.remove = function(idNotification) {
  return new Promise(function(resolve, reject) {
    database
      .query(
        "UPDATE " +
          databaseProduction +
          ".notifications SET `statusAction` = 'deleted' WHERE idNotification = ?",
        [idNotification]
      )
      .then(rows => resolve(rows))
      .catch(err => reject(err));
  });
};

module.exports = Notification;
