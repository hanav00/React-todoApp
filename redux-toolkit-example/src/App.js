import { legacy_createStore as createStore } from '@reduxjs/toolkit';
import { Provider,  useDispatch, useSelector } from 'react-redux';
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import './App.css';
import { type } from '@testing-library/user-event/dist/type';

//redux 라이브러리의 reducer 함수
const reducer = (state, action) => {

  if (action.type === 'up') {
    return {...state, value:state.value + action.step} //불변성 유지를 위하여
  }
  return state;
}

//reux-toolkit 사용
const counterSlice = createSlice({
  name: 'counterSlice',
  initialState: {
    up:(state, action) => {
      console.log(action);
      state.value = state.value + action.step;
    }
  }
})

const storeReduxToolKit = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})
const initialStateRedux = {value:0};
const storeRedux = createStore(reducer, initialStateRedux);

function App() {
  return (

    <div className='App'>
      <h1>2023 06 23</h1>

      <br />

      <div id='container'>
        <h2>▶ 예제</h2>
        <Provider store={storeRedux}>
          <CounterRedux />
        </Provider>

        <Provider store={storeRedux}>
          <CounterReduxToolKit />
        </Provider>
      </div>
      
      <hr />

    </div>
  );
}

//Redux 라이브러리 사용
const CounterRedux = () => {
  
  const dispatch = useDispatch();
  const countRedux = useSelector((state) => state.value);
  
  return (
    <div>
      <button onClick={
        () => {dispatch({type:'up', step:2})}
      }>Redux를 사용해서 state값 증가</button>
      {CounterRedux}
      <br />
      <></>
    </div>
  )
}

//redux-toolkit 사용
const CounterReduxToolKit = () => {

  const dispatch = useDispatch();
  const countReduxToolKIt = useSelector((state) => state.counter.value);

  return (
    <div>
      <button onClick={() => {
        dispatch({type: 'counterSlice/up', step:1});
      }}>redux toolkit를 사용해서 state 값 증가</button>
      <br />
    </div>
  )
}

export default App;
