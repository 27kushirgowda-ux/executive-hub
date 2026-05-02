import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy
} from "firebase/firestore";

export default function Chat({ taskId, receiverId }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("taskId", "==", taskId),
      orderBy("createdAt")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setMessages(data);
    });
  }, [taskId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text) return;

    await addDoc(collection(db, "messages"), {
      taskId,
      senderId: auth.currentUser.uid,
      receiverId,
      text,
      createdAt: new Date()
    });

    setText("");
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl rounded-xl p-4 flex flex-col">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[70%]
              ${m.senderId === auth.currentUser.uid
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"}
            `}
          >
            {m.text}
          </div>
        ))}

        <div ref={bottomRef}></div>

      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}