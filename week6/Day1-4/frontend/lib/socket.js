import io from 'socket.io-client'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.96:4000'
export const socket = io(API_URL, { autoConnect: true }) 