import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const getSessionId = () => {
    let id = sessionStorage.getItem('chat_session')
    if (!id) {
        id = 'sess_' + Math.random().toString(36).slice(2) + Date.now()
        sessionStorage.setItem('chat_session', id)
    }
    return id
}

const ChatWidget = () => {
    const { backendUrl, userData } = useContext(AppContext)
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [connected, setConnected] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)
    const socketRef = useRef(null)
    const bottomRef = useRef(null)
    const sessionId = useRef(getSessionId())

    useEffect(() => {
        const socket = io(backendUrl, { transports: ['websocket', 'polling'] })
        socketRef.current = socket

        socket.on('connect', () => {
            setConnected(true)
            const userName = userData ? userData.name : 'Гость'
            const userEmail = userData ? userData.email : ''
            socket.emit('user:join', { sessionId: sessionId.current, userName, userEmail })
        })

        socket.on('disconnect', () => setConnected(false))

        socket.on('chat:history', (history) => {
            setMessages(history)
        })

        socket.on('message:new', (msg) => {
            setMessages(prev => [...prev, msg])
            if (!open && msg.sender === 'admin') {
                setHasUnread(true)
            }
        })

        return () => socket.disconnect()
    }, [backendUrl, userData])

    useEffect(() => {
        if (open) {
            setHasUnread(false)
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [open, messages])

    const sendMessage = (e) => {
        e.preventDefault()
        if (!text.trim() || !socketRef.current) return
        socketRef.current.emit('user:message', { sessionId: sessionId.current, text: text.trim() })
        setText('')
    }

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>

            {/* Chat window */}
            {open && (
                <div className='w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden' style={{ height: '460px' }}>

                    {/* Header */}
                    <div className='bg-primary px-4 py-3 flex items-center justify-between flex-shrink-0'>
                        <div className='flex items-center gap-2'>
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-400'}`} />
                            <p className='text-white font-medium text-sm'>Поддержка</p>
                        </div>
                        <button onClick={() => setOpen(false)} className='text-white/80 hover:text-white transition-colors'>
                            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50'>
                        {messages.length === 0 && (
                            <div className='text-center text-gray-400 text-sm mt-8'>
                                <p className='text-2xl mb-2'>👋</p>
                                <p>Привет! Чем можем помочь?</p>
                                <p className='text-xs mt-1'>Напишите нам — ответим в ближайшее время</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'admin' && (
                                    <div className='w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-auto'>
                                        <span className='text-white text-xs font-bold'>П</span>
                                    </div>
                                )}
                                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                }`}>
                                    <p className='leading-relaxed'>{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className='p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0'>
                        <input
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder='Введите сообщение...'
                            className='flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-primary transition-colors'
                        />
                        <button
                            type='submit'
                            disabled={!text.trim()}
                            className='w-9 h-9 bg-primary rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-indigo-600 transition-colors'
                        >
                            <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setOpen(o => !o)}
                className='w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-600 transition-colors relative'
            >
                {open ? (
                    <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                ) : (
                    <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                    </svg>
                )}
                {hasUnread && !open && (
                    <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white' />
                )}
            </button>
        </div>
    )
}

export default ChatWidget
