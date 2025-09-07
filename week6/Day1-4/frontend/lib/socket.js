import io from 'socket.io-client'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
export const socket = io(API_URL, { autoConnect: true }) 