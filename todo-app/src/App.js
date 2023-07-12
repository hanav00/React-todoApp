import React, { useState, useRef, useCallback } from 'react';
import TodoTemplate from './components/TodoTemplate';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList';
 
const App = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: '일정관리 웹 어플리케이션 만들기',
      checked: true,
    },
    {
      id: 2,
      text: 'news api 사용해서 뉴스 뷰어 만들기',
      checked: true,
    },
    {
      id: 3,
      text: '리엑트 프로젝트 PPT 만들기',
      checked: false,
    },
  ]);

    // 고윳값으로 사용될 id
  // ref를 사용하여 변수 담기
  const nextId = useRef(4);
 
  const onInsert = useCallback(
    text => {
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      setTodos(todos.concat(todo));
      nextId.current += 1; // nextId 1씩 더하기
    },
    [todos],
  );

  const onRemove = useCallback(
    id => {
      setTodos(todos.filter(todo => todo.id !== id));
    },
    [todos],
  );

  const onToggle = useCallback(
    id => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo,
        ),
      );
    },
    [todos],
  );

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle}/>
    </TodoTemplate>
  );

};
 
export default App;
