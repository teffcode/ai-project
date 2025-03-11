import { useState } from "react";

interface NotificationProps {
  type: "info" | "success" | "error";
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const typeStyles = {
    info: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  return (
    <div className={`flex justify-between items-center p-4 border-l-4 rounded-md ${typeStyles[type]} mx-8 mt-8 md:mt-0 mb-8`}>
      <p>{message}</p>
      <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-700">
        ✖
      </button>
    </div>
  );
};

export default Notification;
