import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { SERVER_URL } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const Room = ({ username, room, socket }) => {
  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const boxDivRef = useRef(null);

  useEffect(() => {
    async function getOldMessage() {
      const response = await fetch(`${SERVER_URL}/chat/${room}`);
      if (response.status === 403) {
        return navigate("/");
      }

      const data = await response.json();

      setReceivedMessages((prev) => [...prev, ...data]);
    }
    getOldMessage();
  }, []);

  useEffect(() => {
    // sent user information
    socket.emit("joined_room", { username, room });

    //get message from server
    socket.on("message", (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    // get users from room
    socket.on("room_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });
    return () => socket.disconnect();
  }, [socket]);

  useEffect(
    (_) => {
      if (boxDivRef.current) {
        boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
      }
    },
    [receivedMessages]
  );
  function handelLeaveRoom() {
    console.log("YEs");
    navigate("/");
  }

  function handelSentMessage() {
    if (message.trim().length > 0) {
      socket.emit("message_send", message);
      setMessage("");
    }
  }

  return (
    <section className="flex gap-4 h-screen">
      {/* left side */}
      <div className="w-1/3 bg-blue-500 text-white font-medium relative">
        <p className="text-3xl font-bold text-center mt-5">Room.io</p>
        <div className="mt-10 ps-2">
          <p className="text-lg flex items-end gap-1">
            <ChatBubbleLeftRightIcon width={30} />
            Room Name
          </p>
          <p className="bg-white text-blue-500 ps-5 py-2 rounded-tl-full rounded-bl-full my-2">
            {room}
          </p>
        </div>
        <div className="mt-5 ps-2">
          <p className="flex items-end gap-1 text-lg mb-3">
            <UserGroupIcon width={30} />
            Users
          </p>
          {roomUsers.map((user, i) => (
            <p key={i} className="flex items-end gap-1 text-sm my-2">
              <UserIcon width={24} />
              {user.username === username ? "You" : user.username}
            </p>
          ))}
        </div>
        <button
          type="button"
          className="absolute bottom-0 p-2.5 flex items-enter gap-1 w-full mx-2 mb-2 text-lg"
          onClick={handelLeaveRoom}
        >
          <ArrowRightOnRectangleIcon width={30} />
          Leave Room
        </button>
      </div>
      {/* right side */}
      <div className="w-full pt-5 relative" >
        <div className="h-[30rem] overflow-y-auto" ref={boxDivRef}>
          {receivedMessages.map((msg, i) => (
            <div
              key={i}
              className="text-white bg-blue-500 px-3 py-2 mb-3 w-3/4 rounder-br-3xl rounded-tl-3xl"
            >
              <p className="text-sm font-medium font-mono">
                from {msg.username}
              </p>
              <p className="text-lg font-medium">{msg.message}</p>
              <p className="text-sm font-mono font-medium text-right">
                {formatDistanceToNow(new Date(msg.sent_at))}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 my-2 py-2.5 flex items-end w-full px-2">
          <input
            type="text"
            placeholder="message ..."
            className="w-full outline-none border-b text-lg me-2"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button type="button" onClick={handelSentMessage}>
            <PaperAirplaneIcon
              width={30}
              className="hover:text-blue-500 hover:-rotate-45 duration-200"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Room;
