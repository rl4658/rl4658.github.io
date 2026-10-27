import { useState, useRef, useEffect, useMemo } from "react";
import {
  Terminal,
  Cpu,
  Layers,
  Lock,
  Unlock,
  Users,
  MessageSquare,
  Send,
  Power,
  AlertTriangle,
  Radio,
  Minus,
  Square,
  X,
  Sliders,
  Check,
  Copy,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Monitor,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  Shield,
  Activity,
  Code,
  Network,
} from "lucide-react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/chatroom-whisperers";
const sections = [
  ["overview", "01 / Narrative & system overview"],
  ["threading", "02 / POSIX multi-threading & worker threads"],
  ["synchronization", "03 / Thread safety & mutex locking"],
  ["protocol", "04 / Semicolon-delimited network protocol"],
  ["pyqt5-architecture", "05 / PyQt5 desktop GUI architecture"],
  ["interactive-studio", "06 / Interactive PyQt5 & C++ server studio"],
  ["posix-primitives", "07 / POSIX synchronization primitives"],
  ["source-review", "08 / Source code review & metrics"],
  ["compilation", "09 / Build & local execution"],
] as const;

/* ------------------------------------------------------------------------- */
/* Types for the Interactive Simulator                                       */
/* ------------------------------------------------------------------------- */
interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

interface RoomData {
  name: string;
  password: string | null;
  isLocked: boolean;
  currentUsers: number;
  maxUsers: number;
  participants: string[];
  messages: ChatMessage[];
}

interface ServerLog {
  id: string;
  timestamp: string;
  thread: string;
  type: "info" | "mutex" | "recv" | "send" | "bcast" | "err" | "shutdown";
  text: string;
}

const INITIAL_ROOMS: RoomData[] = [
  {
    name: "cyber-den",
    password: "matrix",
    isLocked: true,
    currentUsers: 1,
    maxUsers: 4,
    participants: ["cypher"],
    messages: [
      { sender: "SYSTEM", text: "Room cyber-den created with password protection", time: "10:14:02", isSystem: true },
      { sender: "cypher", text: "POSIX worker thread pool spawned on FD 6.", time: "10:15:30" },
    ],
  },
  {
    name: "dev-lounge",
    password: null,
    isLocked: false,
    currentUsers: 1,
    maxUsers: 5,
    participants: ["linus"],
    messages: [
      { sender: "SYSTEM", text: "Public developer lounge online", time: "10:12:00", isSystem: true },
      { sender: "linus", text: "POSIX select vs epoll benchmarks looking clean on port 3000.", time: "10:18:22" },
    ],
  },
  {
    name: "general",
    password: null,
    isLocked: false,
    currentUsers: 2,
    maxUsers: 5,
    participants: ["dijkstra", "turing"],
    messages: [
      { sender: "SYSTEM", text: "General chatter room initialized", time: "10:00:00", isSystem: true },
      { sender: "dijkstra", text: "Mutual exclusion guarantees zero race conditions.", time: "10:20:05" },
      { sender: "turing", text: "Protocol ASCII packets serialized cleanly.", time: "10:21:40" },
    ],
  },
  {
    name: "algo-lab",
    password: "algo",
    isLocked: true,
    currentUsers: 4,
    maxUsers: 4,
    participants: ["knuth", "hopper", "lovelace", "neumann"],
    messages: [
      { sender: "SYSTEM", text: "Algorithm laboratory room initialized", time: "09:55:00", isSystem: true },
      { sender: "knuth", text: "Room capacity full test initialized [4/4].", time: "10:01:00" },
    ],
  },
];

const INITIAL_LOGS: ServerLog[] = [
  {
    id: "l1",
    timestamp: "10:12:00.012",
    thread: "ServerThread",
    type: "info",
    text: "SocketServer initialized on 127.0.0.1:3000",
  },
  {
    id: "l2",
    timestamp: "10:12:00.015",
    thread: "ServerThread",
    type: "info",
    text: "bind(AF_INET, SOCK_STREAM, port 3000) SUCCESS",
  },
  {
    id: "l3",
    timestamp: "10:12:00.018",
    thread: "ServerThread",
    type: "info",
    text: "listen(backlog=10) SUCCESS | Concurrency: POSIX Threads",
  },
  {
    id: "l4",
    timestamp: "10:14:02.110",
    thread: "ServerThread",
    type: "info",
    text: "Accepted new client TCP socket (FD 4) from 127.0.0.1:54210",
  },
  {
    id: "l5",
    timestamp: "10:14:02.112",
    thread: "MUTEX",
    type: "mutex",
    text: "std::lock_guard<std::mutex> lock(connectedClientsMutex)",
  },
  {
    id: "l6",
    timestamp: "10:14:02.114",
    thread: "ServerThread",
    type: "info",
    text: "Spawned SocketThread worker for client socket FD 4 (alex)",
  },
  {
    id: "l7",
    timestamp: "10:14:05.312",
    thread: "ServerThread",
    type: "info",
    text: "Accepted new client TCP socket (FD 5) from 127.0.0.1:54212",
  },
  {
    id: "l8",
    timestamp: "10:14:05.314",
    thread: "MUTEX",
    type: "mutex",
    text: "std::lock_guard<std::mutex> lock(connectedClientsMutex)",
  },
  {
    id: "l9",
    timestamp: "10:14:05.316",
    thread: "ServerThread",
    type: "info",
    text: "Spawned SocketThread worker for client socket FD 5 (maya)",
  },
  {
    id: "l10",
    timestamp: "10:14:05.402",
    thread: "SocketThread:FD 4",
    type: "recv",
    text: ">> RECV: UPDATE_DATA_REQUEST;alex",
  },
  {
    id: "l11",
    timestamp: "10:14:05.404",
    thread: "MUTEX",
    type: "mutex",
    text: "std::lock_guard<std::mutex> lock(roomDataMutex)",
  },
  {
    id: "l12",
    timestamp: "10:14:05.406",
    thread: "SocketThread:FD 4",
    type: "send",
    text: "<< SEND: UPDATE_DATA;cyber-den:1/4:Locked;dev-lounge:1/5:Unlocked;general:2/5:Unlocked;algo-lab:4/4:Locked",
  },
];

/* ------------------------------------------------------------------------- */
/* Reusable PyQt5 Desktop Window Frame Component                             */
/* ------------------------------------------------------------------------- */
interface PyQt5ClientWindowProps {
  clientId: "client1" | "client2";
  clientLabel: string;
  defaultUsername: string;
  fd: number;
  port: string;
  accent: "cyan" | "purple";
  state: "lobby" | "chat";
  username: string;
  setUsername: (name: string) => void;
  activeRoom: RoomData | null;
  rooms: RoomData[];
  createName: string;
  setCreateName: (name: string) => void;
  createPassword: string;
  setCreatePassword: (pwd: string) => void;
  createMaxUsers: number;
  setCreateMaxUsers: (num: number) => void;
  selectedRoomName: string;
  setSelectedRoomName: (name: string) => void;
  joinPassword: string;
  setJoinPassword: (pwd: string) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  warningModal: { title: string; message: string } | null;
  setWarningModal: (modal: { title: string; message: string } | null) => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onSendMessage: () => void;
  onDisconnectRoom: () => void;
  isServerRunning: boolean;
}

function PyQt5ClientWindow({
  clientId,
  clientLabel,
  defaultUsername,
  fd,
  port,
  accent,
  state,
  username,
  setUsername,
  activeRoom,
  rooms,
  createName,
  setCreateName,
  createPassword,
  setCreatePassword,
  createMaxUsers,
  setCreateMaxUsers,
  selectedRoomName,
  setSelectedRoomName,
  joinPassword,
  setJoinPassword,
  chatInput,
  setChatInput,
  warningModal,
  setWarningModal,
  chatContainerRef,
  onCreateRoom,
  onJoinRoom,
  onSendMessage,
  onDisconnectRoom,
  isServerRunning,
}: PyQt5ClientWindowProps) {
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.name === selectedRoomName) || null;
  }, [rooms, selectedRoomName]);

  const isCyan = accent === "cyan";
  const userTagColor = isCyan ? "text-cyan-400" : "text-purple-400";
  const badgeBorderColor = isCyan ? "border-cyan-500/40" : "border-purple-500/40";
  const badgeBgColor = isCyan ? "bg-cyan-950/40" : "bg-purple-950/40";

  return (
    <div className={`w-full rounded-2xl border-2 border-white/20 bg-[#121212] overflow-hidden shadow-2xl relative font-sans flex flex-col min-h-[560px]`}>
      {/* Client Identity Header Badge */}
      <div className={`flex items-center justify-between px-3.5 py-1.5 ${badgeBgColor} border-b ${badgeBorderColor} text-[11px] font-mono`}>
        <div className="flex items-center gap-1.5 font-semibold">
          <span className={`w-2 h-2 rounded-full ${isCyan ? "bg-cyan-400" : "bg-purple-400"}`} />
          <span className={userTagColor}>{clientLabel}</span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-300">User: <strong className="text-white">{username || defaultUsername}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>127.0.0.1:{port}</span>
          <span className="text-white/20">|</span>
          <span className="text-neutral-400 font-bold">FD: {fd}</span>
        </div>
      </div>

      {/* Desktop Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#181818] border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/projects/chatroom/logo.png"
            alt="Chatroom Whisperers"
            className="w-4 h-4 rounded-sm object-contain bg-white/5 p-0.5"
          />
          <span className="text-xs font-semibold text-neutral-200 font-mono truncate max-w-[200px] sm:max-w-xs">
            {state === "chat" && activeRoom
              ? `${activeRoom.name} - Chatroom Whisperers [${username || defaultUsername}]`
              : `Chatroom Whisperers - [${username || defaultUsername}]`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
          <div className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
            <Minus size={12} />
          </div>
          <div className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
            <Square size={10} />
          </div>
          <button
            type="button"
            title="Close / Disconnect"
            onClick={() => {
              if (state === "chat") {
                onDisconnectRoom();
              } else {
                setCreateName("");
                setCreatePassword("");
                setJoinPassword("");
              }
            }}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Window Body: Either Lobby (State 1) or Active Room (State 2) */}
      {state === "lobby" ? (
        /* State 1: Lobby (ChatRoomGUI in client.py) - EXACT Single Vertical Stack! */
        <div className="p-5 sm:p-6 space-y-3.5 text-xs select-none bg-[#121212] flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* 1. QLabel("Username:") + QLineEdit */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1 font-mono">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-black/60 border border-white/20 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/50 font-mono shadow-inner"
              />
            </div>

            {/* 2. QLabel("Create Chatroom") [Underlined Title] */}
            <div className="pt-1">
              <span className="text-sm font-bold text-white underline tracking-wide">
                Create Chatroom
              </span>
            </div>

            {/* 3. QLabel("Chatroom Name:") + QLineEdit */}
            <div>
              <label className="text-xs text-neutral-300 block mb-1">
                Chatroom Name:
              </label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. distributed-systems"
                className="w-full bg-black/60 border border-white/20 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/50 font-mono shadow-inner"
              />
            </div>

            {/* 4. QLabel("Chatroom Password (Optional):") + QLineEdit(Password) */}
            <div>
              <label className="text-xs text-neutral-300 block mb-1">
                Chatroom Password (Optional):
              </label>
              <input
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="Leave blank for public room"
                className="w-full bg-black/60 border border-white/20 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/50 font-mono shadow-inner"
              />
            </div>

            {/* 5. QLabel("Lobby Size (2-5):") + QSlider(min=2, max=5) */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
                <span>Lobby Size (2-5):</span>
                <span className={`${userTagColor} font-mono font-bold`}>{createMaxUsers} Users</span>
              </div>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={createMaxUsers}
                onChange={(e) => setCreateMaxUsers(Number(e.target.value))}
                className="w-full accent-white cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-0.5 px-1">
                <span className={createMaxUsers === 2 ? "text-white font-bold" : ""}>2 min</span>
                <span className={createMaxUsers === 3 ? "text-white font-bold" : ""}>3</span>
                <span className={createMaxUsers === 4 ? "text-white font-bold" : ""}>4</span>
                <span className={createMaxUsers === 5 ? "text-white font-bold" : ""}>5 max</span>
              </div>
            </div>

            {/* 6. QPushButton("Create Chatroom") */}
            <button
              type="button"
              onClick={onCreateRoom}
              className="w-full py-2 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare size={13} />
              <span>Create Chatroom</span>
            </button>

            {/* 7. Spacing(20) & QLabel("Join Chat Room") [Underlined Title] */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-sm font-bold text-white underline tracking-wide">
                Join Chat Room
              </span>
            </div>

            {/* 8. QLabel("Available Chatrooms:") + QComboBox */}
            <div>
              <label className="text-xs text-neutral-300 block mb-1">
                Available Chatrooms:
              </label>
              <select
                value={selectedRoomName}
                onChange={(e) => setSelectedRoomName(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/50 font-mono shadow-inner cursor-pointer"
              >
                {rooms.map((r) => (
                  <option key={r.name} value={r.name} className="bg-neutral-900 text-white py-1">
                    {r.name} - [{r.isLocked ? "Locked" : "Unlocked"}], {r.currentUsers}/{r.maxUsers} users
                  </option>
                ))}
              </select>
            </div>

            {/* 9. QLabel("Password:") & QLineEdit (Dynamically revealed when locked room selected) */}
            {selectedRoom?.isLocked ? (
              <div className="space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Lock size={12} />
                    <span>Password:</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Room is locked (Hint: &apos;{selectedRoom.password}&apos;)
                  </span>
                </div>
                <input
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onJoinRoom()}
                  placeholder="Enter room password to unlock..."
                  className="w-full bg-black/60 border border-amber-500/40 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono shadow-inner"
                />
              </div>
            ) : (
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                <Unlock size={13} className="text-emerald-400 shrink-0" />
                <span>This chatroom is public. No password required.</span>
              </div>
            )}
          </div>

          {/* 10. QPushButton("Connect") */}
          <button
            type="button"
            onClick={onJoinRoom}
            className="w-full py-2.5 rounded-md bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 shadow mt-2"
          >
            <Radio size={14} />
            <span>Connect</span>
          </button>
        </div>
      ) : (
        /* State 2: Active Room (ChatWindow in client.py) */
        <div className="p-4 sm:p-5 space-y-3 flex flex-col flex-1">
          {/* Header Strip */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-mono">{activeRoom?.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-neutral-300">
                {activeRoom?.isLocked ? "🔒 Locked" : "🔓 Public"}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-neutral-300 flex items-center gap-1">
                <Users size={11} />
                <span>{activeRoom?.currentUsers}/{activeRoom?.maxUsers} Users</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onDisconnectRoom}
              className="px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Power size={13} />
              <span>Disconnect</span>
            </button>
          </div>

          {/* QTextEdit(readOnly=True) - Messages Display */}
          <div
            ref={chatContainerRef}
            className="flex-1 min-h-[300px] max-h-[360px] bg-black/75 rounded-lg border border-white/10 p-4 overflow-y-auto space-y-2.5 text-xs font-mono"
          >
            {activeRoom?.messages.map((m, i) => (
              <div key={i} className="leading-relaxed">
                {m.isSystem ? (
                  <div className="text-neutral-500 italic text-[11px] py-0.5">
                    *** {m.text} ({m.time}) ***
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-500 text-[10px] shrink-0 mt-0.5">{m.time}</span>
                    <span
                      className={
                        m.sender === username
                          ? `${userTagColor} font-bold shrink-0`
                          : "text-neutral-300 font-bold shrink-0"
                      }
                    >
                      {m.sender}:
                    </span>
                    <span className={m.sender === username ? "text-white" : "text-neutral-200"}>
                      {m.text}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* QLineEdit() + Send Button */}
          <div className="flex items-center gap-2 pt-1 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
              placeholder={`Type message as ${username || defaultUsername}...`}
              className="flex-1 bg-black/70 border border-white/20 rounded-md px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/50 font-mono"
            />
            <button
              type="button"
              onClick={onSendMessage}
              className="px-5 py-2 rounded-md bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shrink-0 shadow font-mono"
            >
              <Send size={13} />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* Simulated QMessageBox Warning Modal */}
      {warningModal && (
        <div
          onClick={() => setWarningModal(null)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#1e1e1e] border border-amber-500/40 rounded-xl shadow-2xl p-5 text-left space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <AlertTriangle size={16} />
                <span>{warningModal.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setWarningModal(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs text-neutral-200 leading-relaxed font-sans">
              {warningModal.message}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setWarningModal(null)}
                className="px-4 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors shadow"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Simulated C++ Socket Server Bus Terminal Component                        */
/* ------------------------------------------------------------------------- */
interface ServerBusTerminalProps {
  serverLogs: ServerLog[];
  logFilter: "all" | "packets" | "mutex" | "broadcast";
  setLogFilter: (filter: "all" | "packets" | "mutex" | "broadcast") => void;
  isServerRunning: boolean;
  onShutdown: () => void;
  onRestart: () => void;
  customPacketInput: string;
  setCustomPacketInput: (val: string) => void;
  onDispatchPacket: () => void;
  logsContainerRef: React.RefObject<HTMLDivElement>;
  isDrawer?: boolean;
}

function ServerBusTerminal({
  serverLogs,
  logFilter,
  setLogFilter,
  isServerRunning,
  onShutdown,
  onRestart,
  customPacketInput,
  setCustomPacketInput,
  onDispatchPacket,
  logsContainerRef,
  isDrawer = false,
}: ServerBusTerminalProps) {
  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return serverLogs;
    if (logFilter === "packets") return serverLogs.filter((l) => l.type === "recv" || l.type === "send");
    if (logFilter === "mutex") return serverLogs.filter((l) => l.type === "mutex");
    if (logFilter === "broadcast") return serverLogs.filter((l) => l.type === "bcast" || l.type === "shutdown");
    return serverLogs;
  }, [serverLogs, logFilter]);

  return (
    <div
      className={`w-full ${
        isDrawer ? "max-w-6xl" : "max-w-4xl"
      } mx-auto rounded-2xl border-2 border-white/20 bg-black/95 overflow-hidden shadow-2xl flex flex-col ${
        isDrawer ? "h-[440px]" : "h-[560px]"
      }`}
    >
      {/* Terminal Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-white/10 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyan-400" />
          <span className="text-xs font-bold text-neutral-200 font-mono">
            POSIX TCP Server Bus · 127.0.0.1:3000
          </span>
          <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            FD 4 (Alex) &amp; FD 5 (Maya)
          </span>
        </div>

        {/* Log Filters */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setLogFilter("all")}
            className={`px-2 py-0.5 rounded transition-colors ${
              logFilter === "all" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            All ({serverLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setLogFilter("packets")}
            className={`px-2 py-0.5 rounded transition-colors ${
              logFilter === "packets" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Packets
          </button>
          <button
            type="button"
            onClick={() => setLogFilter("mutex")}
            className={`px-2 py-0.5 rounded transition-colors ${
              logFilter === "mutex" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Mutex
          </button>
          <button
            type="button"
            onClick={() => setLogFilter("broadcast")}
            className={`px-2 py-0.5 rounded transition-colors ${
              logFilter === "broadcast" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Broadcasts
          </button>
        </div>

        {/* Server Power Button */}
        <div className="flex items-center gap-2">
          {isServerRunning ? (
            <button
              type="button"
              onClick={onShutdown}
              className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-mono font-medium transition-colors flex items-center gap-1.5"
            >
              <Power size={11} />
              <span>SIGINT (Stop)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRestart}
              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              <Play size={11} className="fill-emerald-300" />
              <span>Reboot Server</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div
        ref={logsContainerRef}
        className="flex-1 min-h-0 p-4 font-mono text-xs overflow-y-auto space-y-1.5 bg-black/90 select-text"
      >
        {filteredLogs.map((log) => {
          let badgeColor = "bg-neutral-800 text-neutral-300";
          if (log.type === "recv") badgeColor = "bg-cyan-950 text-cyan-300 border border-cyan-800/50";
          if (log.type === "send") badgeColor = "bg-emerald-950 text-emerald-300 border border-emerald-800/50";
          if (log.type === "mutex") badgeColor = "bg-amber-950 text-amber-300 border border-amber-800/50";
          if (log.type === "bcast") badgeColor = "bg-purple-950 text-purple-300 border border-purple-800/50";
          if (log.type === "err" || log.type === "shutdown") badgeColor = "bg-red-950 text-red-300 border border-red-800/50";

          return (
            <div key={log.id} className="flex items-start gap-2.5 leading-relaxed hover:bg-white/5 px-2 py-0.5 rounded transition-colors">
              <span className="text-neutral-600 text-[10px] shrink-0 mt-0.5">{log.timestamp}</span>
              <span className="text-neutral-400 font-semibold shrink-0 text-[11px]">[{log.thread}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold shrink-0 ${badgeColor}`}>
                {log.type}
              </span>
              <span className="text-neutral-200 break-all">{log.text}</span>
            </div>
          );
        })}
      </div>

      {/* Custom Semicolon Packet Injector */}
      <div className="p-3 bg-neutral-900 border-t border-white/10 flex items-center gap-2 shrink-0">
        <span className="text-xs font-mono text-neutral-400 whitespace-nowrap hidden sm:inline">
          Packet Injector:
        </span>
        <input
          type="text"
          value={customPacketInput}
          onChange={(e) => setCustomPacketInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onDispatchPacket()}
          placeholder="e.g. MESSAGE_ROOM;cyber-den;POSIX mutex stream verified;alex"
          className="flex-1 bg-black/80 border border-white/20 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/50 font-mono"
        />
        <button
          type="button"
          onClick={onDispatchPacket}
          className="px-4 py-1.5 rounded-md bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow shrink-0 font-mono"
        >
          Dispatch
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Interactive PyQt5 Dual-Client & C++ Socket Server Bus Simulator           */
/* ------------------------------------------------------------------------- */
function InteractiveChatroomStudio() {
  const [viewMode, setViewMode] = useState<"dual" | "client1" | "client2" | "server">("dual");
  const [showServerDrawer, setShowServerDrawer] = useState<boolean>(false);
  const [rooms, setRooms] = useState<RoomData[]>(INITIAL_ROOMS);
  const [serverLogs, setServerLogs] = useState<ServerLog[]>(INITIAL_LOGS);
  const [logFilter, setLogFilter] = useState<"all" | "packets" | "mutex" | "broadcast">("all");
  const [isServerRunning, setIsServerRunning] = useState<boolean>(true);
  const [customPacketInput, setCustomPacketInput] = useState<string>("");

  // Client 1 (Alex - FD 4) State
  const [c1Username, setC1Username] = useState<string>("alex");
  const [c1State, setC1State] = useState<"lobby" | "chat">("lobby");
  const [c1ActiveRoomName, setC1ActiveRoomName] = useState<string | null>(null);
  const [c1CreateName, setC1CreateName] = useState<string>("");
  const [c1CreatePassword, setC1CreatePassword] = useState<string>("");
  const [c1CreateMaxUsers, setC1CreateMaxUsers] = useState<number>(2);
  const [c1SelectedRoomName, setC1SelectedRoomName] = useState<string>("cyber-den");
  const [c1JoinPassword, setC1JoinPassword] = useState<string>("");
  const [c1ChatInput, setC1ChatInput] = useState<string>("");
  const [c1WarningModal, setC1WarningModal] = useState<{ title: string; message: string } | null>(null);

  // Client 2 (Maya - FD 5) State
  const [c2Username, setC2Username] = useState<string>("maya");
  const [c2State, setC2State] = useState<"lobby" | "chat">("lobby");
  const [c2ActiveRoomName, setC2ActiveRoomName] = useState<string | null>(null);
  const [c2CreateName, setC2CreateName] = useState<string>("");
  const [c2CreatePassword, setC2CreatePassword] = useState<string>("");
  const [c2CreateMaxUsers, setC2CreateMaxUsers] = useState<number>(2);
  const [c2SelectedRoomName, setC2SelectedRoomName] = useState<string>("cyber-den");
  const [c2JoinPassword, setC2JoinPassword] = useState<string>("");
  const [c2ChatInput, setC2ChatInput] = useState<string>("");
  const [c2WarningModal, setC2WarningModal] = useState<{ title: string; message: string } | null>(null);

  // Container References for Safe Scrolling
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const c1ChatContainerRef = useRef<HTMLDivElement>(null);
  const c2ChatContainerRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    const d = new Date();
    const pad = (n: number, z = 2) => n.toString().padStart(z, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
  };

  const addLog = (thread: string, type: ServerLog["type"], text: string) => {
    setServerLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: getTimestamp(),
        thread,
        type,
        text,
      },
    ]);
  };

  // Safe container-only scrolling for server logs (NEVER scrolls browser window)
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [serverLogs, viewMode, showServerDrawer]);

  // Safe container-only scrolling for Client 1 chat messages
  useEffect(() => {
    if (c1ChatContainerRef.current) {
      c1ChatContainerRef.current.scrollTop = c1ChatContainerRef.current.scrollHeight;
    }
  }, [rooms, c1State]);

  // Safe container-only scrolling for Client 2 chat messages
  useEffect(() => {
    if (c2ChatContainerRef.current) {
      c2ChatContainerRef.current.scrollTop = c2ChatContainerRef.current.scrollHeight;
    }
  }, [rooms, c2State]);

  const c1ActiveRoom = useMemo(() => {
    return rooms.find((r) => r.name === c1ActiveRoomName) || null;
  }, [rooms, c1ActiveRoomName]);

  const c2ActiveRoom = useMemo(() => {
    return rooms.find((r) => r.name === c2ActiveRoomName) || null;
  }, [rooms, c2ActiveRoomName]);

  /* ----------------------------------------------------------------------- */
  /* Client Actions                                                          */
  /* ----------------------------------------------------------------------- */

  const handleCreateRoom = (clientId: "client1" | "client2") => {
    const isC1 = clientId === "client1";
    const user = (isC1 ? c1Username : c2Username).trim() || (isC1 ? "alex" : "maya");
    const name = (isC1 ? c1CreateName : c2CreateName).trim();
    const pwd = (isC1 ? c1CreatePassword : c2CreatePassword).trim();
    const maxUsers = isC1 ? c1CreateMaxUsers : c2CreateMaxUsers;
    const fd = isC1 ? 4 : 5;
    const setWarning = isC1 ? setC1WarningModal : setC2WarningModal;

    if (!isServerRunning) {
      setWarning({
        title: "QMessageBox - Server Offline",
        message: "Cannot connect: The C++ TCP server on port 3000 is stopped. Restart it in the Server Bus tab.",
      });
      return;
    }

    if (!name) {
      setWarning({
        title: "QMessageBox - Warning",
        message: "Room Name Required: Please enter a valid name for the new chatroom.",
      });
      return;
    }

    if (rooms.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      setWarning({
        title: "QMessageBox - Warning",
        message: `Existing Room: A chatroom named '${name}' already exists.`,
      });
      return;
    }

    const isLocked = pwd.length > 0;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Semicolon ASCII packet to server
    addLog(`SocketThread:FD ${fd}`, "recv", `>> RECV: CREATE_ROOM;${name};${pwd || "NO_PASSWORD"};1;${maxUsers};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomsMutex)");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog(`SocketThread:FD ${fd}`, "send", "<< SEND: CREATE_SUCCESS");
    addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${name};1;${maxUsers};${isLocked ? "Locked" : "Unlocked"}`);

    const newRoom: RoomData = {
      name,
      password: pwd || null,
      isLocked,
      currentUsers: 1,
      maxUsers,
      participants: [user],
      messages: [
        {
          sender: "SYSTEM",
          text: `Room '${name}' created by ${user} (Capacity: 1/${maxUsers})`,
          time,
          isSystem: true,
        },
      ],
    };

    setRooms((prev) => [...prev, newRoom]);

    if (isC1) {
      setC1ActiveRoomName(name);
      setC1State("chat");
      setC1CreateName("");
      setC1CreatePassword("");
      setC1CreateMaxUsers(2);
      setC2SelectedRoomName(name);
    } else {
      setC2ActiveRoomName(name);
      setC2State("chat");
      setC2CreateName("");
      setC2CreatePassword("");
      setC2CreateMaxUsers(2);
      setC1SelectedRoomName(name);
    }
  };

  const handleJoinRoom = (clientId: "client1" | "client2") => {
    const isC1 = clientId === "client1";
    const user = (isC1 ? c1Username : c2Username).trim() || (isC1 ? "alex" : "maya");
    const selectedName = isC1 ? c1SelectedRoomName : c2SelectedRoomName;
    const pwd = (isC1 ? c1JoinPassword : c2JoinPassword).trim();
    const fd = isC1 ? 4 : 5;
    const setWarning = isC1 ? setC1WarningModal : setC2WarningModal;

    if (!isServerRunning) {
      setWarning({
        title: "QMessageBox - Server Offline",
        message: "Cannot connect: The C++ TCP server on port 3000 is stopped. Restart it in the Server Bus tab.",
      });
      return;
    }

    const target = rooms.find((r) => r.name === selectedName);
    if (!target) {
      setWarning({
        title: "QMessageBox - Warning",
        message: "No Room: Please select an existing chatroom from the list.",
      });
      return;
    }

    // Capacity check
    if (target.currentUsers >= target.maxUsers) {
      addLog(`SocketThread:FD ${fd}`, "recv", `>> RECV: JOIN_ROOM;${target.name};${target.isLocked ? "***" : "NO_PASSWORD"};${user}`);
      addLog(`SocketThread:FD ${fd}`, "err", "<< SEND: ROOM_FULL");
      setWarning({
        title: "QMessageBox - Warning",
        message: `Room Full: The chatroom '${target.name}' is currently at capacity (${target.maxUsers}/${target.maxUsers} users).`,
      });
      return;
    }

    // Password check
    if (target.isLocked && pwd !== target.password) {
      addLog(`SocketThread:FD ${fd}`, "recv", `>> RECV: JOIN_ROOM;${target.name};***;${user}`);
      addLog(`SocketThread:FD ${fd}`, "err", "<< SEND: INVALID_PASSWORD");
      setWarning({
        title: "QMessageBox - Warning",
        message: `Invalid Password: Password entered for '${target.name}' is incorrect.`,
      });
      return;
    }

    // Join Success
    const newCount = target.currentUsers + 1;
    addLog(`SocketThread:FD ${fd}`, "recv", `>> RECV: JOIN_ROOM;${target.name};${target.isLocked ? "***" : "NO_PASSWORD"};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(connectedClientsMutex)");
    addLog(`SocketThread:FD ${fd}`, "send", "<< SEND: JOIN_SUCCESS");
    addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${target.name};${newCount};${target.maxUsers};${target.isLocked ? "Locked" : "Unlocked"}`);
    addLog(`ChatRoom:${target.name}`, "bcast", `<< BCAST: USER_JOINED;${user};${newCount}/${target.maxUsers}`);

    const joinTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setRooms((prev) =>
      prev.map((r) =>
        r.name === target.name
          ? {
              ...r,
              currentUsers: newCount,
              participants: [...r.participants, user],
              messages: [
                ...r.messages,
                {
                  sender: "SYSTEM",
                  text: `${user} joined the room. (${newCount}/${r.maxUsers} users)`,
                  time: joinTime,
                  isSystem: true,
                },
              ],
            }
          : r
      )
    );

    if (isC1) {
      setC1ActiveRoomName(target.name);
      setC1State("chat");
      setC1JoinPassword("");
    } else {
      setC2ActiveRoomName(target.name);
      setC2State("chat");
      setC2JoinPassword("");
    }
  };

  const handleSendMessage = (clientId: "client1" | "client2") => {
    const isC1 = clientId === "client1";
    const user = (isC1 ? c1Username : c2Username).trim() || (isC1 ? "alex" : "maya");
    const msg = (isC1 ? c1ChatInput : c2ChatInput).trim();
    const roomName = isC1 ? c1ActiveRoomName : c2ActiveRoomName;
    const fd = isC1 ? 4 : 5;

    if (!msg || !roomName) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    addLog(`SocketThread:FD ${fd}`, "recv", `>> RECV: MESSAGE_ROOM;${roomName};${msg};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog(`ChatRoom:${roomName}`, "bcast", `broadcastMessage >> MESSAGE;${user};${msg}`);

    setRooms((prev) =>
      prev.map((r) =>
        r.name === roomName
          ? {
              ...r,
              messages: [...r.messages, { sender: user, text: msg, time }],
            }
          : r
      )
    );

    if (isC1) {
      setC1ChatInput("");
    } else {
      setC2ChatInput("");
    }
  };

  const handleDisconnectRoom = (clientId: "client1" | "client2") => {
    const isC1 = clientId === "client1";
    const user = (isC1 ? c1Username : c2Username).trim() || (isC1 ? "alex" : "maya");
    const roomName = isC1 ? c1ActiveRoomName : c2ActiveRoomName;
    const fd = isC1 ? 4 : 5;

    if (!roomName) return;

    addLog(`SocketThread:FD ${fd}`, "recv", `>> RECV: DISCONNECT_ROOM;${roomName};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(connectedClientsMutex)");

    const target = rooms.find((r) => r.name === roomName);
    const newCount = target ? Math.max(0, target.currentUsers - 1) : 0;
    addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${roomName};${newCount};${target?.maxUsers || 5};${target?.isLocked ? "Locked" : "Unlocked"}`);

    const leaveTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setRooms((prev) =>
      prev.map((r) =>
        r.name === roomName
          ? {
              ...r,
              currentUsers: newCount,
              participants: r.participants.filter((p) => p !== user),
              messages: [
                ...r.messages,
                {
                  sender: "SYSTEM",
                  text: `${user} left the room. (${newCount}/${r.maxUsers} users)`,
                  time: leaveTime,
                  isSystem: true,
                },
              ],
            }
          : r
      )
    );

    if (isC1) {
      setC1ActiveRoomName(null);
      setC1State("lobby");
    } else {
      setC2ActiveRoomName(null);
      setC2State("lobby");
    }
  };

  const handleServerShutdown = () => {
    addLog("SignalHandler", "shutdown", "SIGINT caught >> Initiating SERVER_SHUTDOWN sequence");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(connectedClientsMutex)");
    addLog("Broadcast", "shutdown", "<< BCAST: SERVER_SHUTDOWN;All connections terminating");
    addLog("ServerThread", "info", "Terminating worker threads for FD 4, FD 5, FD 6");
    addLog("ServerThread", "info", "close(listening_socket_fd=3) SUCCESS on port 3000");
    addLog("ServerThread", "info", "All socket descriptors released cleanly. Exit code 0.");
    setIsServerRunning(false);

    if (c1State === "chat") {
      setC1ActiveRoomName(null);
      setC1State("lobby");
      setC1WarningModal({
        title: "QMessageBox - Server Shutdown",
        message: "Connection Closed: The C++ server sent a SERVER_SHUTDOWN broadcast and closed all sockets.",
      });
    }
    if (c2State === "chat") {
      setC2ActiveRoomName(null);
      setC2State("lobby");
      setC2WarningModal({
        title: "QMessageBox - Server Shutdown",
        message: "Connection Closed: The C++ server sent a SERVER_SHUTDOWN broadcast and closed all sockets.",
      });
    }
  };

  const handleServerRestart = () => {
    addLog("ServerThread", "info", "=== REBOOTING C++ POSIX SOCKET SERVER ===");
    addLog("ServerThread", "info", "bind(AF_INET, SOCK_STREAM, port 3000) SUCCESS");
    addLog("ServerThread", "info", "listen(backlog=10) SUCCESS. Listening on 127.0.0.1:3000");
    addLog("ServerThread", "info", "Socket workers active for Client 1 (FD 4) & Client 2 (FD 5).");
    setIsServerRunning(true);
  };

  const handleCustomPacketSend = () => {
    const packet = customPacketInput.trim();
    if (!packet) return;

    addLog("SocketThread:FD 4", "recv", `>> RECV: ${packet}`);
    const parts = packet.split(";");
    const cmd = parts[0]?.toUpperCase();

    if (cmd === "SERVER_SHUTDOWN") {
      handleServerShutdown();
    } else if (cmd === "CREATE_ROOM" && parts[1]) {
      addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomsMutex)");
      addLog("SocketThread:FD 4", "send", "<< SEND: CREATE_SUCCESS");
      addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${parts[1]};1;${parts[4] || 4};Unlocked`);
    } else if (cmd === "JOIN_ROOM" && parts[1]) {
      addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
      addLog("SocketThread:FD 4", "send", "<< SEND: JOIN_SUCCESS");
    } else if (cmd === "MESSAGE_ROOM" && parts[1]) {
      addLog(`ChatRoom:${parts[1]}`, "bcast", `broadcastMessage >> MESSAGE;${parts[3] || "user"};${parts[2] || "hello"}`);
    } else {
      addLog("SocketThread:FD 4", "send", `<< SEND: ACK;PROCESSED;${packet.length}_BYTES`);
    }

    setCustomPacketInput("");
  };

  const handleQuickDemo = () => {
    const time1 = "10:22:10";
    const time2 = "10:22:25";
    const demoMessages: ChatMessage[] = [
      { sender: "SYSTEM", text: "Room cyber-den created with password protection", time: "10:14:02", isSystem: true },
      { sender: "cypher", text: "POSIX worker thread pool spawned on FD 6.", time: "10:15:30" },
      { sender: "SYSTEM", text: "alex & maya connected via POSIX socket threads (FD 4 & FD 5)", time: "10:22:00", isSystem: true },
      { sender: "alex", text: "Hey Maya! Sockets connected and mutex lock acquired.", time: time1 },
      { sender: "maya", text: "Received loud and clear on FD 5! Ready for real-time messaging.", time: time2 },
    ];

    setRooms((prev) =>
      prev.map((r) =>
        r.name === "cyber-den"
          ? {
              ...r,
              currentUsers: 3,
              maxUsers: 4,
              participants: ["cypher", "alex", "maya"],
              messages: demoMessages,
            }
          : r
      )
    );

    setC1Username("alex");
    setC1ActiveRoomName("cyber-den");
    setC1State("chat");

    setC2Username("maya");
    setC2ActiveRoomName("cyber-den");
    setC2State("chat");

    addLog("ServerThread", "info", "=== QUICK DEMO INITIALIZED: Alex (FD 4) & Maya (FD 5) in cyber-den ===");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog("Broadcast", "bcast", "<< BCAST: UPDATE_DATA;cyber-den;3;4;Locked");
  };

  const handleResetLobby = () => {
    setRooms(INITIAL_ROOMS);
    setC1Username("alex");
    setC1State("lobby");
    setC1ActiveRoomName(null);
    setC1CreateName("");
    setC1CreatePassword("");
    setC1SelectedRoomName("cyber-den");
    setC1JoinPassword("");
    setC1ChatInput("");
    setC1WarningModal(null);

    setC2Username("maya");
    setC2State("lobby");
    setC2ActiveRoomName(null);
    setC2CreateName("");
    setC2CreatePassword("");
    setC2SelectedRoomName("cyber-den");
    setC2JoinPassword("");
    setC2ChatInput("");
    setC2WarningModal(null);

    addLog("ServerThread", "info", "=== ENVIRONMENT RESET: Both Client 1 & Client 2 returned to Lobby ===");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] overflow-hidden shadow-2xl my-8">
      {/* Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-neutral-900/80 border-b border-white/10 gap-3">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center bg-black/60 rounded-xl p-1 border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => setViewMode("dual")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === "dual"
                ? "bg-white text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Users size={14} />
            <span>Dual Clients (Side-by-Side)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("client1")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === "client1"
                ? "bg-white text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Monitor size={14} />
            <span>Client 1 (Alex · FD 4)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("client2")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === "client2"
                ? "bg-white text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Monitor size={14} />
            <span>Client 2 (Maya · FD 5)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("server")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              viewMode === "server"
                ? "bg-white text-black font-bold shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Terminal size={14} />
            <span>C++ Socket Server Bus</span>
            {isServerRunning && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        </div>

        {/* Server Status Telemetry */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isServerRunning ? "bg-emerald-400 animate-pulse" : "bg-red-500"
              }`}
            />
            {isServerRunning ? (
              <span className="text-neutral-300">127.0.0.1:3000 LISTENING</span>
            ) : (
              <span className="text-red-400 font-semibold">SERVER OFFLINE</span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
            <span>POSIX Sockets: FD 4 &amp; 5</span>
            <span className="text-white/20">·</span>
            <span className="text-cyan-400 font-semibold">std::mutex</span>
          </div>
        </div>
      </div>

      {/* Preset Action Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-neutral-950/70 border-b border-white/10 gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-neutral-400 hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
          >
            <Sparkles size={12} />
            <span>Quick Demo: Alex &amp; Maya in cyber-den</span>
          </button>
          <button
            type="button"
            onClick={handleResetLobby}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset to Empty Lobby</span>
          </button>
        </div>

        {viewMode !== "server" && (
          <button
            type="button"
            onClick={() => setShowServerDrawer((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-mono transition-colors ${
              showServerDrawer
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
            }`}
          >
            <Activity size={12} />
            <span>{showServerDrawer ? "Hide Server Bus Split" : "Show Live Server Bus Below"}</span>
          </button>
        )}
      </div>

      {/* Main View Area */}
      <div className="p-4 sm:p-6 min-h-[580px] flex flex-col justify-center">
        {viewMode === "dual" ? (
          /* =============================================================== */
          /* View 1: Dual Clients Side-by-Side                               */
          /* =============================================================== */
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Client 1: Alex (FD 4) */}
              <PyQt5ClientWindow
                clientId="client1"
                clientLabel="Client 1 (Alex · FD: 4)"
                defaultUsername="alex"
                fd={4}
                port="54210"
                accent="cyan"
                state={c1State}
                username={c1Username}
                setUsername={setC1Username}
                activeRoom={c1ActiveRoom}
                rooms={rooms}
                createName={c1CreateName}
                setCreateName={setC1CreateName}
                createPassword={c1CreatePassword}
                setCreatePassword={setC1CreatePassword}
                createMaxUsers={c1CreateMaxUsers}
                setCreateMaxUsers={setC1CreateMaxUsers}
                selectedRoomName={c1SelectedRoomName}
                setSelectedRoomName={setC1SelectedRoomName}
                joinPassword={c1JoinPassword}
                setJoinPassword={setC1JoinPassword}
                chatInput={c1ChatInput}
                setChatInput={setC1ChatInput}
                warningModal={c1WarningModal}
                setWarningModal={setC1WarningModal}
                chatContainerRef={c1ChatContainerRef}
                onCreateRoom={() => handleCreateRoom("client1")}
                onJoinRoom={() => handleJoinRoom("client1")}
                onSendMessage={() => handleSendMessage("client1")}
                onDisconnectRoom={() => handleDisconnectRoom("client1")}
                isServerRunning={isServerRunning}
              />

              {/* Client 2: Maya (FD 5) */}
              <PyQt5ClientWindow
                clientId="client2"
                clientLabel="Client 2 (Maya · FD: 5)"
                defaultUsername="maya"
                fd={5}
                port="54212"
                accent="purple"
                state={c2State}
                username={c2Username}
                setUsername={setC2Username}
                activeRoom={c2ActiveRoom}
                rooms={rooms}
                createName={c2CreateName}
                setCreateName={setC2CreateName}
                createPassword={c2CreatePassword}
                setCreatePassword={setC2CreatePassword}
                createMaxUsers={c2CreateMaxUsers}
                setCreateMaxUsers={setC2CreateMaxUsers}
                selectedRoomName={c2SelectedRoomName}
                setSelectedRoomName={setC2SelectedRoomName}
                joinPassword={c2JoinPassword}
                setJoinPassword={setC2JoinPassword}
                chatInput={c2ChatInput}
                setChatInput={setC2ChatInput}
                warningModal={c2WarningModal}
                setWarningModal={setC2WarningModal}
                chatContainerRef={c2ChatContainerRef}
                onCreateRoom={() => handleCreateRoom("client2")}
                onJoinRoom={() => handleJoinRoom("client2")}
                onSendMessage={() => handleSendMessage("client2")}
                onDisconnectRoom={() => handleDisconnectRoom("client2")}
                isServerRunning={isServerRunning}
              />
            </div>
          </div>
        ) : viewMode === "client1" ? (
          /* =============================================================== */
          /* View 2: Client 1 Solo (Alex - FD 4)                             */
          /* =============================================================== */
          <div className="w-full max-w-xl mx-auto">
            <PyQt5ClientWindow
              clientId="client1"
              clientLabel="Client 1 (Alex · FD: 4)"
              defaultUsername="alex"
              fd={4}
              port="54210"
              accent="cyan"
              state={c1State}
              username={c1Username}
              setUsername={setC1Username}
              activeRoom={c1ActiveRoom}
              rooms={rooms}
              createName={c1CreateName}
              setCreateName={setC1CreateName}
              createPassword={c1CreatePassword}
              setCreatePassword={setC1CreatePassword}
              createMaxUsers={c1CreateMaxUsers}
              setCreateMaxUsers={setC1CreateMaxUsers}
              selectedRoomName={c1SelectedRoomName}
              setSelectedRoomName={setC1SelectedRoomName}
              joinPassword={c1JoinPassword}
              setJoinPassword={setC1JoinPassword}
              chatInput={c1ChatInput}
              setChatInput={setC1ChatInput}
              warningModal={c1WarningModal}
              setWarningModal={setC1WarningModal}
              chatContainerRef={c1ChatContainerRef}
              onCreateRoom={() => handleCreateRoom("client1")}
              onJoinRoom={() => handleJoinRoom("client1")}
              onSendMessage={() => handleSendMessage("client1")}
              onDisconnectRoom={() => handleDisconnectRoom("client1")}
              isServerRunning={isServerRunning}
            />
          </div>
        ) : viewMode === "client2" ? (
          /* =============================================================== */
          /* View 3: Client 2 Solo (Maya - FD 5)                             */
          /* =============================================================== */
          <div className="w-full max-w-xl mx-auto">
            <PyQt5ClientWindow
              clientId="client2"
              clientLabel="Client 2 (Maya · FD: 5)"
              defaultUsername="maya"
              fd={5}
              port="54212"
              accent="purple"
              state={c2State}
              username={c2Username}
              setUsername={setC2Username}
              activeRoom={c2ActiveRoom}
              rooms={rooms}
              createName={c2CreateName}
              setCreateName={setC2CreateName}
              createPassword={c2CreatePassword}
              setCreatePassword={setC2CreatePassword}
              createMaxUsers={c2CreateMaxUsers}
              setCreateMaxUsers={setC2CreateMaxUsers}
              selectedRoomName={c2SelectedRoomName}
              setSelectedRoomName={setC2SelectedRoomName}
              joinPassword={c2JoinPassword}
              setJoinPassword={setC2JoinPassword}
              chatInput={c2ChatInput}
              setChatInput={setC2ChatInput}
              warningModal={c2WarningModal}
              setWarningModal={setC2WarningModal}
              chatContainerRef={c2ChatContainerRef}
              onCreateRoom={() => handleCreateRoom("client2")}
              onJoinRoom={() => handleJoinRoom("client2")}
              onSendMessage={() => handleSendMessage("client2")}
              onDisconnectRoom={() => handleDisconnectRoom("client2")}
              isServerRunning={isServerRunning}
            />
          </div>
        ) : (
          /* =============================================================== */
          /* View 4: C++ Socket Server Bus Terminal Full View                */
          /* =============================================================== */
          <ServerBusTerminal
            serverLogs={serverLogs}
            logFilter={logFilter}
            setLogFilter={setLogFilter}
            isServerRunning={isServerRunning}
            onShutdown={handleServerShutdown}
            onRestart={handleServerRestart}
            customPacketInput={customPacketInput}
            setCustomPacketInput={setCustomPacketInput}
            onDispatchPacket={handleCustomPacketSend}
            logsContainerRef={logsContainerRef}
            isDrawer={false}
          />
        )}

        {/* Live Server Bus Telemetry Split Drawer */}
        {viewMode !== "server" && showServerDrawer && (
          <div className="w-full max-w-6xl mx-auto mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                <Terminal size={14} />
                <span>Live C++ Server Telemetry Stream (Port 3000)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Observing live packets &amp; mutex locks as clients interact
              </span>
            </div>
            <ServerBusTerminal
              serverLogs={serverLogs}
              logFilter={logFilter}
              setLogFilter={setLogFilter}
              isServerRunning={isServerRunning}
              onShutdown={handleServerShutdown}
              onRestart={handleServerRestart}
              customPacketInput={customPacketInput}
              setCustomPacketInput={setCustomPacketInput}
              onDispatchPacket={handleCustomPacketSend}
              logsContainerRef={logsContainerRef}
              isDrawer={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* MAIN CHATROOM WHISPERERS CASE STUDY PAGE                                  */
/* ------------------------------------------------------------------------- */
export default function ChatroomProject() {
  return (
    <EngineeringArticle
      title="Chatroom Whisperers: Multi-Threaded POSIX Sockets & PyQt5 Desktop Architecture"
      category="Systems & Networking"
      description="An in-depth systems deep dive exploring concurrent network architecture: C++11 POSIX socket worker threads, RAII mutex synchronization, custom semicolon-delimited ASCII protocols, and a native Python PyQt5 desktop GUI."
      readingTime="12"
      sections={sections}
      metrics={[
        ["C++11 / POSIX", "Worker Thread Per Client"],
        ["std::mutex", "Thread Synchronization"],
        ["Python / PyQt5", "Desktop GUI Architecture"],
        [":3000 TCP", "Custom ASCII Protocol"],
      ]}
    >
      {/* 01 / Overview */}
      <ArticleSection id="overview" number="01" title="Narrative & System Overview">
        <div className="research-prose">
          <p>
            Real-time networked applications face a fundamental systems challenge: coordinating
            state transitions across distributed nodes without introducing race conditions, unbounded
            latency, or thread starvation. In <strong>Chatroom Whisperers</strong>, I architected a full-stack
            desktop chatting environment that pairs a high-performance <strong>C++11 POSIX TCP socket server</strong>{" "}
            with a native <strong>Python PyQt5 desktop graphical user interface</strong>.
          </p>
          <p>
            The backend daemon binds to port 3000, managing concurrent room allocation, capacity bounds
            (2 to 5 users per room), password authentication, and real-time message broadcasting. Rather than
            relying on high-overhead HTTP polling or complex JSON serialization layers, the system utilizes
            an optimized <strong>semicolon-delimited ASCII protocol</strong> over raw TCP sockets, synchronized
            strictly via POSIX thread primitives and <code>std::lock_guard</code> mutex guards.
          </p>
        </div>

        {/* Architecture Topology Grid */}
        <div className="grid md:grid-cols-3 gap-4 my-8">
          <div className="editorial-card p-5">
            <div className="flex items-center gap-2 text-white font-mono text-sm mb-2">
              <Cpu size={16} className="text-cyan-400" />
              <span>Multi-Threaded Server</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Main <code>ServerThread</code> runs a dedicated POSIX <code>accept()</code> loop, dynamically
              spawning worker threads with isolated file descriptors.
            </p>
          </div>

          <div className="editorial-card p-5">
            <div className="flex items-center gap-2 text-white font-mono text-sm mb-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Thread Synchronization</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Eliminates race conditions via <code>roomsMutex</code>, <code>roomDataMutex</code>, and{" "}
              <code>connectedClientsMutex</code>, using RAII lock guards for deterministic resource safety.
            </p>
          </div>

          <div className="editorial-card p-5">
            <div className="flex items-center gap-2 text-white font-mono text-sm mb-2">
              <Monitor size={16} className="text-purple-400" />
              <span>PyQt5 Desktop Client</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Native desktop GUI built with PyQt5 <code>QVBoxLayout</code>, featuring a non-blocking background
              socket listener thread (<code>QThread</code>) and Qt signal/slot event synchronization.
            </p>
          </div>
        </div>

        <div className="my-6">
          <SourceLink
            href={repo}
            label="View chatroom-whisperers on GitHub"
            meta="C++11, POSIX Sockets, PyQt5, Makefile"
          />
        </div>
      </ArticleSection>

      {/* 02 / POSIX Multi-threading */}
      <ArticleSection id="threading" number="02" title="POSIX Multi-Threading & Worker Thread Allocation">
        <div className="research-prose">
          <p>
            The networking backbone is implemented across <code>Server.cpp</code>, <code>socketserver.cpp</code>,
            <code>socket.cpp</code>, <code>thread.cpp</code>, and <code>Blockable.cpp</code>. When the server launches,
            <code>socketserver</code> creates a master streaming socket (<code>SOCK_STREAM</code>) and binds it to <code>127.0.0.1:3000</code>.
          </p>
          <p>
            To support concurrent connections without blocking the accept loop, the server allocates a dedicated
            worker thread per connected client. When a new TCP connection arrives, <code>accept()</code> returns a
            distinct socket file descriptor (e.g. FD 4 for Client 1, FD 5 for Client 2). The server encapsulates each descriptor
            into an isolated thread worker instance and starts its event pump.
          </p>
        </div>

        {/* Server Accept Loop Snippet */}
        <div className="research-figure my-8">
          <div className="p-4 bg-black/80 font-mono text-xs overflow-x-auto text-neutral-300">
            <div className="text-neutral-500 mb-2">// Server.cpp - Master accept loop and worker dispatch</div>
            <span className="text-purple-400">void</span> Server::run() &#123;<br />
            &nbsp;&nbsp;<span className="text-neutral-500">// Bind and listen on port 3000</span><br />
            &nbsp;&nbsp;socketServer.bind(3000);<br />
            &nbsp;&nbsp;socketServer.listen(10);<br />
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">while</span> (serverRunning) &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">int</span> clientFd = socketServer.accept();<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (clientFd &gt;= 0) &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500">// Guard client thread registry</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;std::lock_guard&lt;std::mutex&gt; lock(connectedClientsMutex);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ClientWorkerThread* worker = <span className="text-purple-400">new</span> ClientWorkerThread(clientFd);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;worker-&gt;start();<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clientThreads.push_back(worker);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />
            &nbsp;&nbsp;&#125;<br />
            &#125;
          </div>
          <div className="research-caption">
            Figure 1: Dedicated worker thread allocation per connected client. Each worker thread runs its own
            isolated event pump reading stream bytes from its unique socket descriptor.
          </div>
        </div>
      </ArticleSection>

      {/* 03 / Thread Safety & Mutex Locking */}
      <ArticleSection id="synchronization" number="03" title="Thread Safety & Mutex Locking">
        <div className="research-prose">
          <p>
            In a concurrent chat server, multiple threads access shared room registries simultaneously. For
            instance, Thread A may be executing <code>JOIN_ROOM</code> to increment current user count, while
            Thread B is broadcasting a message, and Thread C is executing <code>DISCONNECT_ROOM</code>. Without
            synchronization, race conditions would produce memory corruption or violated room capacity bounds.
          </p>
          <p>
            To eliminate data races with zero undefined behavior, the server establishes three discrete mutexes:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong><code>roomsMutex</code>:</strong> Serializes room registry modifications, preventing duplicate
              room creation and race conditions during room lookups.
            </li>
            <li>
              <strong><code>roomDataMutex</code>:</strong> Guards mutable room state: participant counts, message
              history buffers, and password verification checks.
            </li>
            <li>
              <strong><code>connectedClientsMutex</code>:</strong> Synchronizes the active client socket pool,
              ensuring safe broadcast dispatch when iterating across peer descriptors.
            </li>
          </ul>
        </div>

        {/* Mutex Guard Snippet */}
        <div className="research-figure my-8">
          <div className="p-4 bg-black/80 font-mono text-xs overflow-x-auto text-neutral-300">
            <div className="text-neutral-500 mb-2">// Server.cpp - RAII Mutex Synchronization</div>
            <span className="text-purple-400">bool</span> Server::joinRoom(<span className="text-cyan-400">const</span> std::string&amp; roomName, <span className="text-cyan-400">const</span> std::string&amp; password, <span className="text-purple-400">int</span> clientFd) &#123;<br />
            &nbsp;&nbsp;<span className="text-neutral-500">// RAII lock acquisition: releases automatically on return</span><br />
            &nbsp;&nbsp;std::lock_guard&lt;std::mutex&gt; lock(roomDataMutex);<br />
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">auto</span> it = rooms.find(roomName);<br />
            &nbsp;&nbsp;<span className="text-purple-400">if</span> (it == rooms.end()) <span className="text-purple-400">return</span> <span className="text-cyan-400">false</span>;<br />
            <br />
            &nbsp;&nbsp;ChatRoom&amp; room = it-&gt;second;<br />
            &nbsp;&nbsp;<span className="text-purple-400">if</span> (room.current_users &gt;= room.max_users) &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;sendPacket(clientFd, <span className="text-amber-300">&quot;ROOM_FULL&quot;</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-cyan-400">false</span>;<br />
            &nbsp;&nbsp;&#125;<br />
            &nbsp;&nbsp;<span className="text-purple-400">if</span> (room.is_locked &amp;&amp; room.password != password) &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;sendPacket(clientFd, <span className="text-amber-300">&quot;INVALID_PASSWORD&quot;</span>);<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-cyan-400">false</span>;<br />
            &nbsp;&nbsp;&#125;<br />
            <br />
            &nbsp;&nbsp;room.current_users++;<br />
            &nbsp;&nbsp;room.addParticipant(clientFd);<br />
            &nbsp;&nbsp;sendPacket(clientFd, <span className="text-amber-300">&quot;JOIN_SUCCESS&quot;</span>);<br />
            &nbsp;&nbsp;broadcastRoomUpdate(roomName);<br />
            &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-cyan-400">true</span>;<br />
            &#125;
          </div>
          <div className="research-caption">
            Figure 2: Atomic room membership validation with <code>std::lock_guard</code>. Guarantees that capacity
            and password checks are strictly serialized.
          </div>
        </div>
      </ArticleSection>

      {/* 04 / Network Protocol */}
      <ArticleSection id="protocol" number="04" title="Semicolon-Delimited Network Protocol">
        <div className="research-prose">
          <p>
            To achieve high serialization throughput and human-readable debugging over raw TCP streams,
            I designed a custom <strong>semicolon-delimited ASCII protocol</strong>. Packets are parsed
            into command tokens and parameters via standard string tokenizers.
          </p>
        </div>

        {/* Protocol Table */}
        <div className="overflow-x-auto my-8">
          <table className="w-full text-xs font-mono text-left border border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-neutral-900 border-b border-white/10 text-neutral-300">
              <tr>
                <th className="p-3 sm:p-4">Command</th>
                <th className="p-3 sm:p-4">Packet Structure</th>
                <th className="p-3 sm:p-4">Response / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-neutral-950/60 text-neutral-300">
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-cyan-400">CREATE_ROOM</td>
                <td className="p-3 sm:p-4"><code>CREATE_ROOM;&lt;name&gt;;&lt;pwd&gt;;&lt;curr&gt;;&lt;max&gt;;&lt;user&gt;</code></td>
                <td className="p-3 sm:p-4">Validates uniqueness, stores room, broadcasts UPDATE_DATA</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-cyan-400">JOIN_ROOM</td>
                <td className="p-3 sm:p-4"><code>JOIN_ROOM;&lt;name&gt;;&lt;pwd&gt;;&lt;user&gt;</code></td>
                <td className="p-3 sm:p-4">Checks capacity &amp; password; returns JOIN_SUCCESS, ROOM_FULL, or INVALID_PASSWORD</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-cyan-400">MESSAGE_ROOM</td>
                <td className="p-3 sm:p-4"><code>MESSAGE_ROOM;&lt;name&gt;;&lt;text&gt;;&lt;user&gt;</code></td>
                <td className="p-3 sm:p-4">Broadcasts <code>MESSAGE;&lt;user&gt;;&lt;text&gt;</code> to all peers in room descriptor list</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-cyan-400">DISCONNECT_ROOM</td>
                <td className="p-3 sm:p-4"><code>DISCONNECT_ROOM;&lt;name&gt;;&lt;user&gt;</code></td>
                <td className="p-3 sm:p-4">Decrements count, removes client descriptor, broadcasts UPDATE_DATA</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-cyan-400">UPDATE_DATA</td>
                <td className="p-3 sm:p-4"><code>UPDATE_DATA;&lt;name&gt;;&lt;curr&gt;;&lt;max&gt;;&lt;status&gt;</code></td>
                <td className="p-3 sm:p-4">Server broadcast updating client QComboBox lobbies with live room capacities</td>
              </tr>
              <tr>
                <td className="p-3 sm:p-4 font-semibold text-red-400">SERVER_SHUTDOWN</td>
                <td className="p-3 sm:p-4"><code>SERVER_SHUTDOWN;&lt;reason&gt;</code></td>
                <td className="p-3 sm:p-4">SIGINT signal handler flushes buffers and closes all worker socket descriptors</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArticleSection>

      {/* 05 / PyQt5 Architecture */}
      <ArticleSection id="pyqt5-architecture" number="05" title="PyQt5 Desktop GUI Architecture">
        <div className="research-prose">
          <p>
            The desktop client is implemented in Python using <strong>PyQt5</strong> (<code>client.py</code>).
            A key architectural requirement was maintaining a 100% fluid UI without blocking the Qt event
            dispatcher (<code>QApplication.exec_()</code>).
          </p>
          <p>
            In <code>client.py</code>, the layout is organized into two primary classes:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong><code>ChatRoomGUI</code> (Lobby):</strong> Arranged in an authentic single vertical stack
              (<code>QVBoxLayout</code>). Contains the username input, underlined &ldquo;Create Chatroom&rdquo; section
              (room name, password, 2-5 user capacity slider, create button), spacing, and underlined &ldquo;Join Chat Room&rdquo;
              section (available room dropdown, dynamically revealed password input for locked rooms, and connect button).
            </li>
            <li>
              <strong><code>ChatWindow</code> (Active Chat):</strong> Opened upon joining a room. Features a read-only
              <code>QTextEdit</code> message history, a <code>QLineEdit</code> input field, and <code>Send</code> and{" "}
              <code>Disconnect</code> action buttons.
            </li>
            <li>
              <strong><code>NetworkWorkerThread</code> (QThread):</strong> Runs a continuous background socket read loop,
              emitting Qt signals (<code>pyqtSignal(str)</code>) to update GUI widgets asynchronously.
            </li>
          </ul>
        </div>

        {/* client.py GUI Structure Snippet */}
        <div className="research-figure my-8">
          <div className="p-4 bg-black/80 font-mono text-xs overflow-x-auto text-neutral-300">
            <div className="text-neutral-500 mb-2"># client.py - Exact PyQt5 Vertical Stack Layout</div>
            <span className="text-purple-400">class</span> <span className="text-cyan-400">ChatRoomGUI</span>(QMainWindow):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">def</span> __init__(self):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super().__init__()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.setWindowTitle(<span className="text-amber-300">&quot;Chatroom Whisperers&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.resize(500, 500)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.setWindowIcon(QIcon(<span className="text-amber-300">&quot;logo.png&quot;</span>))<br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout = QVBoxLayout()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500"># 1. Username</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(QLabel(<span className="text-amber-300">&quot;Username:&quot;</span>))<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.username_input = QLineEdit()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.username_input)<br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500"># 2. Create Chatroom</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;create_label = QLabel(<span className="text-amber-300">&quot;Create Chatroom&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;create_label.setStyleSheet(<span className="text-amber-300">&quot;text-decoration: underline;&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(create_label)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(QLabel(<span className="text-amber-300">&quot;Chatroom Name:&quot;</span>))<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.room_name_input = QLineEdit()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.room_name_input)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(QLabel(<span className="text-amber-300">&quot;Chatroom Password (Optional):&quot;</span>))<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.room_pwd_input = QLineEdit()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.room_pwd_input.setEchoMode(QLineEdit.Password)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.room_pwd_input)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(QLabel(<span className="text-amber-300">&quot;Lobby Size (2-5):&quot;</span>))<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.lobby_slider = QSlider(Qt.Horizontal)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.lobby_slider.setRange(2, 5)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.lobby_slider)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.create_btn = QPushButton(<span className="text-amber-300">&quot;Create Chatroom&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.create_btn)<br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500"># 3. Spacing &amp; Join Chat Room</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addSpacing(20)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;join_label = QLabel(<span className="text-amber-300">&quot;Join Chat Room&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;join_label.setStyleSheet(<span className="text-amber-300">&quot;text-decoration: underline;&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(join_label)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(QLabel(<span className="text-amber-300">&quot;Available Chatrooms:&quot;</span>))<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.rooms_combo = QComboBox()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.rooms_combo)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500"># Password dynamically revealed only when locked room selected</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;self.connect_btn = QPushButton(<span className="text-amber-300">&quot;Connect&quot;</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;layout.addWidget(self.connect_btn)
          </div>
          <div className="research-caption">
            Figure 3: Clean, authentic single vertical stack layout in PyQt5 with dynamic QComboBox and password prompt.
          </div>
        </div>
      </ArticleSection>

      {/* 06 / Interactive Studio */}
      <ArticleSection id="interactive-studio" number="06" title="Interactive PyQt5 & C++ Server Studio">
        <div className="research-prose">
          <p>
            Test the authentic full-stack application directly in the browser with <strong>dual side-by-side PyQt5 desktop clients</strong>{" "}
            (Alex on FD 4 and Maya on FD 5). Watch in real time as Alex creates a room in Client 1, Maya discovers and connects to it in Client 2,
            and both clients exchange messages over the simulated C++ socket server on port 3000 synchronized via <code>std::mutex</code>.
          </p>
        </div>

        {/* The Live Interactive Studio Simulator */}
        <InteractiveChatroomStudio />

        <div className="editorial-card p-5 mt-6">
          <h4 className="text-sm font-semibold text-white mb-2">Try These Test Scenarios:</h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Cross-Client Room Discovery:</strong> In Client 1 (Alex), create a new room (e.g. <code>distributed-nodes</code>, password <code>cluster</code>). Notice that Client 2 (Maya) immediately discovers it in her &quot;Available Chatrooms&quot; dropdown.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Two-Way Real-Time Chat:</strong> Once Maya connects in Client 2, send messages back and forth between Alex and Maya. Observe the packets routed through port 3000 and displayed simultaneously in both windows.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Locked Room Password Verification:</strong> Select <code>cyber-den</code> and enter password <code>matrix</code> to connect. Trying any other password triggers an authentic simulated <code>QMessageBox.warning</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Capacity Enforcement:</strong> Select <code>algo-lab</code> (4/4 users). Attempting to connect will trigger an authentic <code>ROOM_FULL</code> error dialog.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Server Bus Telemetry:</strong> Switch to the <strong>C++ Socket Server Bus</strong> tab or toggle the live server split drawer to observe raw <code>std::lock_guard</code> mutex acquisitions and semicolon packet parsing on port 3000 without any page jumping.</span>
            </li>
          </ul>
        </div>
      </ArticleSection>

      {/* 07 / POSIX Primitives */}
      <ArticleSection id="posix-primitives" number="07" title="POSIX Synchronization Primitives">
        <div className="research-prose">
          <p>
            Building rock-solid concurrent systems in C++ requires a firm grasp of underlying POSIX
            threading primitives. The system design relies on key patterns:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 my-8">
          <div className="editorial-card p-5">
            <h4 className="text-sm font-semibold text-white font-mono mb-2">Blockable &amp; Cancellation</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Worker threads inherit from a <code>Blockable</code> abstraction. When a client socket is closed
              or <code>SIGINT</code> is caught, the server signals cancellation tokens, causing blocking socket
              calls to abort cleanly rather than hanging indefinitely.
            </p>
          </div>

          <div className="editorial-card p-5">
            <h4 className="text-sm font-semibold text-white font-mono mb-2">PipeUser &amp; Inter-Thread Signaling</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Uses anonymous UNIX pipes (<code>pipe(int fds[2])</code>) for inter-thread communication. Worker
              threads write single-byte signals to wake up listener threads without busy polling.
            </p>
          </div>

          <div className="editorial-card p-5">
            <h4 className="text-sm font-semibold text-white font-mono mb-2">Counting Semaphores (ThreadSem)</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Wraps POSIX <code>sem_t</code> (<code>sem_wait</code>, <code>sem_post</code>) to enforce hard global
              caps on concurrent client connections, preventing server socket descriptor exhaustion.
            </p>
          </div>

          <div className="editorial-card p-5">
            <h4 className="text-sm font-semibold text-white font-mono mb-2">FlexWait Multiplexing</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Provides an abstraction over POSIX <code>select()</code> and <code>poll()</code>, multiplexing
              across multiple client socket file descriptors simultaneously with microsecond timeouts.
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* 08 / Source Code Review */}
      <ArticleSection id="source-review" number="08" title="Source Code Review & Metrics">
        <div className="research-prose">
          <p>
            The project repository is structured into modular components separating network transport,
            POSIX thread execution, protocol serialization, and GUI presentation:
          </p>
        </div>

        <div className="space-y-3 my-8">
          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">Server.cpp</span>
              <p className="text-xs text-neutral-400 mt-0.5">Master TCP accept loop and client thread lifecycle management</p>
            </div>
            <SourceLink href={`${repo}/blob/master/Server.cpp`} label="Source" />
          </div>

          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">socketserver.cpp / socketserver.h</span>
              <p className="text-xs text-neutral-400 mt-0.5">POSIX socket server wrapper inheriting from Blockable</p>
            </div>
            <SourceLink href={`${repo}/blob/master/socketserver.cpp`} label="Source" />
          </div>

          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">socket.cpp / socket.h</span>
              <p className="text-xs text-neutral-400 mt-0.5">TCP streaming socket encapsulation</p>
            </div>
            <SourceLink href={`${repo}/blob/master/socket.cpp`} label="Source" />
          </div>

          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">thread.cpp / thread.h</span>
              <p className="text-xs text-neutral-400 mt-0.5">POSIX pthread wrapper with virtual ThreadMain()</p>
            </div>
            <SourceLink href={`${repo}/blob/master/thread.cpp`} label="Source" />
          </div>

          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">Blockable.cpp / Blockable.h</span>
              <p className="text-xs text-neutral-400 mt-0.5">I/O multiplexing event and termination abstraction</p>
            </div>
            <SourceLink href={`${repo}/blob/master/Blockable.cpp`} label="Source" />
          </div>

          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">client.py</span>
              <p className="text-xs text-neutral-400 mt-0.5">PyQt5 client with single vertical stack lobby and chat window</p>
            </div>
            <SourceLink href={`${repo}/blob/master/client.py`} label="Source" />
          </div>

          <div className="editorial-card p-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-white font-semibold">Makefile</span>
              <p className="text-xs text-neutral-400 mt-0.5">Build rules linking Server.o, thread.o, socket.o, socketserver.o, Blockable.o</p>
            </div>
            <SourceLink href={`${repo}/blob/master/Makefile`} label="Source" />
          </div>
        </div>
      </ArticleSection>

      {/* 09 / Compilation & Execution */}
      <ArticleSection id="compilation" number="09" title="Build & Local Execution">
        <div className="research-prose">
          <p>
            Both the C++ server and Python PyQt5 client can be built and executed on any POSIX-compliant
            environment (Linux, macOS, WSL) with <code>g++</code> and <code>python3</code>:
          </p>
        </div>

        {/* Terminal Run Commands */}
        <div className="editorial-card p-5 my-8 space-y-4">
          <div>
            <div className="text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-2">
              <Terminal size={14} className="text-emerald-400" />
              <span>1. Compile and Launch C++ POSIX Socket Server:</span>
            </div>
            <div className="p-3 bg-black/90 rounded-lg border border-white/10 font-mono text-xs text-neutral-200 overflow-x-auto">
              make clean &amp;&amp; make<br />
              <span className="text-neutral-500"># Or direct g++ compilation:</span><br />
              g++ -o Server Server.o thread.o socket.o socketserver.o Blockable.o -pthread -l rt<br />
              ./Server 3000
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400" />
              <span>2. Launch PyQt5 Desktop Client:</span>
            </div>
            <div className="p-3 bg-black/90 rounded-lg border border-white/10 font-mono text-xs text-neutral-200 overflow-x-auto">
              pip install PyQt5<br />
              python3 client.py
            </div>
          </div>
        </div>

        <div className="editorial-card p-6 mt-8">
          <h4 className="text-base font-light text-white mb-2">Key Engineering Takeaways</h4>
          <ul className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✔</span>
              <span>
                <strong>Kernel-Level Decoupling:</strong> Dedicated POSIX socket descriptors per client eliminate head-of-line blocking between distinct conversation streams.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✔</span>
              <span>
                <strong>RAII Concurrency:</strong> Relying on <code>std::lock_guard</code> ensures mutual exclusion invariants are strictly preserved even during socket read failures or network disconnects.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✔</span>
              <span>
                <strong>Event Loop Isolation:</strong> Offloading network socket I/O to a dedicated <code>QThread</code> prevents UI thread starvation, delivering 60 FPS responsiveness in desktop GUIs.
              </span>
            </li>
          </ul>
        </div>
      </ArticleSection>
    </EngineeringArticle>
  );
}
