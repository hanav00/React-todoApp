import { Route, Routes } from '../node_modules/react-router-dom/dist/index';
import NewsPage from './pages/NewsPage';

function App() {
  //const [category, setCategory] = useState('all');
  //const onSelect = useCallback(category => setCategory(category), []);
  return (
    <Routes>
      <Route path='/' element={<NewsPage />} />
      <Route path='/:category' element={<NewsPage />} />
    </Routes>
  )
}

export default App;
