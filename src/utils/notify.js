import { Notification } from "../models/notification.model.js";
import { emitNotification } from "../socket.js";

export const createNotification = async ({
  user,
  sender,
  type,
  post = null,
  comment = null
}) => {
  
  if (user.toString() === sender.toString()) return;

  const notification = await Notification.create({
    user,
    sender,
    type,
    post,
    comment
  });

  emitNotification(user, notification);
};
