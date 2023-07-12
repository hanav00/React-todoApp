import './App.css';
import { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { createContext } from 'react';

/*
 * 1. useState
 * 2. useEffet: 어떠한 component가 마운트(화면에 첫 렌더링), 
 *              업데이트(재랜더링), 언마운트(화면에서 사라짐) 될 때
 *              특정한 코드를 처리해주는 함수
 * 3. useRef: Ref Object를 리턴하는 Hook 함수. 
 *            리턴된 Ref값은 컴포먼트의 전 생애 기간동안 값이 유지됨.
 *            따라서 렌더링이 되더라도 초기화하면 안되는 값을 저장할 때 유용
 * 4. useContext: Redux 또는 Redux Toolkit가 많이 사용됨.
 *                데이터 공유 함수로, Context로 공유한 데이터를 받아오는 역할
 * 5. useMemo: 반복된 계산을 매번 다시 수행하는 것이 아니라 
 *              캐싱해 놓은 결과를 불러내서 재사용 하는 최적화 기능
 *              useMemo 함수의 2번째 인자인 의존성 배열의 값이 변경될때만
 *              첫번째 인자인 콜백함수를 실행시키고,
 *              실행이 안됐을 경우는 기존 보관 중인 값을 리턴해줌
 *              useEffect 함수의 2번재 인자에 객체가 있는 경우에 발생하는 문제를
 *              useMemo 함수는 해결할 방법이 있기 때문에 
 *              useEffect을 대신해서 사용되는 경우가 있음
 * 6. useCallback: useMemo처럼 Memorization 기능을 수행하는 함수로, 
 *                 useMemo가 콜백함수의 리턴값을 Memorization을 하고
 *                 useCallback은 콜백함수 자체를 Memorization 함
 */
function App() {

  return (
    <div className='App'>
      <h1>2023 06 22</h1>

      <br />

      <div id='container'>
        <h2>▶useState 예제</h2>
        <Example1></Example1>
      </div>
      
      <hr />

      <div id='container'>
        <h2>▶배열 출력 예제</h2>
        <Example2></Example2>
      </div>

      <hr />

      <div id='container'>
        <h2>▶useEffect 예제</h2>
        <Example3></Example3>
      </div>
      
      <hr />

      <div id='container'>
        <h2>▶ 타이머 만들기</h2>
        <Example4></Example4>
      </div>
            
      <hr />

      <div id='container'>
        <h2>▶ State Ref Var 비교</h2>
        <Example5></Example5>
      </div>
                  
      <hr />

      <div id='container'>
        <h2>▶ Ref 예제</h2>
        <Example6></Example6>
      </div>
                        
      <hr />

      <div id='container'>
        <h2>▶ useContext 예제</h2>
        <Example7></Example7>
      </div>

      <hr />

      <div id='container'>
        <h2>▶ useMemo 예제</h2>
        <Example8></Example8>
      </div>
      
      <hr />

      <br />

      <h1>2023 06 23</h1>

      <br />

      <div id='container'>
        <h2>▶ useMemo 예제</h2>
        <Example9></Example9>
      </div>

      <hr />

      <div id='container'>
        <h2>▶ 얇은 복사 / 깊은 복사 예제</h2>
        <CopyTest />
      </div>

      <hr />

      <div id='container'>
        <h2>▶  예제</h2>
        <Example10 />
      </div>
      
      <hr />

      <div id='container'>
        <h2>▶  예제</h2>
        <Example11 />
      </div>
      
      <hr />



    </div>
  );
}

const Example1 = () => {

  const [time, setTime] = useState(1);
  const [time2, setTime2] = useState("오전");

  const changeTime = () => {
    setTime(time+1);
    if (time >= 12) {
      setTime(1);
      if (time2 === "오전") {
        setTime2("오후");
      } else {
        setTime2("오전");
      }
    }
  }

  return (
    <div>
      <h3>현재 시간: {time2} {time}시</h3>
      <button onClick={changeTime}>시간 변경</button>
    </div>
  )
}


const Example2 = () => {
  
  const [names, setNames] = useState(
    ["김민영", "김보리"]
  );
  const [input, setInput] = useState('');

  const writeText = (e) => {
    setInput(e.target.value);
  }

  const submit = () => {
    setNames((prevState) => {
      return [input,...prevState]
    })
    setInput('');
  }

  return(
    <div>
      <input type="text" value={input} onChange={writeText}></input>
      <button onClick={submit}>추가</button>

      {/* map함수는 자동으로 for문을 실행시켜서 인덱스와 값을 인자로 받아옴 */}
      {names.map((name, idx) => {
        return <li key={idx}>{name}</li>
      })}
    </div>
  )
}



const Example3 = () => {

  const [count, setCount] = useState(1);
  const [name, setName] = useState('');

  const clickHere = () => {
    setCount(count+1);
  }

  const writeText = (e) => {
    setName(e.target.value);
  }

  //매번 랜더링이 될 때마다 콜백함수가 실행
  useEffect(() => {console.log("(1) 렌더링 발생")});

  //의존성 배열 (Dependency Array)
  //마운트(첫 랜더링)될 때만 콜백함수가 실행
  useEffect(() => {console.log("(2) 마운트 발생")}, []);

  //count가 마운트, 업데이트될 때마다 콜백함수가 실행
  useEffect(() => {console.log("(3) count 업데이트 발생")}, [count]);

  //*console창 처음에 2개가 출력되는 이유: 리엑트가 잘 돌아가는지 사전에 또 실행해봐서..

  return(
    <div>
      count: {count} &nbsp;
      <button onClick={clickHere}>여기를 클릭!</button>
      <br />
      <input type='text' value={name} onChange={writeText} placeholder='이름을 입력하세요'></input>
      <br />
      <li>name: {name}</li>
    </div>
  )
}



const Example4 = () => {
  

  const [showTimer, setShowTimer] = useState(false);
  const [sec, setSec] = useState(0);

  let btn_name;
  if(showTimer) {
    btn_name = "||";
  } else {
    btn_name = "▶";    
  }

  const Timer = () => {

    useEffect(() => {
      const timer = setInterval(() => {
        console.log("타이머 시작");
        setSec(sec+1);
      }, 1000);
      return () => {
        clearInterval(timer);
      }  
    });
  
    return(
      <div>
        <h2>{sec}초</h2>
      </div>
    )
  }

  return(
    <div>
      {/* showTimer가 true일 때 <Timer />를 실행*/}
      {showTimer && <Timer></Timer>}
      {!showTimer && <h2>타이머를 시작해주세요</h2>} 
      <h3>기록된 시간: {sec}초</h3>
      <button className='btn_timer' onClick={() => {setShowTimer(!showTimer)}}>{btn_name}</button>
      <button onClick={() => {setSec(0)}}>초기화</button>
    </div>
  )
}




const Example5 = () => {

  const [count, setCount] = useState(1);
  const countRef = useRef(1);

  let countVar = 1;

  return(
    <div>
      <h3>State: {count}</h3>
      <h3>Ref: {countRef.current}</h3>
      <h3>Var: {countVar}</h3>
      <button onClick={() => {setCount(count+1)}}>State 증가</button>
      <button onClick={() => {countRef.current = countRef.current+1; console.log(countRef.current);}}>Ref 증가</button>
      <button onClick={() => {countVar ++; console.log(countVar);}}>Var 증가</button>
    </div>
  )
}



const Example6 = () => {
  
  const inputRef = useRef();

  const login = () => {
    alert(`${inputRef.current.value} 님 환영합니다`);
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  return (
    <div>
      <input type='text' ref={inputRef} placeholder='이름을 입력하세요'></input>
      <button onClick={login}>로그인</button>
    </div>
  )
}



const Example7 = () => {

  const [isDark, setIsDark] = useState(false);

  return (
    <div>
      <UserContext.Provider value={'김민영'}>
        <ThemeContext.Provider value={{isDark, setIsDark}}>
          <Page></Page>
        </ThemeContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

//저장소 생성
const ThemeContext = createContext(null);
const UserContext = createContext(null);

const Page = ({isDark, setIsDark}) => {

  return(
    <div>
      <Head></Head>
      <Content></Content>
      <Footer></Footer>
    </div>
  )
}

const Head = () => {

  // 저장소에 보관된 값을 가져옴
  const {isDark} = useContext(ThemeContext);
  const user = useContext(UserContext); 

  return (
    <div>
      <header className='header' style={{
        backgroundColor: isDark ? 'black':'lightgray',
        color: isDark ? 'white':'black',
      }}
      >
        <h2>{user} 님 환영합니다!</h2>
      </header>
    </div>
  )
}

const Content = () => {
  
  // 저장소에 보관된 값을 가져옴
  const {isDark} = useContext(ThemeContext);
  const user = useContext(UserContext); 

  return (
    <div className='content' style={{
        backgroundColor: isDark ? 'black':'lightgray',
        color: isDark ? 'white':'black',
      }}
      >
        <h2>{user} 님 환영합니다!</h2>
    </div>
  )
}

const Footer = () => {
  
  // 저장소에 보관된 값을 가져옴
  const {isDark, setIsDark} = useContext(ThemeContext);

  return (
    <div className='footer' style={{
      backgroundColor: isDark ? 'black':'lightgray',
      color: isDark ? 'white':'black',
    }}>
      <br></br>
      <button className='button' onClick={() => setIsDark(!isDark)}>Dark Mode</button>
    </div>
  )
}



const Example8 = () => {

  const [hardNumber, setHardNumber] = useState(1);
  //const hardSum = hardCalculate(hardNumber);

  const [easyNumber, setEasyNumber] = useState(1);
  const easySum = easyCalculate(easyNumber);

  const hardSum = useMemo(() => {
    return hardCalculate(hardNumber);
  }, [hardNumber]) //hardSum이 변경될 때만 콜백함수가 실행, 변경이 일어나지 않으면 그 전에 갖고 있던 값을 재사용

  return (
    <div>
      <h3>짜증나는 계산기</h3>
      <input type='number' value={hardNumber} 
             onChange={(e) => setHardNumber(parseInt(e.target.value))}></input>
      <span> + 10,000 = {hardSum}</span>
      <br></br>
      <h3>조금 덜 짜증나는 계산기</h3>
      <input type='number' value={easyNumber} 
             onChange={(e) => setEasyNumber(parseInt(e.target.value))}></input>
      <span> + 10,000 = {easySum}</span>
    </div>
  )
}

const hardCalculate = (number) => {
  console.log("짜증나는 계산기 렌더링");
  for(let i=0;i<999999999;i++){} //그냥 늦게 결과 나오게 지연시킴
  return number + 10000;
}

const easyCalculate = (number) => {
  console.log("조금 덜 짜증나는 계산기 렌더링");
  return number + 10000;
  //이것도 속도가 느려지는 것을 해결하기 위해서 useMemo를 사용
}



const Example9 = () => {

  const [number, setNumber] = useState(0);
  const [isKorea, setIsKorea] = useState(true);
  //const location = isKorea ? '한국':'외국';
  const location = useMemo(() => {
    return {country : isKorea ? '한국':'외국'}
  }, [isKorea]);
    
/*
  useEffect(() => {
    console.log('useEffect 호출')
  }, [location]) //location이 바뀔 때만 값이 바뀜
*/
  return (
    <div>
      <h3>하루에 몇 끼 먹나요?</h3>
      <input type='number' value={number} onChange={(e) => {setNumber(e.target.value)}}></input>
      <h3>어느 나라에 있나요?</h3>
      <p>나라: {location.country}</p>
      <button onClick={() => {setIsKorea(!isKorea)}}>비행기 타기</button>
    </div>
  );

}




const CopyTest = () => {

  const [object, setObject] = useState([{
    name: '김민영',
    gender: '여자'
  }]);

  const objectList = object.map(( {name, gender}) => {
    return (
      <p key={name}>{name} - {gender}</p>
    )
  })

  const copy = {...object}; //얇은 복사 (shallow copy)
    //const copy = Object.assign({}, object); 랑 같음

  const copy1 = object; //깊은 복사 (deep copy)


  return (
    <div>
      <p>object : {objectList}</p>
      <h3>얇은 복사: 두 개가 같나요?</h3>
      <span>{object === copy ? 'Yes':'No'} : 주소는 다름</span>
      <h3>깊은 복사: 두 개가 같나요?</h3>
      <span>{object === copy1 ? 'Yes':'No'} : 주소까지 같음</span>
      
    </div>
  )

}



const Example10 = () => {

  const [number, setNumber] = useState(0);

  const someFunction = useCallback(() => {console.log(`someFunction : number : ${number}`);}, [number]);
   //template 표기법
  
  useEffect(() => {console.log("someFunction 이 변경되었습니다")});

  return (
    <div>
      <input type='number' value={number} onChange={(e) => {setNumber(e.target.value)}}></input>
      <br />
      <button onClick={someFunction}>Call someFunction</button>
    </div>
  )
}



const Example11 = () => {
  const [size, setSize] = useState(100);
  const [isDark, setIsDark] = useState(false);

  const createBoxStyle = {
    backgroundColor: 'blue',
    width: `${size}px`,
    height: `${size}px`
  }


  return (
    <div style={{background:isDark?'black':'white'}}>
      <input type='number' value={size} onChange={(e) => setSize(e.target.value)} />
      <button onClick={() => setIsDark(!isDark)}>Change Theme</button>
      <br />
      <Box createBoxStyle={createBoxStyle}/>

    </div>
  )

}

const Box = ({createBoxStyle}) => {
  const [style, setStyle] = useState();

  useEffect(() => {
    console.log("box size increasing");
    setStyle(createBoxStyle);
  }, [createBoxStyle])

  return (
    <div style={style}>

    </div>
  )
}
 
export default App;
