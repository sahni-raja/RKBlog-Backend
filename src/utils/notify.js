// import { Notification } from "../models/notification.model.js";

// export const createNotification = async ({
//   user,
//   sender,
//   type,
//   post = null,
//   comment = null
// }) => {
//   // Do not notify yourself
//   if (user.toString() === sender.toString()) return;

//   await Notification.create({
//     user,
//     sender,
//     type,
//     post,
//     comment
//   });
// };

import { Notification } from "../models/notification.model.js";
import { emitNotification } from "../socket.js";

export const createNotification = async ({
  user,
  sender,
  type,
  post = null,
  comment = null
}) => {
  // don't notify yourself
  if (user.toString() === sender.toString()) return;

  const notification = await Notification.create({
    user,
    sender,
    type,
    post,
    comment
  });

  // 🔔 REAL-TIME EMIT
  emitNotification(user, notification);
};
