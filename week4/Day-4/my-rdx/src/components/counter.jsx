import {useSelector, useDispatch} from 'react-redux'
import {increment, decrement} from '../app/features/counter/counterSlice'


const Counter = () => {
    //read the data from store this counter comes from store and value comes from counter slice
    const count = useSelector((state)=> state.counter.value)
    //changeing data by sending actions to store
    const dispatch = useDispatch()
    return <div>
        <h1>{count}</h1>
        <button onClick={()=> dispatch(increment())}>+</button>
        <button onClick={()=> dispatch(decrement())}>-</button>
    </div>
}

export default Counter;