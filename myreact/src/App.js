
import './App.css';
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';


function App() {
  const name = "REACT";
  return (
      <div className="react">
        <h1>이번 프로젝트는 {name} 프로젝트입니다.</h1>
        <hr />
        <>react 문법 간단하게 정리</><br />
        <h4>º 중괄호 안에는 JavaScript 문법</h4>
        {/*{alert("JavaScript")}*/}
        <h4>º if문은 못씀 !! 참이면 and 뒤의 것 출력, 거짓이면 or 뒤의 것 출력</h4>
        {}
        <h4>º 주석은 {/**/} 이거!</h4>
        <br />

        <h1>▶Props 예제</h1>
        <MyComponent favoriteNumber="3">이렇게 값이 넘어옴!</MyComponent>
        
        <h1>▶Props 예제 - prop 안쓰고 </h1>
        <MyComponent2 name="김민영" favoriteNumber="3">이렇게 값이 넘어옴!</MyComponent2>
        
        <h1>▶변수와 State의 차이</h1>
        <MyState></MyState>

        <h1>▶State 예제</h1>
        <Say></Say>

        <h1>▶Event 예제</h1>
        <EventExample></EventExample>

        <h1>▶반복문 출력 예제</h1>
        <IterationExample></IterationExample>
      </div>
      
  );
}



const MyComponent = (props) => {

  return (

    <div>
      
      (여긴 name값이 없으니까 밑의 default가 나옴) <br />
      안녕하세요 제 이름은 {props.name}입니다 <br />
      children은 props.children으로 하고, {props.children} 입니다 <br />
      제가 가장 좋아하는 숫자는 {props.favoriteNumber} 입니다
    </div>

  );

}



const MyComponent2 = ({name, favoriteNumber, children}) => {

  return (

    <div>
      
      안녕하세요 제 이름은 {name}입니다 <br />
      children은 children으로 하고, {children} 입니다 <br />
      제가 가장 좋아하는 숫자는 {favoriteNumber} 입니다

    </div>

  );

}


MyComponent.defaultProps = {
  name: "김보리"
}

MyComponent.prototype = {
  name: PropTypes.string,
  favoriteNumber: PropTypes.number.isRequired
}



const MyState = () => {

  const [number, setNumber] = useState(1);
  let numberVar = 1;

  const  increaseCountVar = ()=> {
    numberVar ++;
    console.log("변수 = " + numberVar);
  }

  return (
    <div>
      <p>변수: {numberVar}</p>
      <button onClick={increaseCountVar}>변수 1 증가시키기</button>

      <p>State: {number}</p>  
      <button onClick={() => {
        setNumber(number + 1);
        console.log("state = " + number);
      }}>state 1 증가시키기</button>

      <h3>state는 렌더링이 돼서 화면이 실시간으로 바뀐다</h3>
    </div>
  );
}



const Say = () => {

  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");

  const enterBtn = () => {
    setMessage("입장하셨습니다");
  }

  const exitBtn = () => {
    setMessage("안녕히 가세요");
  }


  return (

    <div>
      <button onClick={enterBtn}>입장</button>
      <button onClick={exitBtn}>퇴장</button>
      <h3 style={{color}}>{message}</h3>
      <button style={{color:'pink'}} onClick={() => setColor('pink')}>pink</button>
      <button style={{color:'blue'}} onClick={() => setColor('blue')}>blue</button>
      <button style={{color:'purple'}} onClick={() => setColor('purple')}>purple</button>
    </div>

  );
}



const EventExample = () => {

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  }
  
  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  }
  
  const submit = () => {
    alert("username is " + username + ", and message is " + message);
    setUsername("");
    setMessage("");
  }

  return (

    <div>
      <input type="text" name="username" placeholder="사용자 명" value={username}
        onChange={onChangeUsername}></input>
      <input type='text' name="message" placeholder='메세지 입력' value={message}
        onChange={onChangeMessage}></input>
      <button onClick={submit}>확인</button>
    </div>

  );

}



const IterationExample = () => {
  
  const [names, setNames] = useState([
    {id:1, text:"Spring"},
    {id:2, text:"Summer"},
    {id:3, text:"Autumn"},
    {id:4, text:"Winter"},
  ]);

  const [inputText, setInputText] = useState('');
  const [nextId, setNextId] = useState(5);

  const nameList = names.map((name) => (
    //map 함수는 자동으로 for문을 돌려서 key와 value값을 반환하는 역할을 함
      //react에서는 element 반복 출력할 때 key값이 무조건 있어야 함
    <li key={name.id} onDoubleClick={() => onRemove(name.id)}>{name.text}</li>
  ));

  const onChange = (e) => {
    setInputText(e.target.value);
  }

  const onClick = () => {
    const nextNames = names.concat({
      id: nextId, 
      text: inputText
    });
    setNextId(nextId+1);
    setNames(nextNames);
    setInputText("");
  }
  
  const onRemove = (id) => {
    const nextNames = names.filter((name) => name.id !== id);
    setNames(nextNames);
  }

  return (

    <div>
      <input type='text' value={inputText} onChange={onChange} />
      <button onClick={onClick}>추가</button>
      <ul>{nameList}</ul>
    </div>

  );

}
 

export default App;
