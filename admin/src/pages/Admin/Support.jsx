import React, { useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'

const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const formatDate = (date) => new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })

const Support = () => {
    const { backendUrl, aToken } = useContext(AdminContext)
    const [chats, setChats] = useState([])
    const [activeSession, setActiveSession] = useState(null)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [connected, setConnected] = useState(false)
    const socketRef = useRef(null)
    const bottomRef = useRef(null)

    // Load all chat sessions
    const loadChats = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/chat/all', { headers: { aToken } })
            if (data.success) setChats(data.chats)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadChats()

        const socket = io(backendUrl, { transports: ['websocket', 'polling'] })
        socketRef.current = socket

        socket.on('connect', () => {
            setConnected(true)
            socket.emit('admin:join')
        })
        socket.on('disconnect', () => setConnected(false))

        // Refresh chat list when any chat updates
        socket.on('chat:updated', () => loadChats())

        // New message in active chat
        socket.on('message:new', (msg) => {
            setMessages(prev => [...prev, msg])
        })

        return () => socket.disconnect()
    }, [backendUrl, aToken])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const openChat = (session) => {
        setActiveSession(session)
        setMessages([])
        socketRef.current?.emit('admin:open-chat', { sessionId: session.sessionId })
        socketRef.current?.on('chat:history', (history) => {
            setMessages(history)
        })
    }

    const sendMessage = (e) => {
        e.preventDefault()
        if (!text.trim() || !activeSession || !socketRef.current) return
        socketRef.current.emit('admin:message', { sessionId: activeSession.sessionId, text: text.trim() })
        setText('')
    }

    const closeChat = async (sessionId) => {
        await axios.post(backendUrl + `/api/chat/close/${sessionId}`, {}, { headers: { aToken } })
        loadChats()
        if (activeSession?.sessionId === sessionId) setActiveSession(null)
    }

    return (
        <div className='m-5 flex flex-col md:flex-row gap-5 h-[calc(100vh-100px)]'>

            {/* Chat list */}
            <div className={`w-full md:w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-200 flex-col overflow-hidden ${activeSession ? 'hidden md:flex' : 'flex'}`}>
                <div className='p-4 border-b border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-semibold text-gray-800'>Чаты поддержки</h2>
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-300'}`} title={connected ? 'Онлайн' : 'Не подключено'} />
                    </div>
                    <p className='text-xs text-gray-400 mt-0.5'>{chats.length} диалогов</p>
                </div>

                <div className='flex-1 overflow-y-auto'>
                    {chats.length === 0 && (
                        <div className='text-center text-gray-400 text-sm p-6'>
                            <p className='text-2xl mb-2'>💬</p>
                            <p>Нет активных чатов</p>
                        </div>
                    )}
                    {chats.map((chat) => {
                        const lastMsg = chat.messages[chat.messages.length - 1]
                        const isActive = activeSession?.sessionId === chat.sessionId
                        return (
                            <div
                                key={chat.sessionId}
                                onClick={() => openChat(chat)}
                                className={`p-4 cursor-pointer border-b border-gray-50 transition-colors ${isActive ? 'bg-indigo-50 border-l-4 border-l-primary' : 'hover:bg-gray-50'}`}
                            >
                                <div className='flex items-start justify-between gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                                            <span className='text-primary text-sm font-semibold'>
                                                {chat.userName?.charAt(0).toUpperCase() || 'Г'}
                                            </span>
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='text-sm font-medium text-gray-800 truncate'>{chat.userName}</p>
                                            {chat.userEmail && <p className='text-xs text-gray-400 truncate'>{chat.userEmail}</p>}
                                            <p className='text-xs text-gray-400'>{formatDate(chat.lastMessageAt)}</p>
                                        </div>
                                    </div>
                                    {chat.isOpen && (
                                        <span className='text-xs text-green-500 flex-shrink-0 mt-0.5'>●</span>
                                    )}
                                </div>
                                {lastMsg && (
                                    <p className='text-xs text-gray-500 mt-2 truncate pl-11'>
                                        {lastMsg.sender === 'admin' ? 'Вы: ' : ''}{lastMsg.text}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Chat window */}
            <div className={`flex-1 bg-white rounded-2xl border border-gray-200 flex-col overflow-hidden ${activeSession ? 'flex' : 'hidden md:flex'}`}>
                {!activeSession ? (
                    <div className='flex-1 flex items-center justify-center text-gray-400'>
                        <div className='text-center'>
                            <p className='text-4xl mb-3'>💬</p>
                            <p className='font-medium text-gray-500'>Выберите чат слева</p>
                            <p className='text-sm mt-1'>чтобы начать переписку с клиентом</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat header */}
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
                            <div className='flex items-center gap-3 min-w-0'>
                                <button
                                    onClick={() => setActiveSession(null)}
                                    aria-label='Назад к списку чатов'
                                    className='md:hidden -ml-1 p-1 text-gray-500 hover:text-primary transition-colors flex-shrink-0'
                                >
                                    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
                                    </svg>
                                </button>
                                <div className='w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <span className='text-primary font-semibold'>
                                        {activeSession.userName?.charAt(0).toUpperCase() || 'Г'}
                                    </span>
                                </div>
                                <div className='min-w-0'>
                                    <p className='font-medium text-gray-800 truncate'>{activeSession.userName}</p>
                                    <p className='text-xs text-gray-400 truncate'>{activeSession.userEmail || activeSession.sessionId.slice(0, 20) + '…'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => closeChat(activeSession.sessionId)}
                                className='text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors flex-shrink-0 whitespace-nowrap ml-2'
                            >
                                Закрыть чат
                            </button>
                        </div>

                        {/* Messages */}
                        <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50'>
                            {messages.length === 0 && (
                                <div className='text-center text-gray-400 text-sm mt-12'>Сообщений пока нет</div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'user' && (
                                        <div className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-2 mt-auto'>
                                            <span className='text-gray-600 text-xs font-bold'>
                                                {activeSession.userName?.charAt(0).toUpperCase() || 'Г'}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm ${
                                        msg.sender === 'admin'
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                    }`}>
                                        <p className='leading-relaxed'>{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className='p-4 border-t border-gray-100 bg-white flex gap-3'>
                            <input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder='Написать ответ...'
                                className='flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors'
                            />
                            <button
                                type='submit'
                                disabled={!text.trim()}
                                className='px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium disabled:opacity-40 hover:bg-indigo-600 transition-colors'
                            >
                                Отправить
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default Support
